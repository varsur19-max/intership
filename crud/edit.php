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


require_once __DIR__ . '/../other/product_category.php';

$categorySql = $category_id === null ? 'NULL' : $category_id;

require_once 'other/product_image.php';
$image = readProductImage();
$removeImage = ($_POST['remove_image'] ?? '') === '1';
$changeImage = $image !== null || $removeImage;
$imageSql = $changeImage ? ', image_data = ?, image_mime = ?' : '';
$imageCondition = $changeImage ? ' OR 1 = 1' : '';
$imageData = $image['data'] ?? null;
$imageMime = $image['mime'] ?? null;
// Leaving the file input empty keeps the existing image.
$sql = "UPDATE products
        SET name = '$name', description = '$description', price = '$price', stock = $stock, category_id = $categorySql,
            updated_at = CURRENT_TIMESTAMP $imageSql
        WHERE id = $id AND is_del = 0 $ownerSql
        AND (BINARY name <> BINARY '$name' OR BINARY description <> BINARY '$description'
             OR price <> '$price' OR stock <> $stock
             OR NOT (category_id <=> $categorySql) $imageCondition)";
$stmt = mysqli_prepare($db, $sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($changeImage) mysqli_stmt_bind_param($stmt, 'ss', $imageData, $imageMime);
$res = mysqli_stmt_execute($stmt);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(200);
echo json_encode(['message' => 'Փոփոխությունները պահպանված են։'], JSON_UNESCAPED_UNICODE);
exit;
