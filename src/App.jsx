import React, { createContext, useContext, useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';

const API = 'https://www.themealdb.com/api/json/v1/1';
const Auth = createContext(null);

const users = () => JSON.parse(localStorage.getItem('users') || '[]');
const saved = () => JSON.parse(localStorage.getItem('savedRecipes') || '[]');
const userRecipes = () => JSON.parse(localStorage.getItem('userRecipes') || '[]');

const cuisines = [
  ['Indian', '🍛'],
  ['Italian', '🍕'],
  ['Chinese', '🥢'],
  ['Japanese', '🍣'],
  ['Mexican', '🌮'],
  ['American', '🍔'],
  ['French', '🥐'],
  ['Thai', '🍜']
];

const categoriesList = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 
  'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 
  'Vegan', 'Vegetarian', 'Breakfast', 'Goat'
];

// Helper functions for recipes and Chef title
export const getUserRecipeCount = (email) => {
  if (!email) return 0;
  return userRecipes().filter(r => (r.createdBy || '').toLowerCase() === email.toLowerCase()).length;
};

export const isUserChef = (email) => {
  return getUserRecipeCount(email) > 10;
};

export const getUserTitle = (email) => {
  return isUserChef(email) ? 'Chef' : 'Member';
};

// Sample recipes for instant testing
const sampleRecipesPool = [
  {
    strMeal: 'Classic Butter Chicken',
    strCategory: 'Chicken',
    strArea: 'Indian',
    strMealThumb: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Marinate chicken in yogurt and spices for 30 minutes.\n2. Sear chicken pieces in butter until golden.\n3. Prepare rich tomato and cream gravy with garam masala.\n4. Simmer chicken in sauce for 15 minutes and garnish with fresh coriander.',
    ingredients: [
      { ingredient: 'Chicken Breast', measure: '500g' },
      { ingredient: 'Butter', measure: '50g' },
      { ingredient: 'Tomato Puree', measure: '1 cup' },
      { ingredient: 'Heavy Cream', measure: '100ml' },
      { ingredient: 'Garam Masala', measure: '1 tbsp' }
    ]
  },
  {
    strMeal: 'Authentic Italian Margherita Pizza',
    strCategory: 'Vegetarian',
    strArea: 'Italian',
    strMealThumb: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Roll out fresh fermented pizza dough.\n2. Spread San Marzano tomato sauce evenly.\n3. Top with fresh mozzarella chunks and fresh basil leaves.\n4. Bake at maximum oven temperature until crust is bubbly and crisp.',
    ingredients: [
      { ingredient: 'Pizza Dough', measure: '1 ball' },
      { ingredient: 'San Marzano Tomatoes', measure: '150g' },
      { ingredient: 'Fresh Mozzarella', measure: '150g' },
      { ingredient: 'Fresh Basil', measure: 'Handful' },
      { ingredient: 'Extra Virgin Olive Oil', measure: '1 tbsp' }
    ]
  },
  {
    strMeal: 'Japanese Vegetable Tempura',
    strCategory: 'Vegetarian',
    strArea: 'Japanese',
    strMealThumb: 'https://images.unsplash.com/photo-1581184953963-d15972933db4?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Slice sweet potato, bell peppers, and zucchini.\n2. Whisk cold water with tempura flour lightly (keep lumpy).\n3. Dip vegetables and fry in hot vegetable oil at 180°C.\n4. Serve immediately with tentsuyu dipping sauce.',
    ingredients: [
      { ingredient: 'Assorted Vegetables', measure: '300g' },
      { ingredient: 'Tempura Flour', measure: '1 cup' },
      { ingredient: 'Ice Cold Water', measure: '1 cup' },
      { ingredient: 'Dipping Sauce', measure: '50ml' }
    ]
  },
  {
    strMeal: 'Creamy Garlic Mushroom Fettuccine',
    strCategory: 'Pasta',
    strArea: 'Italian',
    strMealThumb: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Boil fettuccine in salted water until al dente.\n2. Sauté sliced cremini mushrooms and minced garlic in olive oil.\n3. Pour in heavy cream and grated parmesan cheese.\n4. Toss pasta with the velvety sauce and season with cracked black pepper.',
    ingredients: [
      { ingredient: 'Fettuccine', measure: '250g' },
      { ingredient: 'Cremini Mushrooms', measure: '200g' },
      { ingredient: 'Garlic cloves', measure: '4 minced' },
      { ingredient: 'Heavy Cream', measure: '1 cup' },
      { ingredient: 'Parmesan Cheese', measure: '50g' }
    ]
  },
  {
    strMeal: 'Spicy Mexican Street Tacos',
    strCategory: 'Beef',
    strArea: 'Mexican',
    strMealThumb: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Season flank steak with cumin, chili powder, lime, and garlic.\n2. Grill on high heat until charred, then dice finely.\n3. Warm corn tortillas on a dry skillet.\n4. Assemble tacos with steak, chopped white onions, cilantro, and salsa verde.',
    ingredients: [
      { ingredient: 'Corn Tortillas', measure: '8 small' },
      { ingredient: 'Flank Steak', measure: '400g' },
      { ingredient: 'White Onion', measure: '1 finely chopped' },
      { ingredient: 'Cilantro', measure: '1 bunch' },
      { ingredient: 'Lime', measure: '2 whole' }
    ]
  },
  {
    strMeal: 'Szechuan Kung Pao Chicken',
    strCategory: 'Chicken',
    strArea: 'Chinese',
    strMealThumb: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Marinate diced chicken with soy sauce and cornstarch.\n2. Stir-fry dried red chilies and Szechuan peppercorns in wok.\n3. Add chicken and stir-fry until cooked through.\n4. Toss with roasted peanuts, scallions, and sweet-tangy Kung Pao sauce.',
    ingredients: [
      { ingredient: 'Chicken Thighs', measure: '400g' },
      { ingredient: 'Roasted Peanuts', measure: '1/2 cup' },
      { ingredient: 'Dried Red Chilies', measure: '8 pieces' },
      { ingredient: 'Soy Sauce', measure: '2 tbsp' },
      { ingredient: 'Scallions', measure: '3 stalks' }
    ]
  },
  {
    strMeal: 'French Homestyle Beef Bourguignon',
    strCategory: 'Beef',
    strArea: 'French',
    strMealThumb: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Brown stewing beef cubes in bacon fat.\n2. Add carrots, onions, garlic, tomato paste, and red wine.\n3. Simmer slowly for 2.5 hours until fork-tender.\n4. Stir in browned pearl onions and sautéed mushrooms.',
    ingredients: [
      { ingredient: 'Beef Chuck', measure: '700g' },
      { ingredient: 'Red Wine', measure: '2 cups' },
      { ingredient: 'Beef Broth', measure: '2 cups' },
      { ingredient: 'Carrots', measure: '3 sliced' },
      { ingredient: 'Pearl Onions', measure: '1 cup' }
    ]
  },
  {
    strMeal: 'Thai Coconut Red Curry',
    strCategory: 'Chicken',
    strArea: 'Thai',
    strMealThumb: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Fry Thai red curry paste in coconut cream until fragrant oil separates.\n2. Add sliced chicken and cook until opaque.\n3. Pour in coconut milk, bamboo shoots, and kaffir lime leaves.\n4. Finish with fish sauce, palm sugar, and Thai holy basil.',
    ingredients: [
      { ingredient: 'Red Curry Paste', measure: '3 tbsp' },
      { ingredient: 'Coconut Milk', measure: '400ml' },
      { ingredient: 'Chicken Breast', measure: '350g' },
      { ingredient: 'Thai Basil', measure: '1 cup' },
      { ingredient: 'Bamboo Shoots', measure: '1/2 cup' }
    ]
  },
  {
    strMeal: 'Crispy Falafel Pita Pocket',
    strCategory: 'Vegetarian',
    strArea: 'Mediterranean',
    strMealThumb: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Soak dried chickpeas overnight, then grind with fresh herbs, garlic, and cumin.\n2. Form into small patties and deep fry until dark golden brown.\n3. Warm pita bread pockets and spread with garlic tahini.\n4. Stuff with hot falafels, diced cucumber, tomatoes, and pickled turnips.',
    ingredients: [
      { ingredient: 'Dried Chickpeas', measure: '250g' },
      { ingredient: 'Fresh Parsley & Coriander', measure: '1 cup' },
      { ingredient: 'Tahini Sauce', measure: '4 tbsp' },
      { ingredient: 'Pita Bread', measure: '4 pockets' }
    ]
  },
  {
    strMeal: 'Decadent Chocolate Lava Cake',
    strCategory: 'Dessert',
    strArea: 'French',
    strMealThumb: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Melt dark chocolate and butter together gently.\n2. Whisk eggs and sugar until pale, then fold into chocolate.\n3. Dust ramekins with cocoa powder and pour batter.\n4. Bake at 200°C for exactly 12 minutes until edges are firm and center is molten.',
    ingredients: [
      { ingredient: 'Dark Chocolate (70%)', measure: '150g' },
      { ingredient: 'Butter', measure: '100g' },
      { ingredient: 'Eggs', measure: '3 whole' },
      { ingredient: 'Caster Sugar', measure: '80g' },
      { ingredient: 'All-Purpose Flour', measure: '30g' }
    ]
  },
  {
    strMeal: 'Savory Spanish Seafood Paella',
    strCategory: 'Seafood',
    strArea: 'Spanish',
    strMealThumb: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Sauté calamari and jumbo shrimp in a traditional paella pan.\n2. Build a rich sofrito with tomatoes, onions, garlic, and sweet paprika.\n3. Add Bomba rice and saffron-infused seafood stock.\n4. Cook undisturbed to develop the crispy bottom layer (socarrat).',
    ingredients: [
      { ingredient: 'Bomba Rice', measure: '300g' },
      { ingredient: 'Jumbo Shrimp & Mussels', measure: '350g' },
      { ingredient: 'Saffron Threads', measure: '1 pinch' },
      { ingredient: 'Seafood Broth', measure: '700ml' },
      { ingredient: 'Sweet Paprika', measure: '1 tsp' }
    ]
  },
  {
    strMeal: 'Traditional American Blueberry Pancakes',
    strCategory: 'Breakfast',
    strArea: 'American',
    strMealThumb: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
    strInstructions: '1. Whisk buttermilk, melted butter, egg, flour, and baking powder.\n2. Pour ladlefuls on a hot buttered griddle.\n3. Scatter fresh plump blueberries over the wet batter.\n4. Flip when bubbles break on top, and serve warm with pure maple syrup.',
    ingredients: [
      { ingredient: 'All-Purpose Flour', measure: '2 cups' },
      { ingredient: 'Buttermilk', measure: '1.5 cups' },
      { ingredient: 'Fresh Blueberries', measure: '1 cup' },
      { ingredient: 'Maple Syrup', measure: 'To serve' }
    ]
  }
];

