const productList = document.querySelector("#product-list");
const formPanel = document.querySelector("#form-panel");
const form = document.querySelector("#product-form");
const formError = document.querySelector("#form-error");
const descriptionInput = form.elements.description;
const descriptionCount = document.querySelector("#description-count");
const toast = document.querySelector("#toast");
const deleteDialog = document.querySelector("#delete-dialog");

let products = [];
let editingId = null;
let deletingId = null;
let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}

function notify(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "The request could not be completed.");
  }
  return response.status === 204 ? null : response.json();
}

function updateOverview() {
  document.querySelector("#total-count").textContent = String(products.length).padStart(2, "0");
  document.querySelector("#featured-count").textContent = String(products.filter((product) => product.featured).length).padStart(2, "0");
  const average = products.length ? products.reduce((sum, product) => sum + product.price, 0) / products.length : 0;
  document.querySelector("#average-price").textContent = money(average);
}

function renderProducts() {
  updateOverview();
  if (products.length === 0) {
    productList.innerHTML = `<div class="list-empty"><span aria-hidden="true">✳</span><h3>Your shelf is waiting.</h3><p>Add a product to start building the collection.</p></div>`;
    return;
  }

  productList.innerHTML = products.map((product) => `
    <article class="product-row">
      <div class="row-product"><img src="${escapeHtml(product.image)}" alt="" loading="lazy"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description)}</p></div></div>
      <span class="row-category">${escapeHtml(product.category)}</span>
      <span class="row-price">${money(product.price)}</span>
      <span class="row-status${product.featured ? " is-featured" : ""}">${product.featured ? "Featured" : "Standard"}</span>
      <div class="row-actions"><button class="icon-button edit-button" type="button" data-edit="${product._id}" aria-label="Edit ${escapeHtml(product.name)}" title="Edit product">✎</button><button class="icon-button delete-button" type="button" data-delete="${product._id}" aria-label="Remove ${escapeHtml(product.name)}" title="Remove product">×</button></div>
    </article>
  `).join("");

  productList.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => { image.src = "/image-placeholder.svg"; }, { once: true });
  });
}

async function loadProducts() {
  productList.setAttribute("aria-busy", "true");
  try {
    products = await request("/api/products");
    renderProducts();
  } catch (error) {
    productList.innerHTML = `<div class="list-empty error-empty"><h3>Could not load products.</h3><p>${escapeHtml(error.message)} Check the server and MongoDB connection.</p><button class="secondary-button" id="retry-load" type="button">Try again</button></div>`;
    document.querySelector("#retry-load").addEventListener("click", loadProducts);
  } finally {
    productList.setAttribute("aria-busy", "false");
  }
}

function showForm(product = null) {
  editingId = product?._id || null;
  form.reset();
  formError.textContent = "";
  document.querySelector("#form-eyebrow").textContent = editingId ? "REFINE THE DETAILS" : "ADD TO THE SHELF";
  document.querySelector("#form-title").textContent = editingId ? "Edit product" : "New product";
  document.querySelector("#save-button").textContent = editingId ? "Save changes" : "Add product";
  document.querySelector("#cancel-edit").hidden = !editingId;
  if (product) {
    form.elements.name.value = product.name;
    form.elements.category.value = product.category;
    form.elements.price.value = product.price;
    form.elements.image.value = product.image;
    form.elements.description.value = product.description;
    form.elements.featured.checked = product.featured;
  }
  updateDescriptionCount();
  formPanel.classList.add("is-open");
  form.elements.name.focus();
  if (window.matchMedia("(max-width: 920px)").matches) formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideForm() {
  formPanel.classList.remove("is-open");
  editingId = null;
  form.reset();
  formError.textContent = "";
  updateDescriptionCount();
}

function updateDescriptionCount() {
  descriptionCount.textContent = `${descriptionInput.value.length} / 500`;
}

function productPayload() {
  return {
    name: form.elements.name.value.trim(),
    category: form.elements.category.value.trim(),
    price: Number(form.elements.price.value),
    image: form.elements.image.value.trim(),
    description: descriptionInput.value.trim(),
    featured: form.elements.featured.checked,
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  const saveButton = document.querySelector("#save-button");
  saveButton.disabled = true;
  saveButton.textContent = editingId ? "Saving…" : "Adding…";
  try {
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";
    await request(url, { method, body: JSON.stringify(productPayload()) });
    await loadProducts();
    notify(editingId ? "Product details updated." : "Product added to the collection.");
    hideForm();
  } catch (error) {
    formError.textContent = error.message;
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = editingId ? "Save changes" : "Add product";
  }
});

productList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) {
    const product = products.find((item) => item._id === editButton.dataset.edit);
    if (product) showForm(product);
  }
  if (deleteButton) {
    deletingId = deleteButton.dataset.delete;
    deleteDialog.showModal();
  }
});

document.querySelector("#new-product").addEventListener("click", () => showForm());
document.querySelector("#close-form").addEventListener("click", hideForm);
document.querySelector("#cancel-edit").addEventListener("click", hideForm);
descriptionInput.addEventListener("input", updateDescriptionCount);
document.querySelector("#keep-product").addEventListener("click", () => deleteDialog.close());
deleteDialog.addEventListener("click", (event) => {
  if (event.target === deleteDialog) deleteDialog.close();
});
document.querySelector("#confirm-delete").addEventListener("click", async () => {
  if (!deletingId) return;
  const button = document.querySelector("#confirm-delete");
  button.disabled = true;
  try {
    await request(`/api/products/${deletingId}`, { method: "DELETE" });
    products = products.filter((product) => product._id !== deletingId);
    renderProducts();
    deleteDialog.close();
    notify("Product removed from the collection.");
  } catch (error) {
    notify(error.message);
  } finally {
    deletingId = null;
    button.disabled = false;
  }
});

loadProducts();