import React from 'react';
import { Link } from 'react-router-dom';
import { saved, saveToggle, isUserChef } from '../context/AuthContext';

function RecipeCard({ meal, tag = 'Recipe' }) {
  const isSaved = saved().some(x => x.idMeal === meal.idMeal);
  const isChefMeal = meal.createdBy ? isUserChef(meal.createdBy) : false;

  return (
    <div className="recipe-card">
      <div className="recipe-image">
        <img
          src={meal.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'}
          alt={meal.strMeal}
        />
        <button
          className="heart"
          onClick={() => saveToggle(meal)}
          title={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>
      <div className="recipe-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span className="tag">{meal.strArea || tag}</span>
          {isChefMeal && <span className="chef-badge-pill" title="Created by a Certified Chef">👨‍🍳 Chef Recipe</span>}
        </div>
        <h3>{meal.strMeal}</h3>
        {meal.authorName && (
          <p style={{ fontSize: '13px', color: '#777', margin: '4px 0 10px' }}>
            By {isChefMeal ? '👨‍🍳 Chef ' : ''}{meal.authorName}
          </p>
        )}
        <div className="card-buttons">
          <Link className="view-recipe" to={'/recipe/' + meal.idMeal}>View Recipe</Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
