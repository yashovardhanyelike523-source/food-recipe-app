import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const path = location.pathname;

  const active =
    path === "/" ? "home" :
    path === "/recipes" ? "recipes" :
    path === "/categories" ||
    path.startsWith("/category/") ? "categories" :
    path === "/saved" ? "saved" :
    path === "/about" ? "about" :
    path.startsWith("/admin") ? "admin" :
    path.startsWith("/add-recipe") ? "add-recipe" : "";

  const roleLabel =
    user?.role === "admin" ? "Admin" :
    user?.role === "chef" ? "Chef" : "User";

  return (
    <header>
      <div className="logo">
        <span>🍳</span>
        <h1>Food Recipe App</h1>
      </div>

      <nav>
        <Link className={active === "home" ? "active" : ""} to="/">
          Home
        </Link>

        <Link className={active === "recipes" ? "active" : ""} to="/recipes">
          Recipes
        </Link>

        <Link className={active === "categories" ? "active" : ""} to="/categories">
          Categories
        </Link>

        <Link className={active === "saved" ? "active" : ""} to="/saved">
          Saved Recipes
        </Link>

        <Link className={active === "about" ? "active" : ""} to="/about">
          About
        </Link>

        {(user?.role === "chef" || user?.role === "admin") && (
          <Link
            className={active === "add-recipe" ? "active" : ""}
            to="/add-recipe"
          >
            {user?.role === "chef" ? "Chef Studio" : "+ Add Recipe"}
          </Link>
        )}

        {user?.role === "admin" && (
          <Link className={active === "admin" ? "active" : ""} to="/admin">
            Admin
          </Link>
        )}
      </nav>

      <div className="user-area">
        {user ? (
          <>
            <span className="welcome-user">
              Hi, {user.name} <span className="role-badge">{roleLabel}</span>
            </span>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link className="signin" to="/signin">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
