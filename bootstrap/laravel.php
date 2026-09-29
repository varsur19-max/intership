<?php

use Illuminate\Container\Container;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;

// Այս ֆայլը կանչվում է միայն ապրանքների երկու GET հարցումների համար։
$autoload = __DIR__ . '/../vendor/autoload.php';

if (!is_file($autoload)) {
    http_response_code(503);
    echo json_encode(['error' => 'Laravel-ի բաղադրիչները տեղադրված չեն։ Նախագծի պանակում գործարկիր composer install։'], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once $autoload;

try {
    // Container-ը Router-ին տալիս է Controller-ի համար անհրաժեշտ օբյեկտները։
    $container = new Container();
    $container->instance(mysqli::class, $db);

    // $url-ն արդեն առանց /intership սկզբի է։ $_GET-ը հարցման տվյալներն են։
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
