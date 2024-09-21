function fetchCategory(category) {
    let url = '';
    if (category === 'books') {
        url = 'products.json';
    } else {
        url = 'products.xml';
    }

    fetch(url)
        .then(response => response.ok ? response.text() : Promise.reject(response))
        .then(data => {
            let table = document.getElementById('productTable');
            table.innerHTML = ''; // Clear existing table data
            if (category === 'books') {
                // Parse JSON
                let products = JSON.parse(data);
                table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th></tr>`;
                products.forEach(product => {
                    table.innerHTML += `<tr><td>${product.id}</td><td>${product.name}</td><td>${product.category}</td><td>${product.price}</td></tr>`;
                });
            } else {
                // Parse XML
                let parser = new DOMParser();
                let xml = parser.parseFromString(data, 'application/xml');
                let products = xml.getElementsByTagName('product');
                table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th></tr>`;
                for (let product of products) {
                    table.innerHTML += `<tr><td>${product.getElementsByTagName('id')[0].textContent}</td>
                                        <td>${product.getElementsByTagName('name')[0].textContent}</td>
                                        <td>${product.getElementsByTagName('category')[0].textContent}</td>
                                        <td>${product.getElementsByTagName('price')[0].textContent}</td></tr>`;
                }
            }
        })
        .catch(error => console.error('Error:', error));
}

function searchProducts(event) {
    event.preventDefault();
    let keyword = document.getElementById('keyword').value;
    let minPrice = document.getElementById('minPrice').value;
    let maxPrice = document.getElementById('maxPrice').value;

    // AJAX call to PHP for search functionality
    fetch('search.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, minPrice, maxPrice })
    })
    .then(response => response.json())
    .then(data => {
        let table = document.getElementById('searchResults');
        table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th></tr>`;
        data.forEach(product => {
            table.innerHTML += `<tr><td>${product.id}</td><td>${product.name}</td><td>${product.category}</td><td>${product.price}</td></tr>`;
        });
    })
    .catch(error => console.error('Error:', error));
}
