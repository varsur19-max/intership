<?php

$_SESSION = [];
session_regenerate_id(true);
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

http_response_code(200);
echo json_encode(['message' => 'Դուրս եկար։'], JSON_UNESCAPED_UNICODE);
exit;
