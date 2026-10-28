<?php

namespace App\Http\Requests;

use Illuminate\Auth\Access\AuthorizationException;

class UpdateProductRequest extends StoreProductRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        $product = $this->route('product');

        if (! $user) {
            return false;
        }

        return (int) $product->user_id === (int) $user->id
            || $user->isAdmin();
    }

    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('Դու իրավունք չունես խմբագրելու այս ապրանքը։');
    }
}