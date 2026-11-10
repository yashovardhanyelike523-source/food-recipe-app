import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth, users } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email')).trim().toLowerCase();
    const password = String(f.get('password'));

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

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <div className="auth-box">
          <div className="auth-icon">🍳</div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your User Module, manage recipes & Chef status.</p>
          <form onSubmit={submit}>
            <label>Email</label>
            <input name="email" type="email" placeholder="Enter your email" required />
            <label>Password</label>
            <div className="password-box">
              <input name="password" type={show ? 'text' : 'password'} placeholder="Enter your password" required />
              <button type="button" onClick={() => setShow(!show)}>👁</button>
            </div>
            <button className="auth-button" type="submit">Sign In</button>
            {error && <p style={{ color: 'crimson', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create Account</Link>
          </p>
          <p className="auth-switch">
            <small>Admin demo: admin@foodrecipe.com / admin123</small>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;
