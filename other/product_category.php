<?php
$value = trim($_POST['category_id'] ?? '');
$category_id = null;
if ($value !== '') {
    $category_id = filter_var($value, FILTER_VALIDATE_INT);
    if ($category_id === false || $category_id < 1 || strlen($value) > 10) {
        http_response_code(422);
        echo json_encode(['error' => 'Սխալ կատեգորիա։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $result = mysqli_query($db, "SELECT id FROM menu_items WHERE id = $category_id");
    if (!$result) {
        throw new RuntimeException(mysqli_error($db));
    }
    if (!mysqli_fetch_assoc($result)) {
        http_response_code(422);
        echo json_encode(['error' => 'Կատեգորիան չի գտնվել։ Ընտրիր գործող կատեգորիա։'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
