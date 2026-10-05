const API_URL = '/.netlify/functions/products';

const productForm = document.getElementById('product-form');
const formMessage = document.getElementById('form-message');
const productList = document.getElementById('product-list');
const loadingMessage = document.getElementById('loading-message');
const refreshBtn = document.getElementById('refresh-btn');

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? '#dc2626' : '#6b7280';
}

function renderProducts(products) {
  productList.innerHTML = '';

  if (!products.length) {
    loadingMessage.textContent = 'No products yet. Add your first product.';
    return;
  }

  loadingMessage.textContent = '';

  products.forEach((product) => {
    const item = document.createElement('li');
    item.className = 'product-item';

    const info = document.createElement('div');
    info.className = 'product-info';
    info.innerHTML = `
      <h3 class="product-name">${escapeHtml(product.name)}</h3>
      <p class="product-meta">$${Number(product.price).toFixed(2)} • ${escapeHtml(product.category)}</p>
    `;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    deleteButton.addEventListener('click', () => deleteProduct(product.id));

    item.append(info, deleteButton);
    productList.appendChild(item);
  });
}

async function loadProducts() {
  loadingMessage.textContent = 'Loading products...';
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to load products.');
    }
    const data = await response.json();
    renderProducts(data.products || []);
  } catch (error) {
    loadingMessage.textContent = error.message;
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Delete failed.');
    }

    await loadProducts();
  } catch (error) {
    alert(error.message);
  }
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  showFormMessage('Adding product...');

  const formData = new FormData(productForm);
  const payload = {
    name: formData.get('name')?.toString().trim(),
    price: Number(formData.get('price')),
    category: formData.get('category')?.toString().trim(),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Could not add product.');
    }

    productForm.reset();
    showFormMessage('Product added successfully.');
    await loadProducts();
  } catch (error) {
    showFormMessage(error.message, true);
  }
});

refreshBtn.addEventListener('click', loadProducts);

loadProducts();
