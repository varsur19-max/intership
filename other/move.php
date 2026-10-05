<?php
$allowUser = $url === '/api/product/move';
require_once 'other/auth.php';

function moveReply($status, $message) {
    http_response_code($status);
    echo json_encode([($status === 200 ? 'message' : 'error') => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function moveQuery($sql) {
    global $db;
    $result = mysqli_query($db, $sql);
    if (!$result) {
        throw new RuntimeException(mysqli_error($db));
    }
    return $result;
}

$id = filter_var($_POST['id'] ?? '', FILTER_VALIDATE_INT);
$target = filter_var($_POST['target_id'] ?? '', FILTER_VALIDATE_INT);
$position = $_POST['position'] ?? 'inside';
if ($id === false || $id < 1 || $target === false || $target < 0 ||
    !in_array($position, ['before', 'inside', 'after'], true)) {
    moveReply(422, 'Սխալ տվյալներ։');
}

try {
    moveQuery('START TRANSACTION');
    $lock = moveQuery('SELECT id FROM menu_lock WHERE id = 1 FOR UPDATE');
    if (!mysqli_fetch_assoc($lock)) {
        throw new RuntimeException('menu_lock row 1 is missing');
    }
    $result = moveQuery('SELECT id, parent_id, sort_order FROM menu_items ORDER BY sort_order, id FOR UPDATE');
    $items = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $items[intval($row['id'])] = $row;
    }

    if ($allowUser) {
        if ($target < 1 || !isset($items[$target]) || $position !== 'inside') {
            moveQuery('ROLLBACK');
            moveReply(422, 'Սխալ կատեգորիա։');
        }
        $result = moveQuery("SELECT user_id, category_id FROM products WHERE id = $id AND is_del = 0 FOR UPDATE");
        $product = mysqli_fetch_assoc($result);
        if (!$product) {
            moveQuery('ROLLBACK');
            moveReply(404, 'Ապրանքը չի գտնվել։');
        }
        if ($user['status'] !== 'admin' && intval($product['user_id']) !== $user_id) {
            moveQuery('ROLLBACK');
            moveReply(403, 'Կարող ես տեղափոխել միայն քո ապրանքները։');
        }
        if (intval($product['category_id']) !== $target) {
            moveQuery("UPDATE products SET category_id = $target, updated_at = CURRENT_TIMESTAMP WHERE id = $id");
        }
    } else {
        if (!isset($items[$id]) || ($target > 0 && !isset($items[$target]))) {
            moveQuery('ROLLBACK');
            moveReply(404, 'Մենյուի տարրը չի գտնվել։');
        }
        if ($id === $target || ($target === 0 && $position !== 'inside')) {
            moveQuery('ROLLBACK');
            moveReply(422, 'Սխալ տեղափոխում։');
        }
        $parent = $position === 'inside' ? $target : intval($items[$target]['parent_id']);
        $current = $parent;
        $visited = [];
        while ($current > 0) {
            if ($current === $id || isset($visited[$current]) || !isset($items[$current])) {
                moveQuery('ROLLBACK');
                moveReply(422, 'Ինքն իրեն կամ սեփական ենթամենյուն ծնող ընտրել չի կարելի։');
            }
            $visited[$current] = true;
            $current = intval($items[$current]['parent_id']);
        }
        $siblings = [];
        foreach ($items as $itemId => $item) {
            if ($itemId !== $id && intval($item['parent_id']) === $parent) {
                $siblings[] = $itemId;
            }
        }
        $index = count($siblings);
        if ($position !== 'inside') {
            $index = array_search($target, $siblings, true);
            if ($index === false) {
                throw new RuntimeException('Move target is not a sibling');
            }
            if ($position === 'after') $index++;
        }
        array_splice($siblings, $index, 0, [$id]);
        $parentSql = $parent === 0 ? 'NULL' : $parent;
        moveQuery("UPDATE menu_items SET parent_id = $parentSql WHERE id = $id");
        foreach ($siblings as $order => $siblingId) {
            moveQuery("UPDATE menu_items SET sort_order = $order WHERE id = $siblingId");
        }
    }
    moveQuery('COMMIT');
    moveReply(200, 'Տեղափոխումը պահպանված է։');
} catch (Throwable $error) {
    mysqli_query($db, 'ROLLBACK');
    error_log('Drag and drop: ' . $error->getMessage());
    moveReply(500, 'Տվյալների մշակման սխալ։ Կրկին փորձիր։');
}
