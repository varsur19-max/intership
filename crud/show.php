<?php

$id = $_GET['id'] ?? '';

if (!ctype_digit($id) || intval($id) < 1 || strlen($id) > 10) {
    http_response_code(422);
    echo json_encode(['error' => 'Սխալ ID։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = intval($id);

$sql = "SELECT products.id, products.name, products.description, products.price, products.stock, products.user_id, products.is_del, products.created_at, products.updated_at, products.category_id, (products.image_data IS NOT NULL) AS has_image, menu_items.title AS category_name, users.full_name AS author_name
        FROM products
        LEFT JOIN menu_items ON menu_items.id = products.category_id
        LEFT JOIN users ON users.id = products.user_id
        WHERE products.id = $id AND products.is_del = 0";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$product = mysqli_fetch_assoc($res);

if (!$product) {
    http_response_code(404);
    echo json_encode(['error' => 'Ապրանքը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(200);
echo json_encode(['product' => $product], JSON_UNESCAPED_UNICODE);
exit;
