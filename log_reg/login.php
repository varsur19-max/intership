<?php

$email = trim($_POST['email'] ?? '');

$password = $_POST['password'] ?? '';
$email = mysqli_real_escape_string($db, $email);

$sql = "SELECT * FROM users WHERE email = '$email'";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$user = mysqli_fetch_assoc($res);

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Սխալ email կամ գաղտնաբառ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];
$_SESSION['status'] = $user['status'];
$_SESSION['user_name'] = $user['full_name'];
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

http_response_code(200);
echo json_encode(['message' => 'Մուտքը հաջողվեց։'], JSON_UNESCAPED_UNICODE);
exit;
