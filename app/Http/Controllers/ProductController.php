<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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
        ]);

        $query = Product::with([
            'user:id,name',
            'category:id,title',
        ]);

        if (isset($data['category_id'])) {
            $query->where('category_id', $data['category_id']);
        }

        return response()->json(
            $query->orderBy('sort_order')
                ->orderByDesc('id')
                ->paginate(5)
                ->withQueryString()
        );
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

    public function categories(): JsonResponse
    {
        $categories = MenuItem::orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'title']);

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateProduct($request);

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

    public function update(Request $request, Product $product): JsonResponse
    {
        abort_unless(
            $this->canManage($request, $product),
            403,
            'Դու իրավունք չունես խմբագրելու այս ապրանքը։'
        );

        $data = $this->validateProduct($request);

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

    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:10000'],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:99999999.99',
                'decimal:0,2',
            ],
            'stock' => [
                'required',
                'integer',
                'min:0',
                'max:4294967295',
            ],
            'category_id' => [
                'nullable',
                'integer',
                'exists:menu_items,id',
            ],

            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ], [
            'name.required' => 'Գրիր ապրանքի անունը։',
            'name.max' => 'Անունը կարող է ունենալ առավելագույնը 150 նիշ։',
            'description.required' => 'Գրիր նկարագրությունը։',
            'description.max' => 'Նկարագրությունը չափազանց երկար է։',
            'price.required' => 'Գրիր գինը։',
            'price.numeric' => 'Գինը պետք է լինի թիվ։',
            'price.min' => 'Գինը չի կարող բացասական լինել։',
            'price.max' => 'Գինը չափազանց մեծ է։',
            'price.decimal' => 'Գինը կարող է ունենալ մինչև 2 տասնորդական նիշ։',
            'stock.required' => 'Գրիր քանակը։',
            'stock.integer' => 'Քանակը պետք է լինի ամբողջ թիվ։',
            'stock.min' => 'Քանակը չի կարող բացասական լինել։',
            'stock.max' => 'Քանակը չափազանց մեծ է։',
            'category_id.exists' => 'Ընտրված կատեգորիան գոյություն չունի։',
            'image.image' => 'Ընտրված ֆայլը պետք է լինի նկար։',
            'image.mimes' => 'Թույլատրվում են միայն JPG, PNG և WebP նկարներ։',
            'image.max' => 'Նկարի առավելագույն չափը 2 ՄԲ է։',
            'image.uploaded' => 'Նկարի վերբեռնումը չհաջողվեց։ Ստուգիր ֆայլի չափը։',
        ]);
    }
}
