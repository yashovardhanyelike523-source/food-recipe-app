import React, { createContext, useContext, useEffect, useState } from 'react';

export const API = 'https://www.themealdb.com/api/json/v1/1';
export const AuthContext = createContext(null);

export const users = () => JSON.parse(localStorage.getItem('users') || '[]');
export const saved = () => JSON.parse(localStorage.getItem('savedRecipes') || '[]');
export const userRecipes = () => JSON.parse(localStorage.getItem('userRecipes') || '[]');

export const cuisines = [
  ['Indian', '🍛'],
  ['Italian', '🍕'],
  ['Chinese', '🥢'],
  ['Japanese', '🍣'],
  ['Mexican', '🌮'],
  ['American', '🍔'],
  ['French', '🥐'],
  ['Thai', '🍜']
];

export const categoriesList = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 
  'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 
  'Vegan', 'Vegetarian', 'Breakfast', 'Goat'
];

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

export function saveToggle(meal) {
  let a = saved();
  a = a.some(x => x.idMeal === meal.idMeal)
    ? a.filter(x => x.idMeal !== meal.idMeal)
    : [...a, meal];
  localStorage.setItem('savedRecipes', JSON.stringify(a));
  window.dispatchEvent(new Event('saved-update'));
}

export function useApi(path) {
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

export const sampleRecipesPool = [
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

export function AuthProvider({ children }) {
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
    <AuthContext.Provider value={{ user, login, logout, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
