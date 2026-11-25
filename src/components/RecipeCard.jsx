import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getSavedRecipes,
  saveRecipes
} from "../utils/storage";

function RecipeCard({ meal, tag = "Recipe" }) {

  const [isSaved, setIsSaved] = useState(() =>
    getSavedRecipes().some(
      (x) => x && x.idMeal === meal?.idMeal
    )
  );

  useEffect(() => {
    const update = () => {
      setIsSaved(
        getSavedRecipes().some(
          (x) => x && x.idMeal === meal?.idMeal
        )
      );
    };

    window.addEventListener("saved-update", update);

    return () => {
      window.removeEventListener("saved-update", update);
    };
  }, [meal?.idMeal]);

  const toggleSave = () => {
    if (!meal?.idMeal) return;
    const list = getSavedRecipes();

    const next = isSaved
      ? list.filter(
          (x) => x && x.idMeal !== meal.idMeal
        )
      : [...list, meal];

    saveRecipes(next);
    setIsSaved(!isSaved);
  };

  return (
    <div className="recipe-card">

      <div className="recipe-image">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
        />

        <button
          className="heart"
          onClick={toggleSave}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div className="recipe-content">

        <span className="tag">{tag}</span>

        <h3>{meal.strMeal}</h3>

        <div className="card-buttons">
          <Link
            className="view-recipe"
            to={`/recipe/${meal.idMeal}`}
          >
            View Recipe
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RecipeCard;