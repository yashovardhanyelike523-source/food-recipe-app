import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import {
  getSavedRecipes,
  saveRecipes
} from "../utils/storage";

function Saved() {
  const [list, setList] = useState(
    getSavedRecipes()
  );

  useEffect(() => {
    const update = () => {
      setList(getSavedRecipes());
    };

    window.addEventListener("saved-update", update);

    return () => {
      window.removeEventListener("saved-update", update);
    };
  }, []);

  const removeRecipe = (id) => {
    const next = list.filter(
      (x) => x.idMeal !== id
    );

    saveRecipes(next);
    setList(next);
  };

  return (
    <Layout>

      <main className="saved-page">

        <section className="saved-heading">

          <p className="small-title">
            YOUR COLLECTION
          </p>

          <h2>Saved Recipes</h2>

          <p>
            Your favorite recipes, all in one place.
          </p>

        </section>

        {list.length ? (

          <div className="recipe-container">

            {list.map((m) => (

              <div
                className="recipe-card"
                key={m.idMeal}
              >

                <div className="recipe-image">
                  <img
                    src={m.strMealThumb}
                    alt={m.strMeal}
                  />

                  <span className="heart">♥</span>
                </div>

                <div className="recipe-content">

                  <span className="tag">
                    {m.strArea || "Recipe"}
                  </span>

                  <h3>{m.strMeal}</h3>

                  <div className="card-buttons">

                    <Link
                      className="view-recipe"
                      to={"/recipe/" + m.idMeal}
                    >
                      View Recipe
                    </Link>

                    <button
                      className="remove-save"
                      onClick={() =>
                        removeRecipe(m.idMeal)
                      }
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="no-saved">

            <div className="no-saved-icon">♡</div>

            <h2>No Saved Recipes Yet</h2>

            <p>
              Explore recipes and save your favorites.
            </p>

            <Link
              className="auth-button"
              to="/recipes"
            >
              Explore Recipes
            </Link>

          </div>

        )}

      </main>

    </Layout>
  );
}

export default Saved;