import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Details from "./pages/Details";
import Saved from "./pages/Saved";
import AuthPage from "./pages/AuthPage";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import About from "./pages/About";
import AddRecipe from "./pages/AddRecipe";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/recipes" element={<Recipes />} />

          <Route path="/categories" element={<Categories />} />

          <Route
            path="/category/:type/:name"
            element={<Category />}
          />

          <Route
            path="/recipe/:id"
            element={<Details />}
          />

          <Route path="/saved" element={<Saved />} />

          <Route path="/about" element={<About />} />

          <Route
            path="/signin"
            element={<AuthPage />}
          />

          <Route
            path="/signup"
            element={<AuthPage signup />}
          />

          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute allowedRoles={["chef", "admin"]}>
                <AddRecipe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user/:email"
            element={
              <ProtectedRoute adminOnly>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;
