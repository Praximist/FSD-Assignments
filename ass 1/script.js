const quantityInput = document.querySelector("#quantity");
const finishSelect = document.querySelector("#finish");
const finishName = document.querySelector("#finish-name");
const finishSwatch = document.querySelector("#finish-swatch");
const feedback = document.querySelector("#form-feedback");
const finishColors = {
  "Midnight Black": "#252625",
  "Cloud White": "#f2f0e8",
  "Olive Green": "#75805c",
};
document.querySelectorAll(".quantity-button").forEach((button) => {
  button.addEventListener("click", () => {
    const current = Number(quantityInput.value) || 1;
    const next = current + Number(button.dataset.step);
    quantityInput.value = Math.min(10, Math.max(1, next));
  });
});

finishSelect.addEventListener("change", () => {
  finishName.textContent = finishSelect.value;
  finishSwatch.style.backgroundColor = finishColors[finishSelect.value];
});

document.querySelector("#buy").addEventListener("submit", (event) => {
  event.preventDefault();
  const quantity = Math.min(10, Math.max(1, Number(quantityInput.value) || 1));
  quantityInput.value = quantity;
  feedback.textContent = `${quantity} ${quantity === 1 ? "pair" : "pairs"} in ${finishSelect.value} added to cart.`;
});