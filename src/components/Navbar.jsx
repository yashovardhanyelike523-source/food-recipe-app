import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, isUserChef } from '../context/AuthContext';

function Navbar({ active }) {
  const { user, logout } = useAuth();
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
          <Link className="signin" to="/login">Sign In</Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
