function showDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  console.log("urlParams", urlParams);
  const recipeId = urlParams.get("recipe");
  console.log("recipeId", recipeId);

  const test = new URL(window.location);
  console.log(test);

  fetch(`api/recipes/${recipeId}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((recipe) => renderRecipe(recipe));
}

function renderRecipe(recipe) {
  const container = document.querySelector(".recipe");
  container.innerHTML = "";

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

  const recipeEl = document.createElement("div");
  recipeEl.innerHTML = `
      <img src="img/${recipe.image}" alt="Image of ${recipe.title}" />
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <h4>Ingredients:</h4>
      ${ingredientsList}
      <h4>Preparation Steps:</h4>
      ${preparationList}
      <a href="/">Back</a>
    `;

  container.append(recipeEl);

  if (editForm) {
    editForm.title.value = recipe.title;
    editForm.image.value = recipe.image;
    editForm.description.value = recipe.description;
  }
}

const updateRecipe = (event) => {
  event.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("recipe");
  const { title, image, description } = event.target;
  const updatedRecipe = {
    _id: recipeId,
    title: title.value,
    image: image.value,
    description: description.value,
    ingredients: ingredients.value.split(",").map((item) => item.trim()),
    preparation: preparation.value
      .split(",")
      .map((step) => ({ step: step.trim() })),
  };
  fetch(`api/recipes/${recipeId}`, {
    method: "PUT",
    body: JSON.stringify(updatedRecipe),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(showDetail);
};

const editForm = document.querySelector("#editForm");
editForm.addEventListener("submit", updateRecipe);

showDetail();
