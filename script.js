const searchForm = document.querySelector("#search-form"),
  searchInput = document.getElementById("search-input"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  singleMealEl = document.getElementById("single-meal"),
  showAllBtn = document.getElementById("show-all");

let allMeals = [];

function searchMeal(e) {
  e.preventDefault();
  const term = searchInput.value.trim();
  if (term !== "") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        allMeals = data.meals || [];
        displayMeals(allMeals.slice(0, 5)); // Display first 5 meals
        if (allMeals.length > 5) showAllBtn.style.display = "block";
        else showAllBtn.style.display = "none";
      });
    searchInput.value = "";
  } else {
    resultHeading.innerHTML = "<h2>Please enter keywords to search</h2>";
  }
}

function displayMeals(meals) {
  mealsEl.innerHTML = "";
  meals.forEach((meal) => {
    const mealEl = document.createElement("div");
    mealEl.classList.add("meal", "col-md-4");
    mealEl.innerHTML = `
      <div class="card">
        <img src="${meal.strMealThumb}" class="card-img-top" alt="${
      meal.strMeal
    }">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
          <a href="#" class="btn btn-primary btn-sm" data-mealid="${
            meal.idMeal
          }">Read More</a>
        </div>
      </div>
    `;
    mealsEl.appendChild(mealEl);
  });
}

function displayAllMeals() {
  displayMeals(allMeals);
  showAllBtn.style.display = "none";
}

function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDom(meal);
    });
}

function addMealToDom(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  singleMealEl.innerHTML = `
    <div class="card">
      <img src="${meal.strMealThumb}" class="card-img-top" alt="${
    meal.strMeal
  }">
      <div class="card-body">
        <h2 class="card-title">${meal.strMeal}</h2>
        <h5 class="card-subtitle mb-2 text-muted">${meal.strCategory}</h5>
        <p class="card-text">${meal.strInstructions}</p>
        <h3>Ingredients</h3>
        <ul class="list-group">
          ${ingredients
            .map(
              (ingredient) => `<li class="list-group-item">${ingredient}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>
  `;
}

searchForm.addEventListener("submit", searchMeal);
showAllBtn.addEventListener("click", displayAllMeals);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.target.closest(".card");
  if (mealInfo) {
    const mealID = mealInfo.querySelector("a").getAttribute("data-mealid");
    getMealById(mealID);
  }
});
