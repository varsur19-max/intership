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

$name = mysqli_real_escape_string($db, $name);
$description = mysqli_real_escape_string($db, $description);
$stock = intval($stock);


$category_id = $_POST['category_id'] ?? '';
if (!ctype_digit($category_id) || strlen($category_id) > 10 || intval($category_id) < 1) {
    http_response_code(422);
    echo json_encode(['error' => 'Ընտրիր ապրանքի կատեգորիան։'], JSON_UNESCAPED_UNICODE);
    exit;
}
$category_id = intval($category_id);
$res = mysqli_query($db, "SELECT id FROM menu_items WHERE id = $category_id");
if (!$res) {
    error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Կատեգորիայի ստուգումը չհաջողվեց։'], JSON_UNESCAPED_UNICODE);
    exit;
}
if (!mysqli_fetch_assoc($res)) {
    http_response_code(422);
    echo json_encode(['error' => 'Կատեգորիան չի գտնվել։ Ընտրիր գործող կատեգորիա։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$user_id = intval($_SESSION['user_id']);

$sql = "INSERT INTO products (name, description, price, stock, category_id, user_id)
        VALUES ('$name', '$description', '$price', $stock, $category_id, $user_id)";

$res = mysqli_query($db, $sql);

if (!$res) {
    error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode([
        'error' => 'MySQL սխալ ' . mysqli_errno($db) . ': ' . mysqli_error($db)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(201);
echo json_encode(['message' => 'Ապրանքն ավելացված է։', 'id' => mysqli_insert_id($db)], JSON_UNESCAPED_UNICODE);
exit;
