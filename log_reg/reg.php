<?php

$email = trim($_POST['email'] ?? '');
$full_name = trim($_POST['full_name'] ?? '');

$password = $_POST['password'] ?? '';
$password2 = $_POST['password2'] ?? '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    http_response_code(422);
    echo json_encode(['error' => 'Գրիր ճիշտ email։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (strlen($full_name) < 2 || strlen($full_name) > 150) {
    http_response_code(422);
    echo json_encode(['error' => 'Անվան երկարությունը՝ 2–150 բայթ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (strlen($password) < 8 || strlen($password) > 72) {
    http_response_code(422);
    echo json_encode(['error' => 'Գաղտնաբառը՝ 8–72 բայթ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($password !== $password2) {
    http_response_code(422);
    echo json_encode(['error' => 'Գաղտնաբառերը տարբեր են։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$email = mysqli_real_escape_string($db, $email);
$full_name = mysqli_real_escape_string($db, $full_name);
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$sql = "SELECT id FROM users WHERE email = '$email'";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (mysqli_fetch_assoc($res)) {
    http_response_code(409);
    echo json_encode(['error' => 'Այս email-ն արդեն գրանցված է։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "SELECT id FROM users
        WHERE TRIM(full_name) COLLATE utf8mb4_unicode_ci = '$full_name' COLLATE utf8mb4_unicode_ci";
$res = mysqli_query($db, $sql);
if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    http_response_code(500);
    echo json_encode(['error' => 'Անվան ստուգումը չհաջողվեց։'], JSON_UNESCAPED_UNICODE);
    exit;
}
if (mysqli_fetch_assoc($res)) {
    http_response_code(409);
    echo json_encode(['error' => 'Այս անունն արդեն օգտագործվում է։ Ընտրիր այլ անուն։'], JSON_UNESCAPED_UNICODE);
    exit;
}

$sql = "INSERT INTO users (email, full_name, password, status)
        VALUES ('$email', '$full_name', '$hashedPassword', 'user')";

$res = mysqli_query($db, $sql);

if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
    if (mysqli_errno($db) === 1062) {
        http_response_code(409);
        echo json_encode(['error' => 'Այս անունը կամ email-ն արդեն օգտագործվում է։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    http_response_code(500);
    echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
    exit;
}

http_response_code(201);
echo json_encode(['message' => 'Գրանցումն ավարտված է։ Կարող ես մուտք գործել։'], JSON_UNESCAPED_UNICODE);
exit;
