const API_URL =
    "https://www.themealdb.com/api/json/v1/1";


const recipesPerPage = 30;

let allCategoryRecipes = [];

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



const cuisineAreaNames = {

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


    try {

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
                cuisineAreaNames[
                    selectedCategory
                ] || selectedCategory;


            url =
                API_URL +
                "/filter.php?a=" +
                encodeURIComponent(
                    area
                );

        }


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (
            !data.meals ||
            data.meals.length === 0
        ) {

            recipeContainer.innerHTML = `

                <p>
                    No recipes found for
                    ${selectedCategory}.
                </p>

            `;

            pagination.innerHTML = "";

            return;

        }


        allCategoryRecipes =
            data.meals;


        currentPage = 1;


        displayRecipes();


    } catch (error) {

        console.log(error);


        recipeContainer.innerHTML = `

            <p>
                Unable to load recipes.
                Please try again.
            </p>

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
        allCategoryRecipes.slice(
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

                    <span
                        class="heart"
                        onclick="saveRecipe('${recipe.idMeal}')"
                    >
                        ♡
                    </span>

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
            allCategoryRecipes.length /
            recipesPerPage
        );


    if (totalPages <= 1) {

        return;

    }


    const previousButton =
        document.createElement(
            "button"
        );


    previousButton.textContent =
        "Previous";


    previousButton.disabled =
        currentPage === 1;


    previousButton.onclick =
        function() {

            if (currentPage > 1) {

                currentPage--;

                displayRecipes();

            }

        };


    pagination.appendChild(
        previousButton
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



    const nextButton =
        document.createElement(
            "button"
        );


    nextButton.textContent =
        "Next";


    nextButton.disabled =
        currentPage === totalPages;


    nextButton.onclick =
        function() {

            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                displayRecipes();

            }

        };


    pagination.appendChild(
        nextButton
    );

}



loadCategoryRecipes();