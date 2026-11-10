import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import { cuisines, useApi, userRecipes } from '../context/AuthContext';

function Heading({ title, sub }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
    </div>
  );
}

function Home() {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const { data, error, loading } = useApi('search.php?s=' + encodeURIComponent(search));

  const allCustom = userRecipes();
  const matchedCustom = search.trim()
    ? allCustom.filter(r => r.strMeal?.toLowerCase().includes(search.toLowerCase()))
    : allCustom.slice(0, 4);

  const combined = [...matchedCustom, ...(data?.meals || [])].slice(0, 12);

  return (
    <>
      <Navbar active="home" />
      <section className="hero">
        <div className="hero-content">
          <p className="small-title">GOOD FOOD, A BETTER YOU</p>
          <h2>Discover Delicious<br />Recipes from Around the World</h2>
          <p className="hero-text">Explore, cook, and enjoy recipes from different cultures. Add your own recipes and earn the prestigious Chef title!</p>
          <div className="search-box">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearch(q)}
              placeholder="Search for a recipe, cuisine or ingredient..."
            />
            <button onClick={() => setSearch(q)}>Search</button>
          </div>
        </div>
      </section>
      <section className="categories">
        <Heading title="Explore by Cuisine" sub="Discover recipes from different parts of the world" />
        <div className="category-container">
          {cuisines.map(([n, i]) => (
            <Link className="category" to={'/category/cuisine/' + n} key={n}>
              <div className="category-icon">{i}</div>
              <h3>{n}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="recipes">
        <Heading title="Popular Recipes" sub="Try our most loved dishes from our community and around the world" />
        {loading && combined.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '30px' }}>Loading recipes...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', padding: '30px', color: 'crimson' }}>{error}</p>
        ) : combined.length ? (
          <div className="recipe-container">
            {combined.map(m => (
              <RecipeCard key={m.idMeal} meal={m} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '30px' }}>No recipes found.</p>
        )}
        <div className="center-action">
          <Link className="auth-button" to="/recipes" style={{ display: 'inline-block', width: 'auto', padding: '12px 30px' }}>
            Explore All Recipes
          </Link>
        </div>
      </section>
      <section className="about">
        <div>
          <h2>Cook. Share. Enjoy.</h2>
          <p>Join our community of passionate food lovers. Add your recipes, reach 10+ recipes to unlock your official 👨‍🍳 Chef title, and inspire cooks worldwide!</p>
        </div>
        <div className="about-icon">🌿</div>
      </section>
      <Footer />
    </>
  );
}

export default Home;
