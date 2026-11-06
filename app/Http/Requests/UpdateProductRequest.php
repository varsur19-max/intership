<?php

namespace App\Http\Requests;

use Illuminate\Auth\Access\AuthorizationException;

class UpdateProductRequest extends StoreProductRequest
{
    public function authorize(): bool
    {
        return $this->route('product')->isManagedBy($this->user());
    }

    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('Դու իրավունք չունես խմբագրելու այս ապրանքը։');
    }
}
