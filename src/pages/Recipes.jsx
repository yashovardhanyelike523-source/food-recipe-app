import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import { useApi, userRecipes } from '../context/AuthContext';

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

function Recipes() {
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  const { data, error, loading } = useApi('search.php?s=' + encodeURIComponent(term));

  const allCustom = userRecipes();
  const matchedCustom = term.trim()
    ? allCustom.filter(r =>
        r.strMeal?.toLowerCase().includes(term.toLowerCase()) ||
        r.strCategory?.toLowerCase().includes(term.toLowerCase()) ||
        r.strArea?.toLowerCase().includes(term.toLowerCase())
      )
    : allCustom;

  const combined = [...matchedCustom, ...(data?.meals || [])];

  return (
    <>
      <Navbar active="recipes" />
      <main className="recipes">
        <Heading title="Explore Recipes" sub="Find your next favorite meal or discover creations from our community chefs" />
        <div className="search-box">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && setTerm(q)}
            placeholder="Search recipes by name, cuisine or category..."
          />
          <button onClick={() => setTerm(q)}>Search</button>
        </div>
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
      </main>
      <Footer />
    </>
  );
}

export default Recipes;
