<?php

$dbHost = getenv('MYSQLHOST') ?: 'MySQL-8.0';
$dbUser = getenv('MYSQLUSER') ?: 'root';
$dbPassword = getenv('MYSQLPASSWORD') ?: '';
$dbName = getenv('MYSQLDATABASE') ?: 'intership';
$dbPort = getenv('MYSQLPORT') ?: 3306;

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

if (PHP_OS_FAMILY === 'Linux') {
    ini_set('error_log', '/dev/stderr');
}

mysqli_report(MYSQLI_REPORT_ERROR);

error_log('DB_DEBUG_V2: database diagnostics enabled');

$db = mysqli_connect(
    $dbHost,
    $dbUser,
    $dbPassword,
    $dbName,
    $dbPort
);

if (!$db) {
    error_log('Database connection failed: ' . mysqli_connect_error());

    http_response_code(500);

    echo json_encode(
        ['error' => 'Բազայի կապը չհաջողվեց։'],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

mysqli_set_charset($db, 'utf8mb4');