const API_URL =
    "https://www.themealdb.com/api/json/v1/1";

let allRecipes = [];
let currentRecipes = [];
let visibleCount = 12;
let currentCuisine = "";


async function loadRecipes() {

    try {

        allRecipes = [];

        let letters =
            "abcdefghijklmnopqrstuvwxyz";

        for (
            let i = 0;
            i < letters.length;
            i++
        ) {

            let response =
                await fetch(
                    API_URL +
                    "/search.php?f=" +
                    letters[i]
                );


            let data =
                await response.json();


            if (data.meals) {

                data.meals.forEach(
                    function(recipe) {

                        let exists =
                            allRecipes.some(
                                function(item) {

                                    return (
                                        item.idMeal ===
                                        recipe.idMeal
                                    );

                                }
                            );


                        if (!exists) {

                            allRecipes.push(
                                recipe
                            );

                        }

                    }
                );

            }

        }


        currentRecipes =
            allRecipes;

        currentCuisine = "";

        visibleCount = 12;


        displayRecipes(
            currentRecipes
        );


    } catch (error) {

        console.log(error);

        alert(
            "Unable to load recipes."
        );

    }

}



async function searchRecipes() {

    let search =
        document.getElementById(
            "searchInput"
        ).value
        .trim();


    if (search === "") {

        currentRecipes =
            allRecipes;

        currentCuisine = "";

        visibleCount = 12;

        displayRecipes(
            currentRecipes
        );

        return;

    }


    try {

        let response =
            await fetch(
                API_URL +
                "/search.php?s=" +
                encodeURIComponent(search)
            );


        let data =
            await response.json();


        if (
            !data.meals ||
            data.meals.length === 0
        ) {

            alert(
                "No recipes found."
            );

            return;

        }


        currentRecipes =
            data.meals;

        currentCuisine = "";

        visibleCount =
            currentRecipes.length;


        displayRecipes(
            currentRecipes
        );


        document.getElementById(
            "recipes"
        ).scrollIntoView({

            behavior: "smooth"

        });


    } catch (error) {

        console.log(error);

        alert(
            "Unable to connect to the recipe API."
        );

    }

}



async function filterCuisine(cuisine) {

    try {

        currentCuisine =
            cuisine;


        let area =
            cuisine;


        let response =
            await fetch(
                API_URL +
                "/filter.php?a=" +
                encodeURIComponent(area)
            );


        let data =
            await response.json();


        if (
            data.meals &&
            data.meals.length > 0
        ) {

            currentRecipes =
                data.meals;

            visibleCount = 12;


            displayRecipes(
                currentRecipes
            );


            document.getElementById(
                "recipes"
            ).scrollIntoView({

                behavior: "smooth"

            });


            return;

        }


        currentRecipes =
            allRecipes.filter(
                function(recipe) {

                    if (
                        !recipe.strArea
                    ) {

                        return false;

                    }


                    let recipeArea =
                        recipe.strArea
                            .trim()
                            .toLowerCase();


                    let selectedArea =
                        area
                            .trim()
                            .toLowerCase();


                    if (
                        selectedArea === "indian"
                    ) {

                        return (
                            recipeArea ===
                            "india" ||
                            recipeArea ===
                            "indian"
                        );

                    }


                    return (
                        recipeArea ===
                        selectedArea
                    );

                }
            );


        if (
            currentRecipes.length === 0
        ) {

            let searchTerms = {

                "Indian": [
                    "Dal fry",
                    "Chicken Handi",
                    "Lamb Biryani",
                    "Tandoori chicken",
                    "Baingan Bharta",
                    "Matar Paneer",
                    "Kidney Bean Curry",
                    "Chicken Korma"
                ],

                "Italian": [
                    "Pizza",
                    "Pasta",
                    "Lasagne",
                    "Spaghetti",
                    "Risotto"
                ],

                "Chinese": [
                    "Chow Mein",
                    "Kung Pao Chicken",
                    "Sweet and Sour Pork",
                    "Wontons",
                    "Spring Rolls"
                ],

                "Japanese": [
                    "Sushi",
                    "Chicken Teriyaki",
                    "Katsu",
                    "Ramen"
                ],

                "Mexican": [
                    "Tacos",
                    "Enchiladas",
                    "Burritos",
                    "Guacamole"
                ],

                "American": [
                    "Beef Burger",
                    "Chicken Burger",
                    "BBQ Ribs",
                    "Pancakes"
                ],

                "French": [
                    "Ratatouille",
                    "French Onion Soup",
                    "Croque Madame",
                    "Beef Bourguignon"
                ],

                "Thai": [
                    "Pad Thai",
                    "Green Curry",
                    "Red Curry",
                    "Thai"
                ]

            };


            let names =
                searchTerms[cuisine] ||
                [];


            currentRecipes = [];


            for (
                let i = 0;
                i < names.length;
                i++
            ) {

                try {

                    let searchResponse =
                        await fetch(
                            API_URL +
                            "/search.php?s=" +
                            encodeURIComponent(
                                names[i]
                            )
                        );


                    let searchData =
                        await searchResponse.json();


                    if (
                        searchData.meals
                    ) {

                        searchData.meals.forEach(
                            function(recipe) {

                                let exists =
                                    currentRecipes.some(
                                        function(item) {

                                            return (
                                                item.idMeal ===
                                                recipe.idMeal
                                            );

                                        }
                                    );


                                if (!exists) {

                                    currentRecipes.push(
                                        recipe
                                    );

                                }

                            }
                        );

                    }

                } catch (error) {

                    console.log(error);

                }

            }

        }


        if (
            currentRecipes.length === 0
        ) {

            alert(
                "No recipes found for " +
                cuisine
            );

            return;

        }


        visibleCount = 12;


        displayRecipes(
            currentRecipes
        );


        document.getElementById(
            "recipes"
        ).scrollIntoView({

            behavior: "smooth"

        });


    } catch (error) {

        console.log(error);

        alert(
            "Unable to load " +
            cuisine +
            " recipes."
        );

    }

}



