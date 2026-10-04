<?php

function productImageError($message, $status = 422) {
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function readProductImage() {
    if (!isset($_FILES['image'])) return null;
    $file = $_FILES['image'];
    if (!isset($file['error']) || !is_int($file['error'])) {
        productImageError('Սխալ նկար։');
    }
    if ($file['error'] === UPLOAD_ERR_NO_FILE) return null;
    if (in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
        productImageError('Նկարի առավելագույն չափը 2 ՄԲ է։', 413);
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        productImageError('Նկարի վերբեռնումը չհաջողվեց։');
    }
    $path = $file['tmp_name'] ?? '';
    if (!is_string($path) || !is_uploaded_file($path)) productImageError('Սխալ նկար։');
    $size = filesize($path);
    if ($size > 2 * 1024 * 1024) productImageError('Նկարի առավելագույն չափը 2 ՄԲ է։', 413);
    $info = @getimagesize($path);
    if (!$info || $info[0] < 1 || $info[1] < 1 || $info[0] > 8000 || $info[1] > 8000
        || !in_array($info['mime'], ['image/jpeg', 'image/png', 'image/webp'], true)) {
        productImageError('Ընտրիր JPG, PNG կամ WebP նկար՝ մինչև 8000×8000 չափով։');
    }
    $data = file_get_contents($path);
    if ($data === false) productImageError('Նկարի վերբեռնումը չհաջողվեց։', 500);
    return ['data' => $data, 'mime' => $info['mime']];
}
