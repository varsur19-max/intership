<?php

$sql = "SELECT * FROM menu_items ORDER BY sort_order, id";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$items = [];

while ($row = mysqli_fetch_assoc($res)) {
    $items[] = $row;
}

http_response_code(200);
echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE);
exit;
