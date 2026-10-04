<?php

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Նախ մուտք գործիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$user_id = intval($_SESSION['user_id']);

$sql = "SELECT id, full_name, status FROM users WHERE id = $user_id";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$user = mysqli_fetch_assoc($res);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Օգտատերը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (empty($allowUser) && $user['status'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Այս գործողությունը միայն ադմինի համար է։'], JSON_UNESCAPED_UNICODE);
    exit;
}
