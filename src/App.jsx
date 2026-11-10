import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Pages as requested in the modular structure
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import User from './pages/User';
import Recipes from './pages/Recipes';
import Details from './pages/Details';
import Categories from './pages/Categories';
import Saved from './pages/Saved';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:type/:name" element={<Categories />} />
        <Route path="/recipe/:id" element={<Details />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/about" element={<About />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Module & Profile Pages */}
        <Route path="/user" element={<User initialTab="recipes" />} />
        <Route path="/my-recipes" element={<User initialTab="recipes" />} />
        <Route path="/add-recipe" element={<User initialTab="add" />} />
        <Route path="/profile" element={<User initialTab="recipes" />} />

        {/* Administration Pages */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user/:email" element={<Admin />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
