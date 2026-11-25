// Get registered users
export const getUsers = () => {
  try {
    const items = JSON.parse(
      localStorage.getItem('users') || '[]'
    );
    return Array.isArray(items) ? items.filter(Boolean) : [];
  } catch {
    return [];
  }
};

// Save registered users
export const saveUsers = (users) => {
  localStorage.setItem(
    'users',
    JSON.stringify(users)
  );
};

// Get saved recipes
export const getSavedRecipes = () => {
  try {
    const items = JSON.parse(
      localStorage.getItem('savedRecipes') || '[]'
    );
    return Array.isArray(items) ? items.filter(Boolean) : [];
  } catch {
    return [];
  }
};

// Save recipes
export const saveRecipes = (recipes) => {
  localStorage.setItem(
    'savedRecipes',
    JSON.stringify(recipes)
  );

  window.dispatchEvent(new Event('saved-update'));
};

// Get chef & admin created recipes
export const getCustomRecipes = () => {
  try {
    const items = JSON.parse(
      localStorage.getItem('customRecipes') || '[]'
    );
    return Array.isArray(items) ? items.filter(Boolean) : [];
  } catch {
    return [];
  }
};

// Save custom recipes
export const saveCustomRecipes = (recipes) => {
  localStorage.setItem(
    'customRecipes',
    JSON.stringify(recipes)
  );

  window.dispatchEvent(new Event('custom-recipes-update'));
};

// Get currently logged-in user
export const getLoggedInUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem('loggedInUser') || 'null'
    );
  } catch {
    return null;
  }
};

// Save logged-in user
export const setLoggedInUser = (user) => {
  localStorage.setItem(
    'loggedInUser',
    JSON.stringify(user)
  );
};

// Remove logged-in user
export const removeLoggedInUser = () => {
  localStorage.removeItem('loggedInUser');
};
