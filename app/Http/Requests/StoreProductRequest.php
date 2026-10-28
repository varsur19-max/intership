<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Մուտք գործած լինելը ստուգում է route-ի 'auth' middleware-ը։
        return true;
    }

    public function rules(): array
    {
        return [
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
        ];
    }

    public function messages(): array
    {
        return [
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
        ];
    }
}