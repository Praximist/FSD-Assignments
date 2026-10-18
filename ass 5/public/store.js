const grid = document.querySelector("#product-grid");
const categoriesRoot = document.querySelector("#category-list");
const searchInput = document.querySelector("#product-search");
const countLabel = document.querySelector("#product-count");
const toast = document.querySelector("#toast");

let products = [];
let activeCategory = "All pieces";
let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(price);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3400);
}

function renderCategories() {
  const names = ["All pieces", ...new Set(products.map((product) => product.category))];
  categoriesRoot.innerHTML = names.map((name) => `
    <button class="category-button${name === activeCategory ? " is-active" : ""}" type="button" aria-pressed="${name === activeCategory}" data-category="${escapeHtml(name)}">${escapeHtml(name)}</button>
  `).join("");
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = products.filter((product) => {
    const categoryMatches = activeCategory === "All pieces" || product.category === activeCategory;
    const searchMatches = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
    return categoryMatches && searchMatches;
  });

  countLabel.textContent = `${String(visible.length).padStart(2, "0")} ${visible.length === 1 ? "OBJECT" : "OBJECTS"}`;
  if (visible.length === 0) {
    grid.innerHTML = `<div class="empty-state"><span aria-hidden="true">✳</span><h3>Nothing on this shelf.</h3><p>Try another category or a different search.</p></div>`;
    return;
  }

  grid.innerHTML = visible.map((product, index) => `
    <article class="product-card" style="--card-index:${index}">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
        ${product.featured ? '<span class="product-badge">FIELDNOTE PICK</span>' : ""}
        <span class="product-number">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="product-info">
        <div><p class="product-category">${escapeHtml(product.category)}</p><h3>${escapeHtml(product.name)}</h3></div>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
      <p class="product-description">${escapeHtml(product.description)}</p>
    </article>
  `).join("");

  grid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => image.classList.add("image-unavailable"), { once: true });
  });
}

async function loadProducts() {
  grid.setAttribute("aria-busy", "true");
  try {
    const response = await fetch("/api/products");
    if (!response.ok) throw new Error("The collection could not be loaded.");
    products = await response.json();
    renderCategories();
    renderProducts();
  } catch (error) {
    grid.innerHTML = `<div class="empty-state error-state"><span aria-hidden="true">!</span><h3>The collection is out of reach.</h3><p>${escapeHtml(error.message)} Check that the server and MongoDB are running.</p><button type="button" class="retry-button" id="retry-load">Try again</button></div>`;
    document.querySelector("#retry-load").addEventListener("click", loadProducts);
    countLabel.textContent = "CONNECTION NEEDED";
  } finally {
    grid.setAttribute("aria-busy", "false");
  }
}

categoriesRoot.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
loadProducts();