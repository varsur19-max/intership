<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class MenuItemController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            MenuItem::orderBy('sort_order')
                ->orderBy('id')
                ->get(['id', 'title', 'parent_id', 'sort_order'])
        );
    }

    public function store(Request $request): JsonResponse
    {
        $this->checkAdmin($request);

        $data = $this->validateItem($request);

        MenuItem::create($data);

        return response()->json([
            'message' => 'Կատեգորիան ավելացվեց։',
        ], 201);
    }

    public function update(Request $request, MenuItem $menuItem): JsonResponse
    {
        $this->checkAdmin($request);

        $data = $this->validateItem($request);
        $this->updateTree($menuItem, $data);

        return response()->json(['message' => 'Կատեգորիան թարմացվեց։']);
    }

    public function moveToParent(Request $request, MenuItem $menuItem): JsonResponse
    {
        $this->checkAdmin($request);
        $data = $request->validate([
            'parent_id' => ['present', 'nullable', 'integer', 'exists:menu_items,id'],
        ], [
            'parent_id.present' => 'Ծնող կատեգորիայի դաշտը բացակայում է։',
            'parent_id.exists' => 'Ընտրված ծնող կատեգորիան գոյություն չունի։',
        ]);
        $this->updateTree($menuItem, $data);

        return response()->json(['message' => 'Կատեգորիան թարմացվեց։']);
    }

    private function updateTree(MenuItem $menuItem, array $data): void
    {
        DB::transaction(function () use ($data, $menuItem): void {
            $items = MenuItem::orderBy('id')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $lockedItem = $items->get($menuItem->id);
            abort_unless($lockedItem, 404);

            $parentId = $data['parent_id'];
            $visited = [];

            while ($parentId !== null) {
                $parentId = (int) $parentId;

                if (
                    $parentId === (int) $menuItem->id
                    || isset($visited[$parentId])
                ) {
                    throw ValidationException::withMessages([
                        'parent_id' => 'Կատեգորիան չի կարող լինել իր կամ իր ենթակետի ներսում։',
                    ]);
                }

                $visited[$parentId] = true;

                $parent = $items->get($parentId);

                if (! $parent) {
                    throw ValidationException::withMessages([
                        'parent_id' => 'Ծնող կատեգորիան գոյություն չունի։',
                    ]);
                }

                $parentId = $parent->parent_id;
            }

            $lockedItem->update($data);
        }, 3);
    }

    public function destroy(Request $request, MenuItem $menuItem): JsonResponse
    {
        $this->checkAdmin($request);

        $menuItem->delete();

        return response()->json([
            'message' => 'Կատեգորիան ջնջվեց։',
        ]);
    }

    private function checkAdmin(Request $request): void
    {
        abort_unless(
            $request->user()?->isAdmin(),
            403,
            'Այս գործողությունը հասանելի է միայն ադմինիստրատորին։'
        );
    }

    private function validateItem(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'parent_id' => [
                'present',
                'nullable',
                'integer',
                'exists:menu_items,id',
            ],
            'sort_order' => [
                'required',
                'integer',
                'min:0',
                'max:1000000',
            ],
        ], [
            'title.required' => 'Գրիր կատեգորիայի անունը։',
            'title.max' => 'Անունը կարող է ունենալ առավելագույնը 150 նիշ։',
            'parent_id.present' => 'Ծնող կատեգորիայի դաշտը բացակայում է։',
            'parent_id.exists' => 'Ընտրված ծնող կատեգորիան գոյություն չունի։',
            'sort_order.required' => 'Գրիր հերթականությունը։',
            'sort_order.integer' => 'Հերթականությունը պետք է լինի ամբողջ թիվ։',
            'sort_order.min' => 'Հերթականությունը չի կարող բացասական լինել։',
            'sort_order.max' => 'Հերթականության արժեքը չափազանց մեծ է։',
        ]);
    }
}
