<?php

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;

$autoload = __DIR__ . '/../vendor/autoload.php';

if (!is_file($autoload)) {
    http_response_code(503);
    echo json_encode(['error' => 'Laravel-ի բաղադրիչները տեղադրված չեն։'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once $autoload;

try {
    $container = new Container();
    $container->instance(mysqli::class, $db);

    $request = Request::create($url, 'GET', $_GET);
    $container->instance(Request::class, $request);

    $router = new Router(new Dispatcher($container), $container);
    require __DIR__ . '/../routes/api.php';

    $response = $router->dispatch($request);
} catch (Throwable $error) {
    error_log('Product API: ' . $error->getMessage());
    $response = new JsonResponse(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], 500);
}

$response->headers->set('Cache-Control', 'no-store');
$response->send();
exit;
