import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import useApi from "../hooks/useApi";

import {
  getSavedRecipes,
  saveRecipes,
  getCustomRecipes
} from "../utils/storage";

function Details() {
  const { id } = useParams();

  const customMeal = getCustomRecipes().find(
    (x) => String(x.idMeal) === String(id)
  );

  const { data, error, loading } = useApi(
    customMeal ? "" : "lookup.php?i=" + id
  );

  const m = customMeal || data?.meals?.[0];

  const [isSaved, setIsSaved] = useState(() =>
    getSavedRecipes().some((x) => x && x.idMeal === id)
  );

  useEffect(() => {
    if (m?.idMeal) {
      setIsSaved(getSavedRecipes().some((x) => x && x.idMeal === m.idMeal));
    }
  }, [m?.idMeal]);

  const handleSave = () => {
    if (!m) return;
    const list = getSavedRecipes();

    const exists = list.some(
      (x) => x && x.idMeal === m.idMeal
    );

    const next = exists
      ? list.filter((x) => x && x.idMeal !== m.idMeal)
      : [...list, m];

    saveRecipes(next);
    setIsSaved(!exists);

    alert(
      exists
        ? "Recipe removed from saved recipes!"
        : "Recipe saved successfully!"
    );
  };

  const handleShare = () => {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => alert("Link copied!"))
      .catch(() => alert("Failed to copy link."));
  };

  if (!customMeal && loading) {
    return (
      <Layout>
        <p style={{ textAlign: "center", padding: "40px" }}>
          Loading recipe...
        </p>
      </Layout>
    );
  }

  if (!customMeal && (error || !m)) {
    return (
      <Layout>
        <p style={{ textAlign: "center", padding: "40px" }}>
          {error || "Recipe not found."}
        </p>
      </Layout>
    );
  }

  const ing = Array.from(
    { length: 20 },
    (_, i) => [
      m["strIngredient" + (i + 1)],
      m["strMeasure" + (i + 1)]
    ]
  ).filter((x) => x[0] && String(x[0]).trim());

  return (
    <Layout>

      <main>

        <section className="recipe-details">

          <div className="recipe-details-image">
            <img
              src={m.strMealThumb}
              alt={m.strMeal}
            />
          </div>

          <div className="recipe-details-content">

            <span className="tag">
              {m.strArea} • {m.strCategory}
            </span>

            {m.authorName && (
              <span className="chef-badge-details">
                👨‍🍳 By {m.authorName} ({m.authorRole || "Chef"})
              </span>
            )}

            <h2>{m.strMeal}</h2>

            <div className="recipe-info">

              <div className="info-box">
                🍽️ <strong>{m.strCategory}</strong>
              </div>

              <div className="info-box">
                🌎 <strong>{m.strArea}</strong>
              </div>

            </div>

            <div className="recipe-buttons">

              <button
                className="save-button"
                onClick={handleSave}
              >
                {isSaved ? "♥ Saved Recipe" : "♡ Save Recipe"}
              </button>

              <button
                className="share-button"
                onClick={handleShare}
              >
                Share Recipe
              </button>

            </div>

          </div>

        </section>

        <section className="ingredients-section">

          <h2>Ingredients</h2>

          <ul>
            {ing.map(([a, b], i) => (
              <li key={i}>
                {b ? `${b} ` : ""}{a}
              </li>
            ))}
          </ul>

        </section>

        <section className="instructions-section">

          <h2>Instructions</h2>

          <p style={{ whiteSpace: "pre-line" }}>
            {m.strInstructions}
          </p>

          {m.strYoutube && (
            <p>
              <a
                href={m.strYoutube}
                target="_blank"
                rel="noreferrer"
              >
                Watch video tutorial
              </a>
            </p>
          )}

        </section>

      </main>

    </Layout>
  );
}

export default Details;
