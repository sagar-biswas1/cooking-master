const button = document.getElementById("submit-btn");

button.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("meal-items").innerHTML = "";
  document.getElementById("error-message").innerHTML = "";
  document.getElementById("product-info").innerHTML = "";
  const inputValue = document.getElementById("input-value").value;

  if (inputValue.length > 0) {
    getMealData(inputValue);
  } else {
    document.getElementById("error-message").innerHTML =
      "<p class='text-center p-3 bg-danger'><b>Please enter a meal name...</b></p>";
  }
});

//function for passing url for data fetching based on different input
const getMealData = (mealName) => {
  if (mealName.length === 1) {
    mealCardDiv(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${mealName}`
    );
  } else {
    mealCardDiv(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );
  }
};

//function for data fetching
const fetchedData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

//function for displaying all product by search after fetching data
const mealCardDiv = (url) => {
  fetchedData(url)
    .then((data) => {
      data.meals.forEach((element) => {
        const mealSets = document.getElementById("meal-items");
        const { strMeal, strMealThumb } = element;

        const mealDiv = document.createElement("div");
        mealDiv.className = "col m-auto";
        let mealCard = ` <div class="m-3" style="cursor: pointer" onClick='singleMealData("${strMeal}")'>
          <div class="card h-100">
            <img
              src="${strMealThumb}"
              class="card-img-top img-fluid" style=""
            />
            <div class="card-footer text-center">
               <h6 class="card-title">${strMeal}</h6>
            </div>
          </div>
        </div>`;
        mealDiv.innerHTML = mealCard;

        mealSets.appendChild(mealDiv);
      });
    })
    .catch((err) => {
      errorMessage();
    });
};

//function for single product description
const singleMealData = (itemName) => {
  window.scrollTo(0, 40);
  fetchedData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${itemName}`
  ).then((data) => {
    const singleMealInfo = data.meals[0];
    const { strMeal, strMealThumb } = singleMealInfo;
    const singleMealDiv = document.getElementById("product-info");
    singleMealDiv.innerHTML = `
 <div class="card m-auto" style="width: 20rem">
   <img
     src="${strMealThumb}"
     class="card-img-top"
    />
   <div class="card-body">
     <h5 class="card-title">${strMeal}</h5>
     <p><b>Ingredients</b></p>
     <ul id="ingredient-list"></ul>
   </div>
 </div>`;
    const list = document.getElementById("ingredient-list");

    for (let i = 1; i <= 20; i++) {
      let ingredientKey = "strIngredient" + i;
      let ingredient = singleMealInfo[ingredientKey];
      let quantityKey = "strMeasure" + i;
      let quantity = singleMealInfo[quantityKey];
      let listItem = quantity + " " + ingredient;
      const li = document.createElement("li");

      if (listItem.length > 2 && listItem.indexOf("null null") != 0) {
        li.innerText = listItem;
        list.appendChild(li);
      }
    }
  });
};

//function for displaying error message.
const errorMessage = () => {
  const inputValue = document.getElementById("input-value").value;
  const errorMessageDiv = document.getElementById("error-message");
  document.getElementById("product-info").innerHTML = "";

  errorMessageDiv.innerHTML = ` <div class="card m-auto p-5 bg-warning" style="width: 18rem">
          <h5 class="card-title">Dear Sir/Ma'am,</h5>
          <p class="card-text">
            Your search --<b>${inputValue}</b>-- did not match any of our set meal. Please enter a
            correct name.
          </p>
        </div>`;
};
