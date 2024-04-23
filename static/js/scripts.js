function getRecipes() {
  document.querySelector(".recipes").innerHTML = ``;
  fetch(`api/recipes`)
    .then((response) => response.json())
    .then((recipes) => renderRecipes(recipes));
}

function renderRecipes(recipes) {
  recipes.forEach((recipe) => {
    let formattedDate = new Date(recipe.created).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    let recipeEl = document.createElement("div");

    let ingredientsList = "<ul>";
    recipe.ingredients.forEach((ingredient) => {
      ingredientsList += `<li>${ingredient}</li>`;
    });
    ingredientsList += "</ul>";

    let preparationList = "<ol>";
    recipe.preparation.forEach((step) => {
      preparationList += `<li>${step.step}</li>`;
    });
    preparationList += "</ol>";

    recipeEl.innerHTML = `
      <img src="img/${recipe.image}" alt="Image of ${recipe.title}" />
      <h3><a href="detail.html?recipe=${recipe._id}">${recipe.title}</a></h3>
      <p>${recipe.description}</p>
      <p>Created on ${formattedDate}</p>
      <h4>Ingredients:</h4>
      ${ingredientsList}
      <h4>Preparation:</h4>
      ${preparationList}
      <a class="delete" data-id=${recipe._id} href="#">Delete</a>
    `;

    document.querySelector(".recipes").append(recipeEl);
  });
}

function addRecipe(event) {
  event.preventDefault();

  const { title, image, description } = event.target;

  const recipe = {
    title: title.value,
    image: image.value,
    description: description.value,
  };

  fetch("api/recipes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipe),
  })
    .then((response) => response.json())
    .then(getRecipes);
}

function deleteRecipe(event) {
  console.log("2: ", event.target);
  event.preventDefault();
  fetch(`api/recipes/${event.target.dataset.id}`, {
    method: "DELETE",
  }).then(location.reload());
}

function handleClicks(event) {
  if (event.target.matches("[data-id]")) {
    deleteRecipe(event);
  }
}

function uploadImage(event) {
  event.preventDefault();
  const data = new FormData();
  data.append("file", imageForm.file.files[0]);
  data.append("filename", imageForm.filename.value);
  fetch("/api/upload", {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Image uploaded successfully: " + data.file);
    })
    .catch((error) => {
      alert("Failed to upload image");
      console.error("Error:", error);
    });
}

const imageForm = document.querySelector("#imageForm");
imageForm.addEventListener("submit", uploadImage);

document.addEventListener("click", handleClicks);

const addForm = document.querySelector("#addForm");
addForm.addEventListener("submit", addRecipe);

getRecipes();
