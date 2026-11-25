import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

import {
  getUsers,
  saveUsers,
  getSavedRecipes,
  getCustomRecipes
} from "../utils/storage";

function Admin() {
  const { logout } = useAuth();

  const nav = useNavigate();

  const [list, setList] = useState(getUsers());

  const remove = (email) => {
    if (window.confirm("Delete this user?")) {

      const next = list.filter(
        (u) => u.email !== email
      );

      setList(next);
      saveUsers(next);
    }
  };

  const customCount = getCustomRecipes().length;

  return (
    <Layout>

      <main className="admin-page">

        <div className="admin-heading">

          <p className="small-title">
            ADMINISTRATION
          </p>

          <h2>Admin Dashboard</h2>

          <p>
            Manage users, monitor platform activity, and publish recipes.
          </p>

        </div>

        <section className="admin-stats">

          <div className="admin-card">

            <div className="admin-card-icon">👥</div>

            <h3>{list.length}</h3>

            <p>Registered Users</p>

          </div>

          <div className="admin-card">

            <div className="admin-card-icon">👨‍🍳</div>

            <h3>{list.filter(u => u.role === "chef").length}</h3>

            <p>Registered Chefs</p>

          </div>

          <div className="admin-card">

            <div className="admin-card-icon">🍲</div>

            <h3>{customCount}</h3>

            <p>Created Recipes</p>

          </div>

          <div className="admin-card">

            <div className="admin-card-icon">❤️</div>

            <h3>{getSavedRecipes().length}</h3>

            <p>Saved Recipes</p>

          </div>

        </section>

        <section className="admin-content">

          <div className="admin-panel">

            <h2>Registered Users & Chefs</h2>

            {list.length === 0 ? (

              <p className="no-users">
                No users registered yet.
              </p>

            ) : (

              list.map((u) => (

                <div
                  className="user-row"
                  key={u.email}
                >

                  <div className="user-info">

                    <div className="user-avatar">
                      {u.role === "chef" ? "👨‍🍳" : u.role === "admin" ? "👑" : "👤"}
                    </div>

                    <div>
                      <strong>
                        {u.name}{" "}
                        <span className={`role-badge role-${u.role || "user"}`}>
                          {u.role ? u.role.toUpperCase() : "USER"}
                        </span>
                      </strong>
                      <p>{u.email}</p>
                    </div>

                  </div>

                  <div className="user-actions">

                    <button
                      className="view-user"
                      onClick={() =>
                        nav(
                          "/admin/user/" +
                          encodeURIComponent(u.email)
                        )
                      }
                    >
                      View
                    </button>

                    <button
                      className="delete-user"
                      onClick={() => remove(u.email)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

          <div className="admin-panel">

            <h2>Quick Actions</h2>

            <div className="admin-actions">

              <Link
                className="admin-action"
                to="/add-recipe"
              >
                🍳 Add / Manage Recipes
              </Link>

              <Link
                className="admin-action"
                to="/"
              >
                🍴 View Website
              </Link>

              <Link
                className="admin-action"
                to="/saved"
              >
                ❤️ Saved Recipes
              </Link>

            </div>

            <button
              className="logout-button"
              onClick={() => {
                logout();
                nav("/");
              }}
            >
              Logout
            </button>

          </div>

        </section>

      </main>

    </Layout>
  );
}

export default Admin;
