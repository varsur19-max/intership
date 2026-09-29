<?php

$basePath = '/intership';
// HTTPS/Railway-ում՝ պաշտպանված cookie, տեղական HTTP-ում՝ սովորական։
$secureCookies = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (bool) getenv('RAILWAY_ENVIRONMENT_ID');
if (getenv('SESSION_SECURE_COOKIE') !== false) {
    $secureCookies = getenv('SESSION_SECURE_COOKIE') === 'true';
}

$url = $_SERVER['REQUEST_URI'];
$url = explode('?', $url)[0];

if ($basePath !== '' && ($url === $basePath || strpos($url, $basePath . '/') === 0)) {
    $url = substr($url, strlen($basePath));
}

$files = ['/style.css', '/script.js'];

if (in_array($url, $files)) {
    if ($url === '/style.css') {
        header('Content-Type: text/css; charset=utf-8');
    } else {
        header('Content-Type: text/javascript; charset=utf-8');
    }
    header('X-Content-Type-Options: nosniff');
    readfile(substr($url, 1));
    exit;
}

if ($url === '/api' || strpos($url, '/api/') === 0) {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    ini_set('display_errors', '0');

    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => $secureCookies,
        'path' => $basePath . '/'
    ]);
    session_start();

    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    require_once 'db.php';
    require_once 'api/index.php';
    exit;
}

if ($url === '' || $url === '/' || $url === '/add' || $url === '/edit' ||
    $url === '/show' || $url === '/login' || $url === '/register' ||
    $url === '/admin') {
    require_once 'components/head.php';
} else {
    http_response_code(404);
    echo '404 - Page not found';
}
