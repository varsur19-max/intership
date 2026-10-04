<?php

$allowUser = true;
require_once 'other/auth.php';

$name = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$price = trim($_POST['price'] ?? '');
$stock = trim($_POST['stock'] ?? '');

if ($name === '' || strlen($name) > 240) {
    http_response_code(422);
    echo json_encode(['error' => 'Անվանումը պարտադիր է, մինչև 240 բայթ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($description === '' || strlen($description) > 10000) {
    http_response_code(422);
    echo json_encode(['error' => 'Նկարագրությունը պարտադիր է, մինչև 10000 բայթ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($stock <= 0 || $stock === '') {
    http_response_code(422);
    echo json_encode(['error' => 'նշեք քանակը։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$priceParts = explode('.', $price);
$wholePart = $priceParts[0];
$decimalPart = $priceParts[1] ?? '0';

if (
    count($priceParts) > 2 || !ctype_digit($wholePart) || !ctype_digit($decimalPart)
    || strlen($wholePart) > 8 || strlen($decimalPart) > 2
) {
    http_response_code(422);
    echo json_encode(['error' => 'Գինը՝ 0–99999999.99, մինչև 2 տասնորդական թվանշան։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!ctype_digit($stock) || strlen($stock) > 7) {
    http_response_code(422);
    echo json_encode(['error' => 'Քանակը պետք է լինի ամբողջ թիվ՝ 0–9999999։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stock = intval($stock);


require_once __DIR__ . '/../other/product_category.php';

$user_id = intval($_SESSION['user_id']);

require_once 'other/product_image.php';
$image = readProductImage();
$imageData = $image['data'] ?? null;
$imageMime = $image['mime'] ?? null;
// Bound parameters safely send the binary image to MySQL.
$stmt = mysqli_prepare($db, "INSERT INTO products (name, description, price, stock, category_id, user_id, image_data, image_mime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}
mysqli_stmt_bind_param($stmt, 'sssiiiss', $name, $description, $price, $stock, $category_id, $user_id, $imageData, $imageMime);
$res = mysqli_stmt_execute($stmt);

if (!$res) {
    error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode([
        'error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(201);
echo json_encode(['message' => 'Ապրանքն ավելացված է։', 'id' => mysqli_insert_id($db)], JSON_UNESCAPED_UNICODE);
exit;
