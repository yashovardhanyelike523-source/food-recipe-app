import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import Layout from "../components/Layout";

import {
  getUsers,
  saveUsers
} from "../utils/storage";

function AuthPage({ signup = false }) {
  const { login } = useContext(AuthContext);

  const nav = useNavigate();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    const name = String(f.get("name") || "").trim();

    const email = String(f.get("email"))
      .trim()
      .toLowerCase();

    const password = String(f.get("password"));

    const confirm = String(f.get("confirm") || "");

    const role = String(f.get("role") || "user").toLowerCase();

    if (signup) {
      if (name.length < 3) {
        return setError(
          "Name must contain at least 3 characters."
        );
      }

      if (password.length < 6) {
        return setError(
          "Password must contain at least 6 characters."
        );
      }

      if (password !== confirm) {
        return setError("Passwords do not match.");
      }

      if (
        email === "admin@foodrecipe.com" ||
        email === "chef@foodrecipe.com"
      ) {
        return setError(
          "This email is reserved for demo accounts."
        );
      }

      const all = getUsers();

      if (
        all.some(
          (u) => u.email.toLowerCase() === email
        )
      ) {
        return setError(
          "An account with this email already exists."
        );
      }

      all.push({
        name,
        email,
        password,
        role
      });

      saveUsers(all);

      alert(`Account created successfully as ${role === "chef" ? "Chef" : role === "admin" ? "Admin" : "User"}! Please sign in.`);

      nav("/signin");

    } else {

      if (
        email === "admin@foodrecipe.com" &&
        password === "admin123"
      ) {
        if (role !== "admin") {
          return setError("This account has the Administrator role. Please select 'Admin' in the role dropdown.");
        }

        login({
          name: "Administrator",
          email,
          role: "admin"
        });

        nav("/admin");
        return;
      }

      if (
        email === "chef@foodrecipe.com" &&
        password === "chef123"
      ) {
        if (role !== "chef") {
          return setError("This account has the Chef role. Please select 'Chef' in the role dropdown.");
        }

        login({
          name: "Chef Gordon",
          email,
          role: "chef"
        });

        nav("/add-recipe");
        return;
      }

      const all = getUsers();
      const u = all.find(
        (x) =>
          x.email.toLowerCase() === email &&
          x.password === password
      );

      if (!u) {
        return setError("Invalid email or password.");
      }

      if (u.role !== role) {
        const roleLabel = u.role === "chef" ? "Chef" : u.role === "admin" ? "Admin" : "User";
        return setError(`Role mismatch: This account is registered as a ${roleLabel}. Please select ${roleLabel} in the dropdown.`);
      }

      login(u);

      if (u.role === "admin") {
        nav("/admin");
      } else if (u.role === "chef") {
        nav("/add-recipe");
      } else {
        nav("/");
      }
    }
  }

  return (
    <Layout>

      <section className="auth-section">

        <div className="auth-box">

          <div className="auth-icon">🍳</div>

          <h2>
            {signup ? "Create Account" : "Welcome Back"}
          </h2>

          <p>
            {signup
              ? "Join Food Recipe App as a User, Chef, or Admin."
              : "Sign in to access your account."}
          </p>

          <form onSubmit={submit}>

            <label>Select Role</label>
            <select
              name="role"
              className="auth-select"
              defaultValue="user"
            >
              <option value="user">User (Browse & Save Recipes)</option>
              <option value="chef">Chef (Create & Manage Recipes)</option>
              <option value="admin">Admin (Manage Platform & Recipes)</option>
            </select>

            {signup && (
              <>
                <label>Full Name</label>

                <input
                  name="name"
                  placeholder="Enter your full name"
                  required
                />
              </>
            )}

            <label>Email</label>

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <label>Password</label>

            <div className="password-box">

              <input
                name="password"
                type={show ? "text" : "password"}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
              >
                👁
              </button>

            </div>

            {signup && (
              <>
                <label>Confirm Password</label>

                <input
                  name="confirm"
                  type={show ? "text" : "password"}
                  placeholder="Confirm your password"
                  required
                />
              </>
            )}

            <button
              className="auth-button"
              type="submit"
            >
              {signup ? "Create Account" : "Sign In"}
            </button>

            {error && (
              <p style={{ color: "crimson" }}>
                {error}
              </p>
            )}

          </form>

          <p className="auth-switch">

            {signup
              ? "Already have an account?"
              : "Don't have an account?"}

            {" "}

            <Link to={signup ? "/signin" : "/signup"}>
              {signup ? "Sign In" : "Create Account"}
            </Link>

          </p>

          {!signup && (
            <div className="auth-demo-hints">
              <p><small><strong>Admin demo:</strong> Role: Admin | admin@foodrecipe.com / admin123</small></p>
              <p><small><strong>Chef demo:</strong> Role: Chef | chef@foodrecipe.com / chef123</small></p>
            </div>
          )}

        </div>

      </section>

    </Layout>
  );
}

export default AuthPage;
