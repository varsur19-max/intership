<?php

$allowUser = true;
require_once 'other/auth.php';

$id = $_POST['id'] ?? '';

if (!ctype_digit($id) || intval($id) < 1 || strlen($id) > 10) {
    http_response_code(422);
    echo json_encode(['error' => 'Սխալ ID։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = intval($id);

$res = mysqli_query($db, "SELECT user_id FROM products WHERE id = $id AND is_del = 0");
if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Ապրանքի ստուգումը չհաջողվեց։'], JSON_UNESCAPED_UNICODE);
    exit;
}
$product = mysqli_fetch_assoc($res);
if (!$product) {
    http_response_code(404);
    echo json_encode(['error' => 'Ապրանքը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($user['status'] !== 'admin' && intval($product['user_id']) !== $user_id) {
    http_response_code(403);
    echo json_encode(['error' => 'Կարող ես փոփոխել կամ ջնջել միայն քո ապրանքները։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$ownerSql = '';
if ($user['status'] !== 'admin') {
    $ownerSql = " AND user_id = $user_id";
}


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

$priceParts = explode('.', $price);
$wholePart = $priceParts[0];
$decimalPart = $priceParts[1] ?? '0';

if (count($priceParts) > 2 || !ctype_digit($wholePart) || !ctype_digit($decimalPart)
    || strlen($wholePart) > 8 || strlen($decimalPart) > 2) {
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
if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Կատեգորիայի ստուգումը չհաջողվեց։'], JSON_UNESCAPED_UNICODE);
    exit;
}
if (!mysqli_fetch_assoc($res)) {
    http_response_code(422);
    echo json_encode(['error' => 'Կատեգորիան չի գտնվել։ Ընտրիր գործող կատեգորիա։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "UPDATE products
        SET name = '$name', description = '$description', price = '$price', stock = $stock, category_id = $category_id,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $id AND is_del = 0 $ownerSql
        AND (BINARY name <> BINARY '$name' OR BINARY description <> BINARY '$description'
             OR price <> '$price' OR stock <> $stock
             OR category_id IS NULL OR category_id <> $category_id)";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(200);
echo json_encode(['message' => 'Փոփոխությունները պահպանված են։'], JSON_UNESCAPED_UNICODE);
exit;