function App() {
  const [user, setUser] = useState(() => {
    const u = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (u) {
      u.title = getUserTitle(u.email);
    }
    return u;
  });

  const syncUser = () => {
    const u = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (u) {
      u.title = getUserTitle(u.email);
      setUser({ ...u });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    window.addEventListener('user-update', syncUser);
    window.addEventListener('recipes-update', syncUser);
    return () => {
      window.removeEventListener('user-update', syncUser);
      window.removeEventListener('recipes-update', syncUser);
    };
  }, []);

  const login = (u) => {
    const updated = { ...u, title: getUserTitle(u.email) };
    localStorage.setItem('loggedInUser', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  return (
    <Auth.Provider value={{ user, login, logout, syncUser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:type/:name" element={<Category />} />
        <Route path="/recipe/:id" element={<Details />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage signup />} />
        {/* User Module routes */}
        <Route path="/user" element={<UserModule initialTab="recipes" />} />
        <Route path="/my-recipes" element={<UserModule initialTab="recipes" />} />
        <Route path="/add-recipe" element={<UserModule initialTab="add" />} />
        <Route path="/profile" element={<UserModule initialTab="recipes" />} />
        {/* Admin routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user/:email" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Auth.Provider>
  );
}

function Header({ active }) {
  const { user, logout } = useContext(Auth);
  const isChef = user ? isUserChef(user.email) : false;

  return (
    <header>
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🍳</span>
          <h1>Food Recipe App</h1>
        </Link>
      </div>
      <nav>
        <Link className={active === 'home' ? 'active' : ''} to="/">Home</Link>
        <Link className={active === 'recipes' ? 'active' : ''} to="/recipes">Recipes</Link>
        <Link className={active === 'categories' ? 'active' : ''} to="/categories">Categories</Link>
        <Link className={active === 'saved' ? 'active' : ''} to="/saved">Saved Recipes</Link>
        {user && (
          <>
            <Link className={active === 'user' ? 'active' : ''} to="/user">User Module</Link>
            <Link className={active === 'add-recipe' ? 'active' : ''} to="/add-recipe">+ Add Recipe</Link>
          </>
        )}
        <Link className={active === 'about' ? 'active' : ''} to="/about">About</Link>
        {user?.role === 'admin' && <Link className={active === 'admin' ? 'active' : ''} to="/admin">Admin</Link>}
      </nav>
      <div className="user-area">
        {user ? (
          <>
            <Link to="/user" className="header-user-profile" title="Open User Module & Profile">
              <span className="welcome-user">
                Hi, {user.name}
              </span>
              {isChef && <span className="chef-badge-pill">👨‍🍳 Chef</span>}
            </Link>
            <button className="logout-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link className="signin" to="/signin">Sign In</Link>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <p>Food Recipe App • Discover, Cook & Share Amazing Recipes</p>
    </footer>
  );
}

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

function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }
    let live = true;
    setLoading(true);
    fetch(API + '/' + path)
      .then(r => r.json())
      .then(d => live && setData(d))
      .catch(() => live && setError('Unable to load data. Check your internet connection.'))
      .finally(() => live && setLoading(false));
    return () => { live = false; };
  }, [path]);

  return { data, error, loading };
}

function saveToggle(meal) {
  let a = saved();
  a = a.some(x => x.idMeal === meal.idMeal)
    ? a.filter(x => x.idMeal !== meal.idMeal)
    : [...a, meal];
  localStorage.setItem('savedRecipes', JSON.stringify(a));
  window.dispatchEvent(new Event('saved-update'));
}

function Card({ meal, tag = 'Recipe' }) {
  const isSaved = saved().some(x => x.idMeal === meal.idMeal);
  const isChefMeal = meal.createdBy ? isUserChef(meal.createdBy) : false;

  return (
    <div className="recipe-card">
      <div className="recipe-image">
        <img
          src={meal.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'}
          alt={meal.strMeal}
        />
        <button className="heart" onClick={() => saveToggle(meal)} title={isSaved ? 'Remove from saved' : 'Save recipe'}>
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

function Grid({ data, loading, error, tag }) {
  if (loading) return <p style={{ textAlign: 'center', padding: '30px' }}>Loading recipes...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '30px', color: 'crimson' }}>{error}</p>;
  const meals = data?.meals || [];
  return meals.length ? (
    <div className="recipe-container">
      {meals.map(m => <Card key={m.idMeal} meal={m} tag={tag} />)}
    </div>
  ) : (
    <p style={{ textAlign: 'center', padding: '30px' }}>No recipes found.</p>
  );
}

function Home() {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const { data, error, loading } = useApi('search.php?s=' + encodeURIComponent(search));

  // Combine with user recipes matching query
  const allCustom = userRecipes();
  const matchedCustom = search.trim()
    ? allCustom.filter(r => r.strMeal?.toLowerCase().includes(search.toLowerCase()))
    : allCustom.slice(0, 4);

  const combined = [...matchedCustom, ...(data?.meals || [])].slice(0, 12);

  return (
    <>
      <Header active="home" />
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
        <Grid data={{ meals: combined }} loading={loading && combined.length === 0} error={error} />
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
      <Header active="recipes" />
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
        <Grid data={{ meals: combined }} error={error} loading={loading && combined.length === 0} />
      </main>
      <Footer />
    </>
  );
}

function Categories() {
  const { data, error, loading } = useApi('categories.php');
  return (
    <>
      <Header active="categories" />
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

function Category() {
  const { type, name } = useParams();
  const n = decodeURIComponent(name);
  const area = n === 'Indian' ? 'India' : n;
  const { data, error, loading } = useApi(
    type === 'category' ? 'filter.php?c=' + encodeURIComponent(n) : 'filter.php?a=' + encodeURIComponent(area)
  );

  // Also include user recipes matching category/cuisine
  const allCustom = userRecipes();
  const matchedCustom = allCustom.filter(r =>
    type === 'category'
      ? r.strCategory?.toLowerCase() === n.toLowerCase()
      : r.strArea?.toLowerCase() === n.toLowerCase()
  );

  const combined = [...matchedCustom, ...(data?.meals || [])];

  return (
    <>
      <Header active="categories" />
      <main className="recipes">
        <Heading title={n + ' Recipes'} sub={'Explore delicious dishes in ' + n} />
        <Grid data={{ meals: combined }} loading={loading && combined.length === 0} error={error} tag={n} />
      </main>
      <Footer />
    </>
  );
}

function Details() {
  const { id } = useParams();
  const customMeal = userRecipes().find(r => r.idMeal === id);
  const { data, error, loading } = useApi(customMeal ? '' : 'lookup.php?i=' + id);
  const m = customMeal || data?.meals?.[0];

  if (!customMeal && loading) return <><Header /><p style={{ textAlign: 'center', padding: '50px' }}>Loading recipe...</p></>;
  if (!m) return <><Header /><p style={{ textAlign: 'center', padding: '50px' }}>{error || 'Recipe not found.'}</p></>;

  const isAuthorChef = m.createdBy ? isUserChef(m.createdBy) : false;

  // Extract ingredients
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
      <Header />
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

function Saved() {
  const [list, setList] = useState(saved());

  useEffect(() => {
    const f = () => setList(saved());
    window.addEventListener('saved-update', f);
    return () => window.removeEventListener('saved-update', f);
  }, []);

  return (
    <>
      <Header active="saved" />
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

/* ==========================================================================
   USER MODULE & ADD RECIPE
   ========================================================================== */

function UserModule({ initialTab = 'recipes' }) {
  const { user, syncUser } = useContext(Auth);
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

  // Sync recipes list for this user
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
    return <Navigate to="/signin" />;
  }

  const recipeCount = myRecipesList.length;
  const isChef = recipeCount > 10;
  const neededForChef = Math.max(0, 11 - recipeCount);
  const progressPercent = Math.min(100, Math.round((recipeCount / 11) * 100));

  // Handle single recipe creation
  const handleAddRecipe = (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) return setFormError('Recipe name is required.');
    if (!instructions.trim()) return setFormError('Cooking instructions are required.');

    // Parse ingredients from lines
    const parsedIngredients = ingredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        // e.g. "2 cups Basmati Rice" or "Basmati Rice - 2 cups" or "Basmati Rice"
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

    // Calculate new count
    const newCount = updated.filter(r => (r.createdBy || '').toLowerCase() === user.email.toLowerCase()).length;
    const nowChef = newCount > 10;

    // Update in users registry
    const allUsers = users().map(u => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, title: nowChef ? 'Chef' : 'Member' };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(allUsers));

    // Update current session
    const logged = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    logged.title = nowChef ? 'Chef' : 'Member';
    localStorage.setItem('loggedInUser', JSON.stringify(logged));

    window.dispatchEvent(new Event('recipes-update'));
    window.dispatchEvent(new Event('user-update'));
    if (syncUser) syncUser();
    refreshUserRecipes();

    // Reset Form
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

  // Helper to load sample data into the form
  const fillSample = () => {
    const random = sampleRecipesPool[Math.floor(Math.random() * sampleRecipesPool.length)];
    setName(random.strMeal);
    setCategory(random.strCategory);
    setArea(random.strArea);
    setThumb(random.strMealThumb);
    setInstructions(random.strInstructions);
    setIngredientsText(random.ingredients.map(i => `${i.ingredient} - ${i.measure}`).join('\n'));
    setSuccessMessage('Sample recipe loaded into form! You can review and click "Create Recipe".');
  };

  // Quick Action: Add 11 Sample Recipes immediately to test Chef title threshold (> 10 recipes)
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

    // Update Chef title in registered users & session
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

  // Delete a recipe added by this user
  const handleDeleteRecipe = (idMeal, mealName) => {
    if (!window.confirm(`Are you sure you want to delete "${mealName}"?`)) return;

    const all = userRecipes();
    const updated = all.filter(r => r.idMeal !== idMeal);
    localStorage.setItem('userRecipes', JSON.stringify(updated));

    // Check chef status again
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
      <Header active={activeTab === 'add' ? 'add-recipe' : 'user'} />
      <main className="user-module-page">
        {/* User Hero Banner */}
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

          {/* Chef Status Card & Progress */}
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

        {/* Celebratory Alert Banner if Chef status awarded */}
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

        {/* Flash message */}
        {successMessage && !chefCelebration && (
          <div className="flash-alert success">
            <span>✓ {successMessage}</span>
            <button onClick={() => setSuccessMessage('')}>✕</button>
          </div>
        )}

        {/* Tab Navigation */}
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

        {/* TAB 1: ADD RECIPE FORM */}
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

        {/* TAB 2: MY RECIPES LIST */}
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

/* ==========================================================================
   AUTH, ADMIN, PROFILE & ABOUT PAGES
   ========================================================================== */

function AuthPage({ signup = false }) {
  const { login } = useContext(Auth);
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email')).trim().toLowerCase();
    const password = String(f.get('password'));
    const confirm = String(f.get('confirm') || '');

    if (signup) {
      if (name.length < 3) return setError('Name must contain at least 3 characters.');
      if (password.length < 6) return setError('Password must contain at least 6 characters.');
      if (password !== confirm) return setError('Passwords do not match.');
      if (email === 'admin@foodrecipe.com') return setError('This email is reserved for the administrator.');
      const all = users();
      if (all.some(u => u.email.toLowerCase() === email)) return setError('An account with this email already exists.');
      all.push({ name, email, password, role: 'user', title: 'Member' });
      localStorage.setItem('users', JSON.stringify(all));
      alert('Account created successfully! Please sign in.');
      nav('/signin');
    } else {
      if (email === 'admin@foodrecipe.com' && password === 'admin123') {
        login({ name: 'Administrator', email, role: 'admin', title: 'Admin' });
        nav('/admin');
        return;
      }
      const u = users().find(x => x.email.toLowerCase() === email && x.password === password);
      if (!u) return setError('Invalid email or password.');
      login(u);
      nav('/user');
    }
  }

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-box">
          <div className="auth-icon">🍳</div>
          <h2>{signup ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{signup ? 'Join Food Recipe App and become a community Chef!' : 'Sign in to access your User Module & Recipes.'}</p>
          <form onSubmit={submit}>
            {signup && (
              <>
                <label>Full Name</label>
                <input name="name" placeholder="Enter your full name" required />
              </>
            )}
            <label>Email</label>
            <input name="email" type="email" placeholder="Enter your email" required />
            <label>Password</label>
            <div className="password-box">
              <input name="password" type={show ? 'text' : 'password'} placeholder="Enter your password" required />
              <button type="button" onClick={() => setShow(!show)}>👁</button>
            </div>
            {signup && (
              <>
                <label>Confirm Password</label>
                <input name="confirm" type={show ? 'text' : 'password'} placeholder="Confirm your password" required />
              </>
            )}
            <button className="auth-button" type="submit">{signup ? 'Create Account' : 'Sign In'}</button>
            {error && <p style={{ color: 'crimson', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
          </form>
          <p className="auth-switch">
            {signup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link to={signup ? '/signin' : '/signup'}>{signup ? 'Sign In' : 'Create Account'}</Link>
          </p>
          {!signup && (
            <p className="auth-switch">
              <small>Admin demo: admin@foodrecipe.com / admin123</small>
            </p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

function Admin() {
  const { user, logout } = useContext(Auth);
  const nav = useNavigate();
  const [list, setList] = useState(users());

  if (!user || user.role !== 'admin') return <Navigate to="/signin" />;

  function remove(email) {
    if (confirm('Delete this user and their recipes?')) {
      const next = list.filter(u => u.email !== email);
      setList(next);
      localStorage.setItem('users', JSON.stringify(next));
      // Remove their recipes
      const remainingRecipes = userRecipes().filter(r => (r.createdBy || '').toLowerCase() !== email.toLowerCase());
      localStorage.setItem('userRecipes', JSON.stringify(remainingRecipes));
      window.dispatchEvent(new Event('recipes-update'));
    }
  }

  const allAddedRecipes = userRecipes();

  return (
    <>
      <Header active="admin" />
      <main className="admin-page">
        <div className="admin-heading">
          <p className="small-title">ADMINISTRATION</p>
          <h2>Admin Dashboard</h2>
          <p>Manage registered users, monitor recipes created, and verify Chef titles.</p>
        </div>
        <section className="admin-stats">
          <div className="admin-card">
            <div className="admin-card-icon">👥</div>
            <h3>{list.length}</h3>
            <p>Registered Users</p>
          </div>
          <div className="admin-card">
            <div className="admin-card-icon">🍲</div>
            <h3>{allAddedRecipes.length}</h3>
            <p>User-Added Recipes</p>
          </div>
          <div className="admin-card">
            <div className="admin-card-icon">👨‍🍳</div>
            <h3>{list.filter(u => isUserChef(u.email)).length}</h3>
            <p>Certified Chefs (&gt; 10 Recipes)</p>
          </div>
          <div className="admin-card">
            <div className="admin-card-icon">❤️</div>
            <h3>{saved().length}</h3>
            <p>Saved Recipes</p>
          </div>
        </section>
        <section className="admin-content">
          <div className="admin-panel">
            <h2>Registered Users</h2>
            {list.length === 0 ? (
              <p className="no-users">No users registered yet.</p>
            ) : (
              list.map(u => {
                const chefStatus = isUserChef(u.email);
                const count = getUserRecipeCount(u.email);
                return (
                  <div className="user-row" key={u.email}>
                    <div className="user-info">
                      <div className="user-avatar">{chefStatus ? '👨‍🍳' : '👤'}</div>
                      <div>
                        <strong>
                          {u.name} {chefStatus && <span className="chef-badge-pill">👨‍🍳 Chef</span>}
                        </strong>
                        <p>{u.email} • {count} recipes added</p>
                      </div>
                    </div>
                    <div className="user-actions">
                      <button className="view-user" onClick={() => nav('/admin/user/' + encodeURIComponent(u.email))}>
                        View Profile
                      </button>
                      <button className="delete-user" onClick={() => remove(u.email)}>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="admin-panel">
            <h2>Quick Actions</h2>
            <div className="admin-actions">
              <Link className="admin-action" to="/">🍴 View Website</Link>
              <Link className="admin-action" to="/recipes">📖 Browse Recipes</Link>
              <Link className="admin-action" to="/saved">❤️ Saved Recipes</Link>
            </div>
            <button className="logout-button" style={{ marginTop: '20px', width: '100%' }} onClick={() => { logout(); nav('/'); }}>
              Logout
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Profile() {
  const { email } = useParams();
  const { user } = useContext(Auth);
  const u = users().find(x => x.email.toLowerCase() === decodeURIComponent(email).toLowerCase());

  if (!user || user.role !== 'admin') return <Navigate to="/signin" />;

  const chefStatus = u ? isUserChef(u.email) : false;
  const count = u ? getUserRecipeCount(u.email) : 0;
  const userPublishedRecipes = u ? userRecipes().filter(r => (r.createdBy || '').toLowerCase() === u.email.toLowerCase()) : [];

  return (
    <>
      <Header />
      <main className="profile-page">
        <div className="profile-card">
          <Link className="back-dashboard" to="/admin">← Back to Dashboard</Link>
          {u ? (
            <>
              <div className="profile-header">
                <div className="profile-avatar">{chefStatus ? '👨‍🍳' : '👤'}</div>
                <p className="small-title">USER PROFILE</p>
                <h2>{chefStatus ? `Chef ${u.name}` : u.name}</h2>
                <p>{chefStatus ? '⭐ Certified Chef (> 10 Recipes Added)' : 'Food Recipe App Member'}</p>
              </div>
              <div className="profile-details">
                <div className="profile-detail">
                  <span>👤</span>
                  <div><small>Full Name</small><strong>{u.name}</strong></div>
                </div>
                <div className="profile-detail">
                  <span>📧</span>
                  <div><small>Email Address</small><strong>{u.email}</strong></div>
                </div>
                <div className="profile-detail">
                  <span>👨‍🍳</span>
                  <div>
                    <small>Chef Title & Status</small>
                    <strong>
                      {chefStatus ? (
                        <span style={{ color: '#2e7d32' }}>👨‍🍳 Certified Chef Title Earned ({count} recipes)</span>
                      ) : (
                        <span>Member / Home Cook ({count} recipes added, needs {Math.max(0, 11 - count)} more for Chef title)</span>
                      )}
                    </strong>
                  </div>
                </div>
                <div className="profile-detail">
                  <span>🛡️</span>
                  <div><small>Account Role</small><strong>{u.role || 'user'}</strong></div>
                </div>
              </div>

              {/* Recipes published by this user */}
              <div className="profile-saved">
                <h2>Recipes Created by {u.name} ({userPublishedRecipes.length})</h2>
                <p>Culinary contributions from this user.</p>
                {userPublishedRecipes.length ? (
                  <div className="profile-recipe-grid">
                    {userPublishedRecipes.map(r => (
                      <div className="profile-recipe-card" key={r.idMeal}>
                        <img src={r.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'} alt={r.strMeal} />
                        <div className="profile-recipe-content">
                          <h3>{r.strMeal}</h3>
                          <p>{r.strCategory} • {r.strArea}</p>
                          <Link to={'/recipe/' + r.idMeal} className="view-recipe" style={{ fontSize: '13px', padding: '6px 12px' }}>
                            View Recipe
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888' }}>This user has not created any recipes yet.</p>
                )}
              </div>
            </>
          ) : (
            <p>User not found.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function About() {
  return (
    <>
      <Header active="about" />
      <main className="about-page">
        <section className="about-hero">
          <h2>About Food Recipe App</h2>
          <p>Discover, explore, add recipes, and earn the official Chef title!</p>
        </section>
        <section className="about-introduction">
          <h2>About Our Platform</h2>
          <p>Food Recipe App is a dynamic recipe hub designed to bring food lovers together.</p>
          <p>Users can browse recipes, explore categories, create and publish their own recipes in the <strong>User Module</strong>, and upon contributing more than 10 recipes, receive the prestigious <strong>👨‍🍳 Chef</strong> title!</p>
        </section>
        <section className="about-section">
          <h2>What You Can Do</h2>
          <div className="about-features">
            {[
              ['🍽️', 'Browse Recipes', 'Explore hundreds of recipes from different cuisines.'],
              ['📂', 'Explore Categories', 'Find dishes by food type or global area.'],
              ['➕', 'User Module & Add Recipes', 'Publish your own secret recipes with step-by-step instructions.'],
              ['👨‍🍳', 'Earn Chef Title', 'Add more than 10 recipes to get recognized as a Certified Chef!']
            ].map(x => (
              <div className="about-feature" key={x[1]}>
                <div className="about-feature-icon">{x[0]}</div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="about-section">
          <h2>Technologies We Used</h2>
          <div className="technology-list">
            {[
              ['React', 'User Interface & State Management'],
              ['Vite', 'Ultra-fast Development and Build'],
              ['CSS', 'Modern Responsive Design'],
              ['Local Storage', 'User Auth, Recipe Storage & Chef Title State'],
              ['TheMealDB API', 'Global Recipe Database']
            ].map(x => (
              <div className="technology" key={x[0]}>
                <strong>{x[0]}</strong>
                <span>{x[1]}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
