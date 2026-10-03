const API_URL =
    "https://www.themealdb.com/api/json/v1/1";


const selectedCuisines = [
    "Indian",
    "Italian",
    "Chinese",
    "Japanese",
    "Mexican",
    "American",
    "French",
    "Thai"
];


const cuisineIcons = {
    Indian: "🍛",
    Italian: "🍕",
    Chinese: "🥢",
    Japanese: "🍣",
    Mexican: "🌮",
    American: "🍔",
    French: "🥐",
    Thai: "🍜"
};



async function loadCategories() {

    const categoryContainer =
        document.getElementById(
            "categoryContainer"
        );

    const cuisineContainer =
        document.getElementById(
            "cuisineContainer"
        );


    try {

        const response =
            await fetch(
                API_URL +
                "/categories.php"
            );


        const data =
            await response.json();


        categoryContainer.innerHTML = "";


        if (data.categories) {

            data.categories.forEach(
                function(category) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "category";


                    card.innerHTML = `

                        <img
                            class="category-icon"
                            src="${category.strCategoryThumb}"
                            alt="${category.strCategory}"
                        >

                        <h3>
                            ${category.strCategory}
                        </h3>

                    `;


                    card.onclick =
                        function() {

                            localStorage.setItem(
                                "selectedCategory",
                                category.strCategory
                            );


                            localStorage.setItem(
                                "selectedCategoryType",
                                "category"
                            );


                            window.location.href =
                                "category-recipes.html";

                        };


                    categoryContainer.appendChild(
                        card
                    );

                }
            );

        }



        cuisineContainer.innerHTML = "";


        selectedCuisines.forEach(
            function(cuisine) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "category";


                card.innerHTML = `

                    <div class="category-icon">
                        ${cuisineIcons[cuisine]}
                    </div>

                    <h3>
                        ${cuisine}
                    </h3>

                `;


                card.onclick =
                    function() {

                        localStorage.setItem(
                            "selectedCategory",
                            cuisine
                        );


                        localStorage.setItem(
                            "selectedCategoryType",
                            "cuisine"
                        );


                        window.location.href =
                            "category-recipes.html";

                    };


                cuisineContainer.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.log(error);

    }

}


loadCategories();