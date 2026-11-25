import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { users } from '../context/AuthContext';

function Signup() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email')).trim().toLowerCase();
    const password = String(f.get('password'));
    const confirm = String(f.get('confirm') || '');

    if (name.length < 3) return setError('Name must contain at least 3 characters.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (email === 'admin@foodrecipe.com') return setError('This email is reserved for the administrator.');

    const all = users();
    if (all.some(u => u.email.toLowerCase() === email)) return setError('An account with this email already exists.');

    all.push({ name, email, password, role: 'user', title: 'Member' });
    localStorage.setItem('users', JSON.stringify(all));
    alert('Account created successfully! Please sign in.');
    nav('/login');
  }

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <div className="auth-box">
          <div className="auth-icon">🍳</div>
          <h2>Create Account</h2>
          <p>Join Food Recipe App and become a community Chef!</p>
          <form onSubmit={submit}>
            <label>Full Name</label>
            <input name="name" placeholder="Enter your full name" required />
            <label>Email</label>
            <input name="email" type="email" placeholder="Enter your email" required />
            <label>Password</label>
            <div className="password-box">
              <input name="password" type={show ? 'text' : 'password'} placeholder="Enter your password" required />
              <button type="button" onClick={() => setShow(!show)}>👁</button>
            </div>
            <label>Confirm Password</label>
            <input name="confirm" type={show ? 'text' : 'password'} placeholder="Confirm your password" required />
            <button className="auth-button" type="submit">Create Account</button>
            {error && <p style={{ color: 'crimson', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Signup;
