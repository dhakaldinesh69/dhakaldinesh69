<?php
$data = json_decode(file_get_contents('php://input'), true);
$keyword = $data['keyword'];
$minPrice = $data['minPrice'];
$maxPrice = $data['maxPrice'];

$products = json_decode(file_get_contents('products.json'), true);
$filteredProducts = [];

foreach ($products as $product) {
    if (($keyword && (strpos($product['id'], $keyword) !== false || strpos($product['name'], $keyword) !== false)) || 
        ($minPrice && $maxPrice && $product['price'] >= $minPrice && $product['price'] <= $maxPrice)) {
        $filteredProducts[] = $product;
    }
}

echo json_encode($filteredProducts);
?>
