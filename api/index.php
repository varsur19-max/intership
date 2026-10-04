<?php

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET' && $method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Չթույլատրված մեթոդ։'], JSON_UNESCAPED_UNICODE);
    exit;
}

foreach ($_POST as $value) {
    if (!is_string($value)) {
        http_response_code(422);
        echo json_encode(['error' => 'Սխալ տվյալներ։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

foreach ($_GET as $value) {
    if (!is_string($value)) {
        http_response_code(422);
        echo json_encode(['error' => 'Սխալ տվյալներ։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if ($method === 'POST') {
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        http_response_code(403);
        echo json_encode(['error' => 'Անվտանգության token-ը հնացել է։ Թարմացրու էջը։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

if ($url === '/api/image' && $method === 'GET') {
    require 'crud/image.php';
}

if ($url === '/api/session' && $method === 'GET') {
    $user = null;

    if (isset($_SESSION['user_id'])) {
        $id = intval($_SESSION['user_id']);
        $sql = "SELECT id, full_name, status FROM users WHERE id = $id";

        $res = mysqli_query($db, $sql);

        if (!$res) { error_log('SQL ERROR: ' . mysqli_error($db) . ' | FILE: ' . __FILE__);
            http_response_code(500);
            echo json_encode(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $user = mysqli_fetch_assoc($res);
    }

    http_response_code(200);
    echo json_encode(['user' => $user, 'csrf_token' => $_SESSION['csrf_token']], JSON_UNESCAPED_UNICODE);
    exit;
}

// Միայն ապրանքների ընթերցումը փոխանցում ենք Laravel-ի Router-ին։
if (($url === '/api/products' || $url === '/api/product') && $method === 'GET') {
    require __DIR__ . '/../bootstrap/laravel.php';
} elseif ($url === '/api/menu' && $method === 'GET') {
    require_once 'menu/all.php';
} elseif ($method === 'POST') {
    if ($url === '/api/menu/move' || $url === '/api/product/move') {
        require_once 'other/move.php';
    } elseif ($url === '/api/register') {
        require_once 'log_reg/reg.php';
    } elseif ($url === '/api/login') {
        require_once 'log_reg/login.php';
    } elseif ($url === '/api/logout') {
        require_once 'log_reg/logout.php';
    } elseif ($url === '/api/add') {
        require_once 'crud/add.php';
    } elseif ($url === '/api/edit') {
        require_once 'crud/edit.php';
    } elseif ($url === '/api/delete') {
        require_once 'crud/delete.php';
    } elseif ($url === '/api/menu/add') {
        require_once 'menu/add.php';
    } elseif ($url === '/api/menu/edit') {
        require_once 'menu/edit.php';
    } elseif ($url === '/api/menu/delete') {
        require_once 'menu/delete.php';
    }
}

http_response_code(404);
echo json_encode(['error' => 'API հասցեն չի գտնվել։'], JSON_UNESCAPED_UNICODE);
exit;
