import RecipeCard from "./RecipeCard";

function RecipeGrid({
  data,
  loading,
  error,
  tag = "Recipe"
}) {

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const meals = data?.meals || [];

  return meals.length ? (
    <div className="recipe-container">

      {meals.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          tag={tag}
        />
      ))}

    </div>
  ) : (
    <p>No recipes found.</p>
  );
}

export default RecipeGrid;