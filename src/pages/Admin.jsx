import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth, users, userRecipes, saved, isUserChef, getUserRecipeCount } from '../context/AuthContext';

function Admin() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { email: profileEmail } = useParams();
  const [list, setList] = useState(users());

  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  // If viewing a specific user profile
  if (profileEmail) {
    const decodedEmail = decodeURIComponent(profileEmail).toLowerCase();
    const u = users().find(x => x.email.toLowerCase() === decodedEmail);
    const chefStatus = u ? isUserChef(u.email) : false;
    const count = u ? getUserRecipeCount(u.email) : 0;
    const userPublishedRecipes = u ? userRecipes().filter(r => (r.createdBy || '').toLowerCase() === u.email.toLowerCase()) : [];

    return (
      <>
        <Navbar active="admin" />
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

  function remove(email) {
    if (confirm('Delete this user and their recipes?')) {
      const next = list.filter(u => u.email !== email);
      setList(next);
      localStorage.setItem('users', JSON.stringify(next));
      const remainingRecipes = userRecipes().filter(r => (r.createdBy || '').toLowerCase() !== email.toLowerCase());
      localStorage.setItem('userRecipes', JSON.stringify(remainingRecipes));
      window.dispatchEvent(new Event('recipes-update'));
    }
  }

  const allAddedRecipes = userRecipes();

  return (
    <>
      <Navbar active="admin" />
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

export default Admin;
