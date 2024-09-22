// Fetch category data based on the button clicked (books/electronics/perfume)
function fetchCategory(category) {
    // Determine the data source based on the category
    let url = (category === 'books') ? 'products.json' : 'products.xml';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            let table = document.getElementById('productTable');
            table.innerHTML = ''; // Clear existing table data

            if (category === 'books') {
                // Parse JSON for Books category only
                const jsonData = JSON.parse(data);
                const products = jsonData['Book']; // Access only the 'Book' section in JSON
                populateTableWithBooks(table, products);
            } else if (category === 'perfume') {
                // Parse XML for Perfume category only
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, 'application/xml');
                const perfumes = xml.getElementsByTagName('Perfume')[0].getElementsByTagName('item');
                populateTableWithPerfume(table, perfumes);
            } else if (category === 'electronics') {
                // Parse XML for Electronics category only
                const parser = new DOMParser();
                const xml = parser.parseFromString(data, 'application/xml');
                const electronics = xml.getElementsByTagName('Electronics_1')[0].getElementsByTagName('item');
                populateTableWithElectronics(table, electronics);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Populate table with JSON products (Books category)
function populateTableWithBooks(table, products) {
    table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>`;
    products.forEach(product => {
        table.innerHTML += `<tr>
                              <td>${product.id}</td>
                              <td>${product["Book name"]}</td>
                              <td>${product.category}</td>
                              <td>${product.price}</td>
                              <td>
                                  <button onclick="addToCart('${product.id}', '${product['Book name']}')">Add to Cart</button>
                                  <button onclick="buyNow('${product.id}', '${product['Book name']}')">Buy Now</button>
                              </td>
                            </tr>`;
    });
}

// Populate table with XML products (Perfume category)
function populateTableWithPerfume(table, products) {
    table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>`;
    for (let product of products) {
        const id = product.getElementsByTagName('id')[0].textContent;
        const name = product.getElementsByTagName('Product_name')[0].textContent;
        const price = product.getElementsByTagName('Price')[0].textContent;

        table.innerHTML += `<tr>
                              <td>${id}</td>
                              <td>${name}</td>
                              <td>Perfume</td>
                              <td>${price}</td>
                              <td>
                                  <button onclick="addToCart('${id}', '${name}')">Add to Cart</button>
                                  <button onclick="buyNow('${id}', '${name}')">Buy Now</button>
                              </td>
                            </tr>`;
    }
}

// Populate table with XML products (Electronics category)
function populateTableWithElectronics(table, products) {
    table.innerHTML = `<tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>`;
    for (let product of products) {
        const id = product.getElementsByTagName('Id')[0].textContent;
        const name = product.getElementsByTagName('Product_name')[0].textContent;
        const price = product.getElementsByTagName('Price')[0].textContent;

        table.innerHTML += `<tr>
                              <td>${id}</td>
                              <td>${name}</td>
                              <td>Electronics</td>
                              <td>${price}</td>
                              <td>
                                  <button onclick="addToCart('${id}', '${name}')">Add to Cart</button>
                                  <button onclick="buyNow('${id}', '${name}')">Buy Now</button>
                              </td>
                            </tr>`;
    }
}

// Add to Cart functionality
function addToCart(productId, productName) {
    alert(`Added ${productName} (ID: ${productId}) to your cart.`);
}

// Buy Now functionality
function buyNow(productId, productName) {
    alert(`Proceeding to buy ${productName} (ID: ${productId})`);
}
