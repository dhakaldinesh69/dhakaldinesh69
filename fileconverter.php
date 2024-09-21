


<?php
//phpcode to convert the excel file into json


require 'vendor/autoload.php'; // You will need PHPExcel or PHPSpreadsheet

use PhpOffice\PhpSpreadsheet\IOFactory;

$spreadsheet = IOFactory::load('Website_data.xlsx');
$worksheet = $spreadsheet->getActiveSheet();

$products = [];
foreach ($worksheet->getRowIterator() as $row) {
    $cellIterator = $row->getCellIterator();
    $cellIterator->setIterateOnlyExistingCells(false);
    $productData = [];
    foreach ($cellIterator as $cell) {
        $productData[] = $cell->getValue();
    }
    $products[] = [
        'id' => $productData[0],
        'name' => $productData[1],
        'category' => $productData[2],
        'price' => $productData[3]
    ];
}

file_put_contents('products.json', json_encode($products));
?>







<?php


//PHP Code to Convert Excel to XML:



$xml = new SimpleXMLElement('<products/>');
foreach ($products as $product) {
    $productXml = $xml->addChild('product');
    $productXml->addChild('id', $product['id']);
    $productXml->addChild('name', $product['name']);
    $productXml->addChild('category', $product['category']);
    $productXml->addChild('price', $product['price']);
}

$xml->asXML('products.xml');
?>
