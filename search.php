<?php
// Load JSON data
$jsonData = file_get_contents('products.json');
$jsonProducts = json_decode($jsonData, true);

// Load XML data
$xmlData = simplexml_load_file('products.xml');
$xmlProducts = [];
foreach ($xmlData->Perfume->item as $product) {
    $xmlProducts[] = [
        'id' => (string) $product->id,
        'name' => (string) $product->Product_name,
        'price' => (float) $product->Price,
        'category' => 'Perfume'
    ];
}

// Combine both JSON and XML products
$allProducts = array_merge(
    $jsonProducts['Electronics_1'], 
    $jsonProducts['Electronics_2'], 
    $jsonProducts['Book'], 
    $jsonProducts['Perfume'],
    $xmlProducts
);

// Function to search products by name, category, and price range
function searchProducts($query, $minPrice, $maxPrice, $products) {
    $results = [];
    foreach ($products as $product) {
        $productPrice = (float) $product['price'];
        if (
            (stripos($product['name'], $query) !== false || stripos($product['category'], $query) !== false) &&
            $productPrice >= $minPrice && $productPrice <= $maxPrice
        ) {
            $results[] = $product;
        }
    }
    return $results;
}

// Get search query, min price, and max price from user input
$searchQuery = isset($_GET['q']) ? $_GET['q'] : '';
$minPrice = isset($_GET['minPrice']) ? (float) $_GET['minPrice'] : 0;
$maxPrice = isset($_GET['maxPrice']) && $_GET['maxPrice'] !== '' ? (float) $_GET['maxPrice'] : PHP_FLOAT_MAX;

// Ensure minPrice is less than or equal to maxPrice
if ($minPrice > $maxPrice) {
    echo "<p style='color:red;'>Min price cannot be greater than max price.</p>";
    $searchResults = [];
} else {
    $searchResults = [];
    if (!empty($searchQuery) || $minPrice > 0 || $maxPrice < PHP_FLOAT_MAX) {
        $searchResults = searchProducts($searchQuery, $minPrice, $maxPrice, $allProducts);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Search</title>
</head>
<body>
    <h1>Search for Products</h1>
    <form method="GET" action="">
        <input type="text" name="q" placeholder="Search for products..." value="<?php echo htmlspecialchars($searchQuery); ?>">
        <input type="number" name="minPrice" placeholder="Min Price" value="<?php echo htmlspecialchars($minPrice); ?>" min="0">
        <input type="number" name="maxPrice" placeholder="Max Price" value="<?php echo htmlspecialchars($maxPrice != PHP_FLOAT_MAX ? $maxPrice : ''); ?>" min="0">
        <button type="submit">Search</button>
    </form>

    <?php if (!empty($searchQuery) || $minPrice > 0 || $maxPrice < PHP_FLOAT_MAX): ?>
        <h2>Search Results for "<?php echo htmlspecialchars($searchQuery); ?>"</h2>
        <?php if (!empty($searchResults)): ?>
            <ul>
                <?php foreach ($searchResults as $product): ?>
                    <li>
                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                        <p>Price: $<?php echo htmlspecialchars($product['price']); ?></p>
                        <p>Category: <?php echo htmlspecialchars($product['category']); ?></p>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php else: ?>
            <p>No products found.</p>
        <?php endif; ?>
    <?php endif; ?>
</body>
</html>