function displayRecipes(recipes) {

    let container =
        document.querySelector(
            ".recipe-container"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    let recipesToShow =
        recipes.slice(
            0,
            visibleCount
        );


    recipesToShow.forEach(
        function(recipe) {

            let area =
                recipe.strArea ||
                currentCuisine ||
                "Recipe";


            let category =
                recipe.strCategory ||
                "Delicious Recipe";


            let card =
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

                    <span class="heart">
                        ♡
                    </span>

                </div>


                <div class="recipe-content">

                    <span class="tag">
                        ${area}
                    </span>


                    <h3>
                        ${recipe.strMeal}
                    </h3>


                    <p>
                        ${category}
                    </p>


                    <div class="card-buttons">

                        <button
                            onclick="viewRecipe('${recipe.idMeal}')"
                        >
                            View Recipe
                        </button>


                        <button
                            class="save-button"
                            onclick="saveRecipe('${recipe.idMeal}')"
                        >
                            Save
                        </button>

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );


    createLoadMoreButton();

}



function createLoadMoreButton() {

    let oldButton =
        document.getElementById(
            "loadMoreButton"
        );


    if (oldButton) {

        oldButton.remove();

    }


    if (
        visibleCount >=
        currentRecipes.length
    ) {

        return;

    }


    let container =
        document.querySelector(
            ".recipe-container"
        );


    let button =
        document.createElement(
            "button"
        );


    button.id =
        "loadMoreButton";


    button.textContent =
        "Load More Recipes";


    button.onclick =
        function() {

            visibleCount += 12;

            displayRecipes(
                currentRecipes
            );

        };


    container.parentElement
        .appendChild(
            button
        );

}



function viewRecipe(id) {

    window.location.href =
        "recipe-details.html?id=" +
        id;

}



async function showRecipeDetails() {

    let params =
        new URLSearchParams(
            window.location.search
        );


    let id =
        params.get("id");


    if (!id) {

        return;

    }


    try {

        let response =
            await fetch(
                API_URL +
                "/lookup.php?i=" +
                id
            );


        let data =
            await response.json();


        if (
            !data.meals ||
            data.meals.length === 0
        ) {

            return;

        }


        let recipe =
            data.meals[0];


        document.getElementById(
            "recipeName"
        ).textContent =
            recipe.strMeal;


        document.getElementById(
            "recipeImage"
        ).src =
            recipe.strMealThumb;


        document.getElementById(
            "recipeImage"
        ).alt =
            recipe.strMeal;


        let category =
            document.getElementById(
                "recipeCategory"
            );


        if (category) {

            category.textContent =
                recipe.strCategory ||
                "Not available";

        }


        let cuisine =
            document.getElementById(
                "recipeCuisine"
            );


        if (cuisine) {

            cuisine.textContent =
                recipe.strArea ||
                "Not available";

        }


        let ingredients =
            document.getElementById(
                "ingredients"
            );


        if (ingredients) {

            ingredients.innerHTML = "";


            for (
                let i = 1;
                i <= 20;
                i++
            ) {

                let ingredient =
                    recipe[
                        "strIngredient" + i
                    ];


                let measure =
                    recipe[
                        "strMeasure" + i
                    ];


                if (
                    ingredient &&
                    ingredient.trim() !== ""
                ) {

                    let li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        (
                            measure
                                ? measure + " "
                                : ""
                        ) +
                        ingredient;


                    ingredients.appendChild(
                        li
                    );

                }

            }

        }


        let instructions =
            document.getElementById(
                "instructions"
            );


        if (instructions) {

            instructions.innerHTML = "";


            let steps =
                recipe.strInstructions
                    .split(/\r?\n/)
                    .filter(
                        function(step) {

                            return (
                                step.trim() !== ""
                            );

                        }
                    );


            steps.forEach(
                function(step) {

                    let li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        step.trim();


                    instructions.appendChild(
                        li
                    );

                }
            );

        }


        let saveButton =
            document.getElementById(
                "saveButton"
            );


        if (saveButton) {

            saveButton.onclick =
                function() {

                    saveRecipe(
                        recipe.idMeal
                    );

                };

        }


        let shareButton =
            document.getElementById(
                "shareButton"
            );


        if (shareButton) {

            shareButton.onclick =
                function() {

                    shareRecipe(
                        recipe.strMeal
                    );

                };

        }


    } catch (error) {

        console.log(error);

    }

}



function getSavedRecipeKey() {

    let loggedInUser =
        JSON.parse(
            localStorage.getItem(
                "loggedInUser"
            )
        );


    if (
        !loggedInUser ||
        !loggedInUser.email
    ) {

        return null;

    }


    return (
        "savedRecipes_" +
        loggedInUser.email
    );

}



function saveRecipe(id) {

    let key =
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


    id =
        String(id);


    if (
        !savedRecipes.includes(id)
    ) {

        savedRecipes.push(id);


        localStorage.setItem(
            key,
            JSON.stringify(
                savedRecipes
            )
        );


        alert(
            "Recipe saved!"
        );

    } else {

        alert(
            "Recipe is already saved."
        );

    }

}



function shareRecipe(name) {

    if (navigator.share) {

        navigator.share({

            title: name,

            text:
                "Check out this recipe: " +
                name

        });

    } else {

        alert(
            "Recipe: " +
            name
        );

    }

}



if (
    document.querySelector(
        ".recipe-container"
    )
) {

    loadRecipes();

}


if (
    document.getElementById(
        "recipeName"
    )
) {

    showRecipeDetails();

}