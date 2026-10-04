<?php

use App\Http\Controllers\ProductController;

// GET հասցեն կապում ենք Controller-ի համապատասխան ֆունկցիայի հետ։
$router->get('/api/products', [ProductController::class, 'index']);
$router->get('/api/product', [ProductController::class, 'show']);
