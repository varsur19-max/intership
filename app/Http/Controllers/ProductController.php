<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use mysqli;

class ProductController
{
    private $db;

    public function __construct(mysqli $db)
    {
        $this->db = $db;
    }

    public function index(Request $request)
    {
        $categorySql = '';
        $categoryId = $request->query('category_id');

        if ($categoryId !== null) {
            if (!is_string($categoryId) || strlen($categoryId) > 10 ||
                filter_var($categoryId, FILTER_VALIDATE_INT) === false || intval($categoryId) < 1) {
                return new JsonResponse(['error' => 'Սխալ կատեգորիա։'], 422);
            }

            $categoryId = intval($categoryId);
            $categorySql = " AND products.category_id = $categoryId";
        }

        $sql = "SELECT products.id, products.name, products.description, products.price, products.stock, products.user_id, products.is_del, products.created_at, products.updated_at, products.category_id, (products.image_data IS NOT NULL) AS has_image, menu_items.title AS category_name FROM products
                LEFT JOIN menu_items ON menu_items.id = products.category_id
                WHERE products.is_del = 0 $categorySql ORDER BY products.id DESC";
        $result = mysqli_query($this->db, $sql);

        if (!$result) {
            error_log('Product list: ' . mysqli_error($this->db));
            return new JsonResponse(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], 500);
        }

        $products = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $products[] = $row;
        }

        return new JsonResponse(['products' => $products]);
    }

    public function show(Request $request)
    {
        $id = $request->query('id', '');

        if (!is_string($id) || strlen($id) > 10 ||
            filter_var($id, FILTER_VALIDATE_INT) === false || intval($id) < 1) {
            return new JsonResponse(['error' => 'Սխալ ID։'], 422);
        }

        $id = intval($id);
        $sql = "SELECT products.id, products.name, products.description, products.price, products.stock, products.user_id, products.is_del, products.created_at, products.updated_at, products.category_id, (products.image_data IS NOT NULL) AS has_image, menu_items.title AS category_name, users.full_name AS author_name
                FROM products
                LEFT JOIN menu_items ON menu_items.id = products.category_id
                LEFT JOIN users ON users.id = products.user_id
                WHERE products.id = $id AND products.is_del = 0";
        $result = mysqli_query($this->db, $sql);

        if (!$result) {
            error_log('Product details: ' . mysqli_error($this->db));
            return new JsonResponse(['error' => 'Տվյալների մշակման սխալ։ Կրկին փորձիր։'], 500);
        }

        $product = mysqli_fetch_assoc($result);
        if (!$product) {
            return new JsonResponse(['error' => 'Ապրանքը չի գտնվել։'], 404);
        }

        return new JsonResponse(['product' => $product]);
    }
}
