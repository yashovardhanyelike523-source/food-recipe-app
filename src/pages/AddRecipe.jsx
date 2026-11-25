import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import Heading from "../components/Heading";
import { useAuth } from "../context/AuthContext";
import {
  getCustomRecipes,
  saveCustomRecipes
} from "../utils/storage";

const CATEGORIES = [
  "Chicken",
  "Beef",
  "Dessert",
  "Vegetarian",
  "Seafood",
  "Pasta",
  "Lamb",
  "Pork",
  "Breakfast",
  "Side",
  "Starter",
  "Vegan",
  "Miscellaneous"
];

const CUISINES = [
  "Indian",
  "Italian",
  "Chinese",
  "Japanese",
  "Mexican",
  "American",
  "French",
  "Thai",
  "British",
  "Canadian",
  "Greek",
  "Moroccan",
  "Spanish"
];

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80";

function AddRecipe() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Chicken");
  const [cuisine, setCuisine] = useState("Indian");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [youtube, setYoutube] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredient: "", measure: "" },
    { ingredient: "", measure: "" },
    { ingredient: "", measure: "" }
  ]);

  const [customList, setCustomList] = useState(getCustomRecipes());
  const [message, setMessage] = useState("");

  useEffect(() => {
    const update = () => setCustomList(getCustomRecipes());
    window.addEventListener("custom-recipes-update", update);
    return () => window.removeEventListener("custom-recipes-update", update);
  }, []);

  const addIngredientField = () => {
    if (ingredients.length < 20) {
      setIngredients([...ingredients, { ingredient: "", measure: "" }]);
    }
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return setMessage("Recipe title is required.");
    }
    if (!instructions.trim()) {
      return setMessage("Cooking instructions are required.");
    }

    const newMeal = {
      idMeal: "custom-" + Date.now(),
      strMeal: title.trim(),
      strCategory: category,
      strArea: cuisine,
      strMealThumb: image.trim() || DEFAULT_IMAGE,
      strInstructions: instructions.trim(),
      strYoutube: youtube.trim(),
      authorName: user?.name || "Chef",
      authorEmail: user?.email || "",
      authorRole: user?.role || "chef",
      createdAt: new Date().toLocaleDateString()
    };

    // Map ingredients according to TheMealDB schema
    ingredients.forEach((item, idx) => {
      if (item.ingredient.trim()) {
        newMeal[`strIngredient${idx + 1}`] = item.ingredient.trim();
        newMeal[`strMeasure${idx + 1}`] = item.measure.trim() || "As required";
      }
    });

    const current = getCustomRecipes();
    const next = [newMeal, ...current];
    saveCustomRecipes(next);
    setCustomList(next);

    // Reset Form
    setTitle("");
    setImage("");
    setInstructions("");
    setYoutube("");
    setIngredients([
      { ingredient: "", measure: "" },
      { ingredient: "", measure: "" },
      { ingredient: "", measure: "" }
    ]);

    setMessage("Recipe published successfully! It is now live across the platform.");
    setTimeout(() => setMessage(""), 5000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      const next = customList.filter((r) => r.idMeal !== id);
      saveCustomRecipes(next);
      setCustomList(next);
    }
  };

  // Filter recipes: Chef sees their own, Admin sees all
  const displayRecipes =
    user?.role === "admin"
      ? customList
      : customList.filter((r) => r.authorEmail === user?.email);

  return (
    <Layout>
      <main className="add-recipe-page">
        <Heading
          title={user?.role === "chef" ? "Chef Recipe Studio" : "Add New Recipe"}
          sub={`Welcome, ${user?.name}. Create, manage, and share your culinary creations.`}
        />

        <div className="add-recipe-container">
          <section className="add-recipe-card">
            <h2>🍳 Publish a New Recipe</h2>
            <p>Fill out the details below to add your recipe to the platform.</p>

            {message && (
              <div className="form-alert-success">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="recipe-form">
              <div className="form-group">
                <label>Recipe Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Butter Chicken, Garlic Herb Pasta..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Cuisine / Origin</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                  >
                    {CUISINES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="Paste direct image link (or leave blank for a default photo)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                {image && (
                  <div className="image-preview">
                    <img src={image} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Ingredients & Measurements</label>
                <p className="field-hint">Specify ingredients and their amounts (up to 20).</p>

                <div className="ingredients-inputs">
                  {ingredients.map((item, idx) => (
                    <div className="ingredient-row" key={idx}>
                      <input
                        type="text"
                        placeholder={`Ingredient #${idx + 1} (e.g. Olive oil)`}
                        value={item.ingredient}
                        onChange={(e) =>
                          handleIngredientChange(idx, "ingredient", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Measurement (e.g. 2 tbsp)"
                        value={item.measure}
                        onChange={(e) =>
                          handleIngredientChange(idx, "measure", e.target.value)
                        }
                      />
                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-ing"
                          onClick={() => removeIngredientField(idx)}
                          title="Remove ingredient"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {ingredients.length < 20 && (
                  <button
                    type="button"
                    className="btn-add-ing"
                    onClick={addIngredientField}
                  >
                    + Add Another Ingredient
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Preparation & Cooking Instructions *</label>
                <textarea
                  rows="6"
                  placeholder="Describe step-by-step instructions for preparing and cooking this dish..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>YouTube Video Tutorial URL (Optional)</label>
                <input
                  type="url"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-button submit-recipe-btn">
                ✨ Publish Recipe
              </button>
            </form>
          </section>

          <section className="my-recipes-card">
            <h2>
              {user?.role === "admin" ? "All Platform Custom Recipes" : "My Created Recipes"} ({displayRecipes.length})
            </h2>
            <p>
              {user?.role === "admin"
                ? "Manage all chef-contributed and admin-created recipes across the site."
                : "Your published recipes appear here and are live for all food lovers to view."}
            </p>

            {displayRecipes.length === 0 ? (
              <div className="no-recipes-placeholder">
                <span className="placeholder-icon">🍲</span>
                <p>No recipes added yet.</p>
                <small>Use the form on the left to publish your first masterpiece!</small>
              </div>
            ) : (
              <div className="custom-recipe-list">
                {displayRecipes.map((r) => (
                  <div className="custom-recipe-item" key={r.idMeal}>
                    <img
                      src={r.strMealThumb}
                      alt={r.strMeal}
                      className="custom-thumb"
                    />

                    <div className="custom-recipe-info">
                      <span className="tag">
                        {r.strArea} • {r.strCategory}
                      </span>
                      <h3>{r.strMeal}</h3>
                      <p className="author-meta">
                        Created by <strong>{r.authorName}</strong> ({r.authorRole}) • {r.createdAt}
                      </p>

                      <div className="card-buttons">
                        <Link
                          to={`/recipe/${r.idMeal}`}
                          className="view-recipe"
                        >
                          View Recipe
                        </Link>
                        <button
                          className="remove-save"
                          onClick={() => handleDelete(r.idMeal)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
}

export default AddRecipe;
