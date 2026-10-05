<?php

use App\Http\Controllers\ProductController;

$router->get('/api/products', [ProductController::class, 'index']);
$router->get('/api/product', [ProductController::class, 'show']);
