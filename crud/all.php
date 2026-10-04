<?php

$categorySql = '';
if (isset($_GET['category_id'])) {
    $category_id = $_GET['category_id'];
    if (!ctype_digit($category_id) || strlen($category_id) > 10 || intval($category_id) < 1) {
        http_response_code(422);
        echo json_encode(['error' => 'Սխալ կատեգորիա։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $category_id = intval($category_id);
    $categorySql = " AND products.category_id = $category_id";
}
$sql = "SELECT products.id, products.name, products.description, products.price, products.stock, products.user_id, products.is_del, products.created_at, products.updated_at, products.category_id, (products.image_data IS NOT NULL) AS has_image, menu_items.title AS category_name FROM products
        LEFT JOIN menu_items ON menu_items.id = products.category_id
        WHERE products.is_del = 0 $categorySql ORDER BY products.id DESC";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Ապրանքներ դեռ չկան'], JSON_UNESCAPED_UNICODE);
    exit;
}

$products = [];

while ($row = mysqli_fetch_assoc($res)) {
    $products[] = $row;
}

http_response_code(200);
echo json_encode(['products' => $products], JSON_UNESCAPED_UNICODE);
exit;
