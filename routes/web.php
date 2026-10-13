<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'app')->name('home');

Route::get('/auth/user', [AuthController::class, 'current']);

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,1');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:10,1');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth');

Route::get('/products', [ProductController::class, 'index']);

Route::get('/categories', [ProductController::class, 'categories']);

Route::post('/products', [ProductController::class, 'store'])
    ->middleware('auth');

Route::get('/products/{product}', [ProductController::class, 'show'])
    ->whereNumber('product');

Route::put('/products/{product}', [ProductController::class, 'update'])
    ->whereNumber('product')
    ->middleware('auth');

Route::delete('/products/{product}', [ProductController::class, 'destroy'])
    ->whereNumber('product')
    ->middleware('auth');

Route::get('/menu-items', [MenuItemController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::post('/menu-items', [MenuItemController::class, 'store']);

    Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update'])
        ->whereNumber('menuItem');

    Route::patch('/menu-items/{menuItem}/parent', [MenuItemController::class, 'moveToParent'])
        ->whereNumber('menuItem');

    Route::delete('/menu-items/{menuItem}', [MenuItemController::class, 'destroy'])
        ->whereNumber('menuItem');
});

Route::patch(
    '/products/{product}/category',
    [ProductController::class, 'moveToCategory']
)
    ->whereNumber('product')
    ->middleware('auth');

Route::patch(
    '/products/{product}/position',
    [ProductController::class, 'reorder']
)
    ->whereNumber('product')
    ->middleware('auth');
