import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RecipeCard from '../components/RecipeCard';
import { useApi, userRecipes, cuisines } from '../context/AuthContext';

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

function Categories() {
  const { type, name } = useParams();

  // If viewing a specific category / cuisine
  if (type && name) {
    const n = decodeURIComponent(name);
    const area = n === 'Indian' ? 'India' : n;
    const { data, error, loading } = useApi(
      type === 'category' ? 'filter.php?c=' + encodeURIComponent(n) : 'filter.php?a=' + encodeURIComponent(area)
    );

    const allCustom = userRecipes();
    const matchedCustom = allCustom.filter(r =>
      type === 'category'
        ? r.strCategory?.toLowerCase() === n.toLowerCase()
        : r.strArea?.toLowerCase() === n.toLowerCase()
    );

    const combined = [...matchedCustom, ...(data?.meals || [])];

    return (
      <>
        <Navbar active="categories" />
        <main className="recipes">
          <Heading title={n + ' Recipes'} sub={'Explore delicious dishes in ' + n} />
          {loading && combined.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px' }}>Loading recipes...</p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '30px', color: 'crimson' }}>{error}</p>
          ) : (
            <div className="recipe-container">
              {combined.map(m => (
                <RecipeCard key={m.idMeal} meal={m} tag={n} />
              ))}
            </div>
          )}
        </main>
        <Footer />
      </>
    );
  }

  // Browse all categories
  const { data, error, loading } = useApi('categories.php');

  return (
    <>
      <Navbar active="categories" />
      <main className="categories">
        <Heading title="Explore Categories" sub="Choose a category or cuisine" />
        <h2>Food Categories</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', padding: '20px', color: 'crimson' }}>{error}</p>
        ) : (
          <div className="category-container">
            {(data?.categories || []).map(c => (
              <Link className="category" key={c.idCategory} to={'/category/category/' + encodeURIComponent(c.strCategory)}>
                <img className="category-icon" src={c.strCategoryThumb} alt={c.strCategory} />
                <h3>{c.strCategory}</h3>
              </Link>
            ))}
          </div>
        )}
        <h2>Explore by Cuisine</h2>
        <div className="category-container">
          {cuisines.map(([n, i]) => (
            <Link className="category" key={n} to={'/category/cuisine/' + n}>
              <div className="category-icon">{i}</div>
              <h3>{n}</h3>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Categories;
