import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { saved } from '../context/AuthContext';

function Saved() {
  const [list, setList] = useState(saved());

  useEffect(() => {
    const f = () => setList(saved());
    window.addEventListener('saved-update', f);
    return () => window.removeEventListener('saved-update', f);
  }, []);

  return (
    <>
      <Navbar active="saved" />
      <main className="saved-page">
        <section className="saved-heading">
          <p className="small-title">YOUR COLLECTION</p>
          <h2>Saved Recipes</h2>
          <p>Your favorite recipes, all in one place.</p>
        </section>
        {list.length ? (
          <div className="recipe-container">
            {list.map(m => (
              <div className="recipe-card" key={m.idMeal}>
                <div className="recipe-image">
                  <img
                    src={m.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'}
                    alt={m.strMeal}
                  />
                  <span className="heart">♥</span>
                </div>
                <div className="recipe-content">
                  <span className="tag">{m.strArea || 'Recipe'}</span>
                  <h3>{m.strMeal}</h3>
                  <div className="card-buttons">
                    <Link className="view-recipe" to={'/recipe/' + m.idMeal}>View Recipe</Link>
                    <button
                      className="remove-save"
                      onClick={() => {
                        const next = list.filter(x => x.idMeal !== m.idMeal);
                        localStorage.setItem('savedRecipes', JSON.stringify(next));
                        setList(next);
                      }}
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
            <p>Explore recipes and save your favorites.</p>
            <Link className="auth-button" to="/recipes" style={{ display: 'inline-block', width: 'auto', padding: '12px 30px' }}>
              Explore Recipes
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Saved;
