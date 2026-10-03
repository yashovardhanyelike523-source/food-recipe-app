const API_URL =
    "https://www.themealdb.com/api/json/v1/1";


const recipesPerPage = 30;

let allRecipes = [];

let currentPage = 1;


const selectedCategory =
    localStorage.getItem(
        "selectedCategory"
    );


const selectedCategoryType =
    localStorage.getItem(
        "selectedCategoryType"
    );


const categoryTitle =
    document.getElementById(
        "categoryTitle"
    );


const recipeContainer =
    document.getElementById(
        "categoryRecipesContainer"
    );


const pagination =
    document.getElementById(
        "categoryPagination"
    );


const cuisineAreas = {

    Indian: "India",

    Italian: "Italian",

    Chinese: "Chinese",

    Japanese: "Japanese",

    Mexican: "Mexican",

    American: "American",

    French: "French",

    Thai: "Thai"

};



async function loadCategoryRecipes() {

    if (!selectedCategory) {

        categoryTitle.textContent =
            "Recipes";

        return;

    }


    categoryTitle.textContent =
        selectedCategory +
        " Recipes";


    let url;


    if (
        selectedCategoryType ===
        "category"
    ) {

        url =
            API_URL +
            "/filter.php?c=" +
            encodeURIComponent(
                selectedCategory
            );

    } else {

        let area =
            cuisineAreas[
                selectedCategory
            ] || selectedCategory;


        url =
            API_URL +
            "/filter.php?a=" +
            encodeURIComponent(
                area
            );

    }


    try {

        const response =
            await fetch(url);


        const data =
            await response.json();


        if (
            !data.meals ||
            data.meals.length === 0
        ) {

            recipeContainer.innerHTML = `

                <div class="no-saved">

                    <h2>
                        No Recipes Found
                    </h2>

                    <p>
                        No recipes are available for
                        ${selectedCategory}.
                    </p>

                </div>

            `;

            pagination.innerHTML = "";

            return;

        }


        allRecipes =
            data.meals;


        currentPage = 1;


        displayRecipes();


    } catch (error) {

        console.log(error);


        recipeContainer.innerHTML = `

            <div class="no-saved">

                <h2>
                    Unable to Load Recipes
                </h2>

                <p>
                    Please try again.
                </p>

            </div>

        `;

    }

}



function displayRecipes() {

    recipeContainer.innerHTML = "";


    const start =
        (currentPage - 1) *
        recipesPerPage;


    const end =
        start +
        recipesPerPage;


    const recipes =
        allRecipes.slice(
            start,
            end
        );


    recipes.forEach(
        function(recipe) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "recipe-card";


            card.innerHTML = `

                <div class="recipe-image">

                    <img
                        src="${recipe.strMealThumb}"
                        alt="${recipe.strMeal}"
                    >

                    <button
                        class="heart"
                        onclick="saveRecipe('${recipe.idMeal}')"
                    >
                        ♡
                    </button>

                </div>


                <div class="recipe-content">

                    <span class="tag">
                        ${selectedCategory}
                    </span>


                    <h3>
                        ${recipe.strMeal}
                    </h3>


                    <button
                        onclick="viewRecipe('${recipe.idMeal}')"
                    >
                        View Recipe
                    </button>

                </div>

            `;


            recipeContainer.appendChild(
                card
            );

        }
    );


    createPagination();

}



function createPagination() {

    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            allRecipes.length /
            recipesPerPage
        );


    if (totalPages <= 1) {

        return;

    }


    const previous =
        document.createElement(
            "button"
        );


    previous.textContent =
        "Previous";


    previous.disabled =
        currentPage === 1;


    previous.onclick =
        function() {

            currentPage--;

            displayRecipes();

        };


    pagination.appendChild(
        previous
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            page;


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.onclick =
            function() {

                currentPage =
                    page;

                displayRecipes();

            };


        pagination.appendChild(
            button
        );

    }


    const next =
        document.createElement(
            "button"
        );


    next.textContent =
        "Next";


    next.disabled =
        currentPage === totalPages;


    next.onclick =
        function() {

            currentPage++;

            displayRecipes();

        };


    pagination.appendChild(
        next
    );

}



function getSavedRecipeKey() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !user ||
        !user.email
    ) {

        return null;

    }


    return "savedRecipes_" +
        user.email;

}



function saveRecipe(id) {

    const key =
        getSavedRecipeKey();


    if (!key) {

        alert(
            "Please sign in to save recipes."
        );

        window.location.href =
            "signin.html";

        return;

    }


    let savedRecipes =
        JSON.parse(
            localStorage.getItem(key)
        ) || [];


    if (
        savedRecipes.includes(
            String(id)
        )
    ) {

        alert(
            "Recipe is already saved."
        );

        return;

    }


    savedRecipes.push(
        String(id)
    );


    localStorage.setItem(
        key,
        JSON.stringify(
            savedRecipes
        )
    );


    alert(
        "Recipe saved!"
    );

}



function viewRecipe(id) {

    window.location.href =
        "recipe-details.html?id=" +
        id;

}



loadCategoryRecipes();