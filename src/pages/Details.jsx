import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useApi, userRecipes, saveToggle, isUserChef } from '../context/AuthContext';

function Details() {
  const { id } = useParams();
  const customMeal = userRecipes().find(r => r.idMeal === id);
  const { data, error, loading } = useApi(customMeal ? '' : 'lookup.php?i=' + id);
  const m = customMeal || data?.meals?.[0];

  if (!customMeal && loading) return <><Navbar /><p style={{ textAlign: 'center', padding: '50px' }}>Loading recipe...</p></>;
  if (!m) return <><Navbar /><p style={{ textAlign: 'center', padding: '50px' }}>{error || 'Recipe not found.'}</p></>;

  const isAuthorChef = m.createdBy ? isUserChef(m.createdBy) : false;

  let ing = [];
  if (m.ingredients && Array.isArray(m.ingredients)) {
    ing = m.ingredients.map(x => [x.ingredient, x.measure]);
  } else {
    ing = Array.from({ length: 20 }, (_, i) => [
      m['strIngredient' + (i + 1)],
      m['strMeasure' + (i + 1)]
    ]).filter(x => x[0]?.trim());
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="recipe-details">
          <div className="recipe-details-image">
            <img
              src={m.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
              alt={m.strMeal}
            />
          </div>
          <div className="recipe-details-content">
            <span className="tag">{m.strArea || 'Global'} • {m.strCategory || 'Recipe'}</span>
            <h2>{m.strMeal}</h2>

            {m.createdBy && (
              <div style={{ margin: '12px 0 16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', color: '#666' }}>Shared by:</span>
                <strong style={{ fontSize: '15px' }}>
                  {isAuthorChef ? 'Chef ' : ''}{m.authorName || m.createdBy}
                </strong>
                {isAuthorChef && <span className="chef-badge-pill">👨‍🍳 Certified Chef</span>}
              </div>
            )}

            <div className="recipe-info">
              <div className="info-box">🍽️ <strong>{m.strCategory || 'Custom'}</strong></div>
              <div className="info-box">🌎 <strong>{m.strArea || 'World'}</strong></div>
            </div>
            <div className="recipe-buttons">
              <button className="save-button" onClick={() => { saveToggle(m); alert('Saved recipes updated!'); }}>
                ♡ Save Recipe
              </button>
              <button className="share-button" onClick={() => navigator.clipboard?.writeText(location.href).then(() => alert('Link copied to clipboard!'))}>
                Share Recipe
              </button>
            </div>
          </div>
        </section>

        <section className="ingredients-section">
          <h2>Ingredients</h2>
          {ing.length ? (
            <ul>
              {ing.map(([a, b], i) => (
                <li key={i}>{b ? `${b} ` : ''}{a}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#777' }}>No specific ingredients listed.</p>
          )}
        </section>

        <section className="instructions-section">
          <h2>Instructions</h2>
          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            {m.strInstructions || 'No instructions provided.'}
          </p>
          {m.strYoutube && (
            <p style={{ marginTop: '20px' }}>
              <a href={m.strYoutube} target="_blank" rel="noreferrer" style={{ color: '#f4511e', fontWeight: 'bold' }}>
                ▶ Watch Video Tutorial
              </a>
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Details;
