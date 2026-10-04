<?php
$id = filter_var($_GET['id'] ?? '', FILTER_VALIDATE_INT);
if ($id === false || $id < 1) {
    http_response_code(422);
    echo json_encode(['error' => 'Սխալ ID։'], JSON_UNESCAPED_UNICODE);
    exit;
}
$result = mysqli_query($db, "SELECT image_data, image_mime FROM products WHERE id = $id AND is_del = 0");
if (!$result) throw new RuntimeException(mysqli_error($db));
$product = mysqli_fetch_assoc($result);
if (!$product || $product['image_data'] === null ||
    !in_array($product['image_mime'], ['image/jpeg', 'image/png', 'image/webp'], true)) {
    http_response_code(404);
    echo json_encode(['error' => 'Նկարը չի գտնվել։'], JSON_UNESCAPED_UNICODE);
    exit;
}
header('Content-Type: ' . $product['image_mime']);
header('X-Content-Type-Options: nosniff');
echo $product['image_data'];
exit;
