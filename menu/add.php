<?php

require_once 'other/auth.php';

$id = 0;
$title = trim($_POST['title'] ?? '');
$parent_id = trim($_POST['parent_id'] ?? '');
$sort_order = trim($_POST['sort_order'] ?? '');

if ($title === '' || strlen($title) > 240) {
    http_response_code(422);
    echo json_encode(['error' => 'Մենյուի անվանումը պարտադիր է, մինչև 240 բայթ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!ctype_digit($parent_id) || strlen($parent_id) > 10 || !ctype_digit($sort_order) || strlen($sort_order) > 7) {
    http_response_code(422);
    echo json_encode(['error' => 'Ծնողը և հերթականությունը պետք է ճիշտ թվեր լինեն։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$parent_id = intval($parent_id);
$sort_order = intval($sort_order);
$title = mysqli_real_escape_string($db, $title);

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

if ($id > 0) {
    $sql = "SELECT id FROM menu_items WHERE id = $id";

    $res = mysqli_query($db, $sql);

    if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
        http_response_code(500);
        echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (!mysqli_fetch_assoc($res)) {
        http_response_code(404);
        echo json_encode(['error' => 'Մենյուի տարրը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

$current_id = $parent_id;
$visited = [];

while ($current_id > 0) {
    if ($current_id === $id || isset($visited[$current_id])) {
        http_response_code(422);
        echo json_encode(['error' => 'Ինքն իրեն կամ սեփական ենթամենյուն ծնող ընտրել չի կարելի։'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $visited[$current_id] = true;

    $sql = "SELECT parent_id FROM menu_items WHERE id = $current_id";

    $res = mysqli_query($db, $sql);

    if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
        http_response_code(500);
        echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $row = mysqli_fetch_assoc($res);

    if (!$row) {
        http_response_code(422);
        echo json_encode(['error' => 'Ծնող տարրը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $current_id = intval($row['parent_id']);
}

$parentSql = 'NULL';

if ($parent_id > 0) {
    $parentSql = $parent_id;
}

$sql = "INSERT INTO menu_items (title, parent_id, sort_order)
        VALUES ('$title', $parentSql, $sort_order)";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$id = mysqli_insert_id($db);

$sql = 'COMMIT';

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(201);
echo json_encode(['message' => 'Մենյուն ավելացված է։', 'id' => $id], JSON_UNESCAPED_UNICODE);
exit;
