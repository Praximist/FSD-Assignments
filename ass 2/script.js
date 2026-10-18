const feedback = document.getElementById("dom-feedback");
let imageChanged = false;
let chipMoved = false;
let nodeNumber = 0;

document.getElementById("heading-button").addEventListener("click", () => {
  document.getElementById("sample-heading").innerHTML = "The heading has changed.";
  feedback.textContent = "Heading changed.";
});

document.getElementById("tag-button").addEventListener("click", () => {
  const paragraphs = document.getElementById("sample-copy").getElementsByTagName("p");
  for (const paragraph of paragraphs) {
    paragraph.style.color = "#b64e35";
  }
  feedback.textContent = "Paragraph colors changed.";
});

document.getElementById("class-button").addEventListener("click", () => {
  const statuses = document.getElementsByClassName("class-status");
  for (const status of statuses) {
    status.innerHTML = "Class element updated.";
  }
  feedback.textContent = "Status changed.";
});

document.getElementById("position-button").addEventListener("click", () => {
  const chip = document.getElementById("moving-chip");
  chipMoved = !chipMoved;
  chip.style.color = chipMoved ? "#b64e35" : "#176c60";
  chip.style.left = chipMoved ? "68%" : "8%";
  chip.style.top = chipMoved ? "58%" : "18%";
  feedback.textContent = "Chip color and position changed.";
});

document.getElementById("image-button").addEventListener("click", () => {
  const image = document.getElementById("sample-image");
  imageChanged = !imageChanged;
  image.src = imageChanged
    ? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85"
    : "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85";
  image.alt = imageChanged ? "Sunlit mountain valley" : "Mountain landscape reflected in a lake";
  feedback.textContent = "Image source changed.";
});

document.getElementById("add-node-button").addEventListener("click", () => {
  nodeNumber += 1;
  const item = document.createElement("li");
  item.appendChild(document.createTextNode(`Added text node ${nodeNumber}`));
  document.getElementById("node-list").appendChild(item);
  feedback.textContent = "Text node added.";
});

document.getElementById("delete-node-button").addEventListener("click", () => {
  const list = document.getElementById("node-list");
  if (list.lastElementChild !== list.firstElementChild) {
    list.removeChild(list.lastElementChild);
    feedback.textContent = "Latest node deleted.";
  } else {
    feedback.textContent = "No added node to delete.";
  }
});

$("#jquery-text-button").on("click", function () {
  $(this).text("Button text changed");
});

$("#jquery-background-button").on("click", () => {
  $("#jquery-backdrop")
    .css("background-image", 'url("https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85")')
    .addClass("has-image");
});

$("#jquery-attribute-button").on("click", () => {
  $("#sample-image").attr("title", "Mountain landscape");
  $("#jquery-attribute-button").text("Title attribute added");
});

$("#contact-form").on("submit", (event) => {
  event.preventDefault();
  const values = $(event.currentTarget).serializeArray();
  const summary = values.map(({ name, value }) => `${name}: ${value}`).join(" | ");
  $("#form-output").text(summary);
});