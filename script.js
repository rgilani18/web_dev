const listEl = document.getElementById("product-list");
const formEl = document.getElementById("product-form");
const statusEl = document.getElementById("status");

const API_URL = "/.netlify/functions/products";

const setStatus = (message) => {
  statusEl.textContent = message;
};

const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

const createProductItem = (product) => {
  const item = document.createElement("li");
  item.className = "product-item";

  const info = document.createElement("div");
  info.className = "product-info";
  info.innerHTML = `
    <p><strong>${product.name}</strong></p>
    <p>${product.category}</p>
    <p>${formatPrice(product.price)}</p>
  `;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}?id=${encodeURIComponent(product.id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete request failed");
      }

      await loadProducts();
    } catch (error) {
      setStatus("Failed to delete product.");
    }
  });

  item.append(info, deleteButton);
  return item;
};

const renderProducts = (products) => {
  listEl.innerHTML = "";

  if (!products.length) {
    setStatus("No products found. Add your first item.");
    return;
  }

  setStatus(`Showing ${products.length} product(s).`);
  products.forEach((product) => listEl.appendChild(createProductItem(product)));
};

const loadProducts = async () => {
  setStatus("Loading products...");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to fetch products");
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    listEl.innerHTML = "";
    setStatus("Could not load products. Check backend setup.");
  }
};

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(formEl);
  const product = {
    name: formData.get("name")?.toString().trim(),
    price: Number(formData.get("price")),
    category: formData.get("category")?.toString().trim(),
  };

  if (!product.name || !product.category || Number.isNaN(product.price)) {
    setStatus("Please complete all fields correctly.");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Unable to add product");
    }

    formEl.reset();
    await loadProducts();
  } catch (error) {
    setStatus("Failed to add product.");
  }
});

loadProducts();
