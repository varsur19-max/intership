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


$sql = "UPDATE products SET is_del = 1 WHERE id = $id AND is_del = 0 $ownerSql";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (mysqli_affected_rows($db) === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Ապրանքը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(200);
echo json_encode(['message' => 'Ապրանքը ջնջված է։'], JSON_UNESCAPED_UNICODE);
exit;
