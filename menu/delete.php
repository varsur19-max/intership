<?php

require_once 'other/auth.php';

$id = $_POST['id'] ?? '';

if (!ctype_digit($id) || intval($id) < 1 || strlen($id) > 10) {
    http_response_code(422);
    echo json_encode(['error' => 'Սխալ ID։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = intval($id);

$sql = 'START TRANSACTION';

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = 'SELECT id FROM menu_lock WHERE id = 1 FOR UPDATE';

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "SELECT parent_id FROM menu_items WHERE id = $id";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$item = mysqli_fetch_assoc($res);

if (!$item) {
    http_response_code(404);
    echo json_encode(['error' => 'Մենյուի տարրը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$parent_id = 'NULL';

if ($item['parent_id'] !== null) {
    $parent_id = intval($item['parent_id']);
}

$sql = "UPDATE menu_items SET parent_id = $parent_id WHERE parent_id = $id";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "UPDATE products SET category_id = NULL WHERE category_id = $id";
$res = mysqli_query($db, $sql);
if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "DELETE FROM menu_items WHERE id = $id";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = 'COMMIT';

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(200);
echo json_encode(['message' => 'Տարրը ջնջված է։ Ենթատարրերը տեղափոխված են մեկ մակարդակ վերև։'], JSON_UNESCAPED_UNICODE);
exit;
