import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  useAuth,
  userRecipes,
  users,
  saved,
  saveToggle,
  categoriesList,
  cuisines,
  sampleRecipesPool
} from '../context/AuthContext';

function User({ initialTab = 'recipes' }) {
  const { user, syncUser } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [myRecipesList, setMyRecipesList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [chefCelebration, setChefCelebration] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Chicken');
  const [area, setArea] = useState('Indian');
  const [thumb, setThumb] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [youtube, setYoutube] = useState('');
  const [formError, setFormError] = useState('');

  const refreshUserRecipes = () => {
    if (!user) return;
    const all = userRecipes();
    const mine = all.filter(r => (r.createdBy || '').toLowerCase() === user.email.toLowerCase());
    setMyRecipesList(mine);
  };

  useEffect(() => {
    refreshUserRecipes();
  }, [user]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const recipeCount = myRecipesList.length;
  const isChef = recipeCount > 10;
  const neededForChef = Math.max(0, 11 - recipeCount);
  const progressPercent = Math.min(100, Math.round((recipeCount / 11) * 100));

  const handleAddRecipe = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) return setFormError('Recipe name is required.');
    if (!instructions.trim()) return setFormError('Cooking instructions are required.');

    const parsedIngredients = ingredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        if (line.includes('-')) {
          const [ing, meas] = line.split('-').map(s => s.trim());
          return { ingredient: ing, measure: meas || '' };
        }
        return { ingredient: line, measure: '' };
      });

    const newRecipe = {
      idMeal: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      strMeal: name.trim(),
      strCategory: category,
      strArea: area,
      strMealThumb: thumb.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      strInstructions: instructions.trim(),
      strYoutube: youtube.trim(),
      ingredients: parsedIngredients.length ? parsedIngredients : [{ ingredient: 'Fresh ingredients', measure: 'As required' }],
      createdBy: user.email.toLowerCase(),
      authorName: user.name,
      createdAt: new Date().toISOString()
    };

    const all = userRecipes();
    const updated = [newRecipe, ...all];
    localStorage.setItem('userRecipes', JSON.stringify(updated));

    const newCount = updated.filter(r => (r.createdBy || '').toLowerCase() === user.email.toLowerCase()).length;
    const nowChef = newCount > 10;

    const allUsers = users().map(u => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, title: nowChef ? 'Chef' : 'Member' };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(allUsers));

    const logged = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    logged.title = nowChef ? 'Chef' : 'Member';
    localStorage.setItem('loggedInUser', JSON.stringify(logged));

    window.dispatchEvent(new Event('recipes-update'));
    window.dispatchEvent(new Event('user-update'));
    if (syncUser) syncUser();
    refreshUserRecipes();

    setName('');
    setIngredientsText('');
    setInstructions('');
    setThumb('');
    setYoutube('');

    if (nowChef && !isChef) {
      setChefCelebration(true);
      setSuccessMessage('🎉 CONGRATULATIONS! You have added more than 10 recipes and unlocked the official CHEF title! 👨‍🍳');
    } else {
      setSuccessMessage(`Recipe "${newRecipe.strMeal}" created successfully! (${newCount} recipes added)`);
    }

    setActiveTab('recipes');
  };

  const fillSample = () => {
    const random = sampleRecipesPool[Math.floor(Math.random() * sampleRecipesPool.length)];
    setName(random.strMeal);
    setCategory(random.strCategory);
    setArea(random.strArea);
    setThumb(random.strMealThumb);
    setInstructions(random.strInstructions);
    setIngredientsText(random.ingredients.map(i => `${i.ingredient} - ${i.measure}`).join('\n'));
    setSuccessMessage('Sample recipe loaded into form! You can review and click "Publish Recipe".');
  };

  const addBulkSampleRecipes = () => {
    const existing = userRecipes();
    const currentMine = existing.filter(r => (r.createdBy || '').toLowerCase() === user.email.toLowerCase());
    const needed = Math.max(11, 11 - currentMine.length + 1);

    const generated = sampleRecipesPool.slice(0, needed).map((sample, idx) => ({
      idMeal: 'custom_bulk_' + Date.now() + '_' + idx,
      strMeal: sample.strMeal,
      strCategory: sample.strCategory,
      strArea: sample.strArea,
      strMealThumb: sample.strMealThumb,
      strInstructions: sample.strInstructions,
      ingredients: sample.ingredients,
      createdBy: user.email.toLowerCase(),
      authorName: user.name,
      createdAt: new Date().toISOString()
    }));

    const updated = [...generated, ...existing];
    localStorage.setItem('userRecipes', JSON.stringify(updated));

    const allUsers = users().map(u => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, title: 'Chef' };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(allUsers));

    const logged = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    logged.title = 'Chef';
    localStorage.setItem('loggedInUser', JSON.stringify(logged));

    window.dispatchEvent(new Event('recipes-update'));
    window.dispatchEvent(new Event('user-update'));
    if (syncUser) syncUser();
    refreshUserRecipes();

    setChefCelebration(true);
    setSuccessMessage(`🎉 Added ${generated.length} sample recipes! You now have ${currentMine.length + generated.length} recipes (> 10) and have unlocked the official 👨‍🍳 CHEF title!`);
    setActiveTab('recipes');
  };

  const handleDeleteRecipe = (idMeal, mealName) => {
    if (!window.confirm(`Are you sure you want to delete "${mealName}"?`)) return;

    const all = userRecipes();
    const updated = all.filter(r => r.idMeal !== idMeal);
    localStorage.setItem('userRecipes', JSON.stringify(updated));

    const remainingCount = updated.filter(r => (r.createdBy || '').toLowerCase() === user.email.toLowerCase()).length;
    const stillChef = remainingCount > 10;

    const allUsers = users().map(u => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, title: stillChef ? 'Chef' : 'Member' };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(allUsers));

    const logged = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    logged.title = stillChef ? 'Chef' : 'Member';
    localStorage.setItem('loggedInUser', JSON.stringify(logged));

    window.dispatchEvent(new Event('recipes-update'));
    window.dispatchEvent(new Event('user-update'));
    if (syncUser) syncUser();
    refreshUserRecipes();
    setSuccessMessage(`Recipe "${mealName}" removed.`);
  };

  return (
    <>
      <Navbar active={activeTab === 'add' ? 'add-recipe' : 'user'} />
      <main className="user-module-page">
        <section className="user-module-header">
          <div className="user-profile-banner">
            <div className="user-profile-avatar-large">
              {isChef ? '👨‍🍳' : '👤'}
            </div>
            <div className="user-profile-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className="small-title">USER MODULE</span>
                {isChef ? (
                  <span className="chef-badge-pill-large">👨‍🍳 Certified Chef</span>
                ) : (
                  <span className="member-badge-pill">Home Cook</span>
                )}
              </div>
              <h2>
                {isChef ? `Chef ${user.name}` : user.name}
              </h2>
              <p className="user-email-text">{user.email}</p>
            </div>
          </div>

          <div className="chef-status-card">
            <div className="chef-status-info">
              <div className="chef-status-icon">{isChef ? '🏆' : '🍳'}</div>
              <div>
                <h3>{isChef ? 'Chef Title Unlocked!' : 'Progress to Chef Title'}</h3>
                <p>
                  {isChef ? (
                    <>You have created <strong>{recipeCount} recipes</strong> (more than 10). You are recognized as an official <strong>Chef</strong> across the platform!</>
                  ) : (
                    <>You have added <strong>{recipeCount}</strong> out of <strong>11 recipes</strong>. Add <strong>{neededForChef}</strong> more recipe{neededForChef === 1 ? '' : 's'} to unlock your <strong>Chef title</strong>!</>
                  )}
                </p>
              </div>
            </div>
            <div className="chef-progress-container">
              <div className="chef-progress-bar">
                <div
                  className="chef-progress-fill"
                  style={{ width: `${progressPercent}%`, backgroundColor: isChef ? '#2e7d32' : '#f4511e' }}
                />
              </div>
              <div className="chef-progress-labels">
                <span>{recipeCount} recipes added</span>
                <span>{isChef ? 'Chef Title Active 👨‍🍳' : `${progressPercent}% (${neededForChef} more needed)`}</span>
              </div>
            </div>
          </div>
        </section>

        {chefCelebration && (
          <div className="celebration-banner">
            <div className="celebration-content">
              <span className="celebration-icon">🎉👨‍🍳⭐</span>
              <div>
                <h3>Congratulations Chef {user.name}!</h3>
                <p>You have published more than 10 recipes! The <strong>Chef</strong> title has been added to your profile, headers, and recipes!</p>
              </div>
              <button className="celebration-close" onClick={() => setChefCelebration(false)}>✕</button>
            </div>
          </div>
        )}

        {successMessage && !chefCelebration && (
          <div className="flash-alert success">
            <span>✓ {successMessage}</span>
            <button onClick={() => setSuccessMessage('')}>✕</button>
          </div>
        )}

        <div className="user-module-tabs">
          <button
            className={`user-tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('recipes')}
          >
            🍲 My Added Recipes ({recipeCount})
          </button>
          <button
            className={`user-tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            ➕ Add New Recipe
          </button>
        </div>

        {activeTab === 'add' && (
          <section className="add-recipe-section">
            <div className="add-recipe-card">
              <div className="add-recipe-header">
                <div>
                  <h2>Add a New Recipe</h2>
                  <p>Share your culinary masterpiece with the community and progress towards the Chef title.</p>
                </div>
                <div className="add-recipe-quick-actions">
                  <button type="button" className="sample-btn" onClick={fillSample} title="Autofill form with a delicious sample recipe">
                    ✨ Fill Sample Recipe
                  </button>
                  <button type="button" className="bulk-btn" onClick={addBulkSampleRecipes} title="Quickly add 11 recipes to unlock Chef title immediately">
                    🚀 Unlock Chef Title (Add 11 Samples)
                  </button>
                </div>
              </div>

              {formError && <p className="form-error-msg">{formError}</p>}

              <form onSubmit={handleAddRecipe} className="recipe-add-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Recipe Name *</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Creamy Tuscan Garlic Chicken"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      {categoriesList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Cuisine / Area</label>
                    <select value={area} onChange={e => setArea(e.target.value)}>
                      {cuisines.map(([c]) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="Mediterranean">Mediterranean</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Greek">Greek</option>
                      <option value="Global">Global</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                      value={thumb}
                      onChange={e => setThumb(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                      Leave blank to use a tasty high-resolution default image.
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Ingredients & Measurements (One per line)</label>
                  <textarea
                    rows="5"
                    value={ingredientsText}
                    onChange={e => setIngredientsText(e.target.value)}
                    placeholder={'e.g.\nChicken Breast - 500g\nHeavy Cream - 1 cup\nGarlic cloves - 4 minced\nOlive Oil - 2 tbsp'}
                  />
                  <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                    Tip: Format as "Ingredient - Quantity" (e.g. Olive Oil - 2 tbsp) or simply item names.
                  </small>
                </div>

                <div className="form-group">
                  <label>Cooking Instructions *</label>
                  <textarea
                    rows="6"
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder={'Step 1: Prep and chop all ingredients...\nStep 2: Heat olive oil in a skillet...\nStep 3: Simmer until golden and serve hot.'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>YouTube Tutorial URL (Optional)</label>
                  <input
                    value={youtube}
                    onChange={e => setYoutube(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="auth-button" style={{ maxWidth: '300px' }}>
                    Publish Recipe
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setActiveTab('recipes')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'recipes' && (
          <section className="my-recipes-section">
            <div className="my-recipes-header">
              <div>
                <h2>Your Published Recipes ({recipeCount})</h2>
                <p>Recipes authored by you in the Food Recipe App.</p>
              </div>
              <button className="add-recipe-btn-top" onClick={() => setActiveTab('add')}>
                ➕ Add Another Recipe
              </button>
            </div>

            {myRecipesList.length > 0 ? (
              <div className="recipe-container">
                {myRecipesList.map(recipe => (
                  <div className="recipe-card" key={recipe.idMeal}>
                    <div className="recipe-image">
                      <img
                        src={recipe.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                        alt={recipe.strMeal}
                      />
                      <button className="heart" onClick={() => saveToggle(recipe)}>
                        {saved().some(x => x.idMeal === recipe.idMeal) ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="recipe-content">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="tag">{recipe.strArea || 'Custom'} • {recipe.strCategory || 'General'}</span>
                        {isChef && <span className="chef-badge-pill">👨‍🍳 Chef</span>}
                      </div>
                      <h3>{recipe.strMeal}</h3>
                      <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 12px' }}>
                        Created on {new Date(recipe.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                      <div className="card-buttons">
                        <Link className="view-recipe" to={'/recipe/' + recipe.idMeal}>
                          View Recipe
                        </Link>
                        <button
                          className="delete-user"
                          onClick={() => handleDeleteRecipe(recipe.idMeal, recipe.strMeal)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-user-recipes-card">
                <div className="no-recipes-icon">🍲</div>
                <h3>You Haven't Added Any Recipes Yet</h3>
                <p>Start sharing your favorite dishes to earn the <strong>👨‍🍳 Chef</strong> title once you add more than 10 recipes!</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                  <button className="auth-button" style={{ width: 'auto', padding: '12px 24px' }} onClick={() => setActiveTab('add')}>
                    ➕ Add Your First Recipe
                  </button>
                  <button className="sample-btn" onClick={addBulkSampleRecipes}>
                    🚀 Quick Test: Add 11 Recipes (Earn Chef Title)
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

export default User;
