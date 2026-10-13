<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'title',
        'url',
        'parent_id',
        'sort_order',
    ];

    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id')
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}