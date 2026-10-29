<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Product;
use Illuminate\Auth\Events\Failed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends Controller
{
    public function reorder(Request $request, Product $product): JsonResponse
    {
        abort_unless(
            $request->user()?->isAdmin(),
            403,
            'Հերթականությունը կարող է փոխել միայն ադմինիստրատորը։'
        );

        $data = $request->validate([
            'before_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $movingId = (int) $product->id;
        $beforeId = (int) $data['before_id'];

        if ($movingId === $beforeId) {
            return response()->json([
                'message' => 'Հերթականությունը չի փոխվել։',
            ]);
        }

        DB::transaction(function () use ($movingId, $beforeId) {
            $products = Product::orderBy('sort_order')
                ->orderByDesc('id')
                ->lockForUpdate()
                ->get(['id', 'sort_order']);

            $ids = [];

            foreach ($products as $item) {
                $ids[] = (int) $item->id;
            }

            abort_unless(
                in_array($movingId, $ids, true)
                && in_array($beforeId, $ids, true),
                404,
                'Ապրանքը այլևս հասանելի չէ։'
            );

            $oldPosition = array_search($movingId, $ids, true);

            array_splice($ids, $oldPosition, 1);

            $newPosition = array_search($beforeId, $ids, true);

            array_splice($ids, $newPosition, 0, [$movingId]);

            foreach ($ids as $position => $id) {
                DB::table('products')
                    ->where('id', $id)
                    ->update([
                        'sort_order' => $position + 1,
                    ]);
            }
        }, 3);

        return response()->json([
            'message' => 'Հերթականությունը պահպանվեց։',
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1', 'max:1000000'],
            'category_id' => [
                'nullable',
                'integer',
                'exists:menu_items,id',
            ],
            'search' => ['nullable', 'string', 'max:150'],
        ]);

        $query = Product::with([
            'user:id,name',
            'category:id,title',
        ]);

        $categoryIds = isset($data['category_id'])
            ? $this->categoryWithDescendantIds((int) $data['category_id'])
            : null;

        if ($categoryIds !== null) {
            $query->whereIn('category_id', $categoryIds);
        }

        if (filled($data['search'] ?? null)) {
            $query->where(
                'name',
                'like',
                '%' . $this->escapeLike($data['search']) . '%'
            );
        }

        $result = $query->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(5)
            ->withQueryString()
            ->toArray();

        $result['suggestions'] = filled($data['search'] ?? null) && $result['total'] === 0
            ? $this->suggestProducts($data['search'], $categoryIds)
            : [];

        return response()->json($result);
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $value);
    }

    private function categoryWithDescendantIds(int $categoryId): array
    {
        $childrenByParent = MenuItem::get(['id', 'parent_id'])
            ->groupBy('parent_id');

        $ids = [$categoryId];
        $queue = [$categoryId];

        while ($queue) {
            $current = array_shift($queue);

            foreach ($childrenByParent->get($current, []) as $child) {
                if (!in_array($child->id, $ids, true)) {
                    $ids[] = $child->id;
                    $queue[] = $child->id;
                }
            }
        }

        return $ids;
    }

    private function mbLevenshtein(string $first, string $second): int
    {
        $map = [];

        $encode = function (string $text) use (&$map): string {
            $result = '';

            foreach (mb_str_split($text) as $char) {
                if (!isset($map[$char])) {
                    $map[$char] = chr(count($map));
                }

                $result .= $map[$char];
            }

            return $result;
        };

        return levenshtein($encode($first), $encode($second));
    }

    private function distanceToName(string $needle, string $name): int
    {
        $name = mb_strtolower($name);

        $candidates = array_merge([$name], preg_split('/\s+/u', $name));

        return min(array_map(
            fn(string $candidate) => $this->mbLevenshtein($needle, $candidate),
            $candidates
        ));
    }

    private function suggestProducts(string $search, ?array $categoryIds): array
    {
        $needle = mb_strtolower($search);
        $maxDistance = (int) ceil(mb_strlen($needle) * 0.4);

        $query = Product::query();

        if ($categoryIds !== null) {
            $query->whereIn('category_id', $categoryIds);
        }

        return $query->pluck('name')
            ->unique()
            ->map(fn(string $name) => [
                'name' => $name,
                'distance' => $this->distanceToName($needle, $name),
            ])
            ->filter(fn(array $item) => $item['distance'] <= $maxDistance)
            ->sortBy('distance')
            ->take(5)
            ->pluck('name')
            ->values()
            ->all();
    }

    public function moveToCategory(Request $request, Product $product): JsonResponse
    {
        abort_unless(
            $this->canManage($request, $product),
            403,
            'Դու իրավունք չունես տեղափոխելու այս ապրանքը։'
        );

        $data = $request->validate([
            'category_id' => [
                'present',
                'nullable',
                'integer',
                'exists:menu_items,id',
            ],
        ], [
            'category_id.present' => 'Կատեգորիայի դաշտը բացակայում է։',
            'category_id.exists' => 'Ընտրված կատեգորիան գոյություն չունի։',
        ]);

        $product->update([
            'category_id' => $data['category_id'],
        ]);

        return response()->json([
            'message' => 'Ապրանքը տեղափոխվեց։',
        ]);
    }

    // public function categories(): JsonResponse
    // {
    //     $categories = MenuItem::orderBy('sort_order')
    //         ->orderBy('id')
    //         ->get(['id', 'title']);

    //     return response()->json($categories);
    // }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();

        unset($data['image']);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                ->store('products', 'public');

            abort_unless(
                $imagePath,
                500,
                'Նկարը պահպանել չհաջողվեց։'
            );

            $data['image'] = $imagePath;
        }

        try {
            $request->user()->products()->create($data);
        } catch (\Throwable $error) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $error;
        }

        return response()->json([
            'message' => 'Ապրանքը հաջողությամբ ավելացվեց։',
        ], 201);
    }

    public function show(Request $request, Product $product): JsonResponse
    {
        $product->load([
            'user:id,name',
            'category:id,title',
        ]);

        return response()->json([
            'product' => $product,
            'can_manage' => $this->canManage($request, $product),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $data = $request->validated();

        unset($data['image']);

        $oldImage = null;
        $newImage = null;

        if ($request->hasFile('image')) {
            $newImage = $request->file('image')
                ->store('products', 'public');

            abort_unless(
                $newImage,
                500,
                'Նկարը պահպանել չհաջողվեց։'
            );

            $data['image'] = $newImage;
        }

        try {
            DB::transaction(function () use ($product, $data, &$oldImage): void {
                $lockedProduct = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
                $oldImage = $lockedProduct->image;
                $lockedProduct->update($data);
            }, 3);
        } catch (\Throwable $error) {
            if ($newImage) {
                Storage::disk('public')->delete($newImage);
            }

            throw $error;
        }

        if ($newImage && $oldImage) {
            try {
                if (!Storage::disk('public')->delete($oldImage)) {
                    report(new \RuntimeException('Could not remove replaced product image.'));
                }
            } catch (\Throwable $error) {
                report($error);
            }
        }

        return response()->json([
            'message' => 'Ապրանքը հաջողությամբ թարմացվեց։',
        ]);
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        abort_unless(
            $this->canManage($request, $product),
            403,
            'Դու իրավունք չունես ջնջելու այս ապրանքը։'
        );

        $product->delete();

        return response()->json([
            'message' => 'Ապրանքը ջնջվեց։',
        ]);
    }

    private function canManage(Request $request, Product $product): bool
    {
        $user = $request->user();

        if (!$user) {
            return false;
        }

        return (int) $product->user_id === (int) $user->id
            || $user->isAdmin();
    }
}