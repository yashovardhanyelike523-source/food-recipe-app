import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <>
      <Navbar active="about" />
      <main className="about-page">
        <section className="about-hero">
          <h2>About Food Recipe App</h2>
          <p>Discover, explore, add recipes, and earn the official Chef title!</p>
        </section>
        <section className="about-introduction">
          <h2>About Our Platform</h2>
          <p>Food Recipe App is a dynamic recipe hub designed to bring food lovers together.</p>
          <p>Users can browse recipes, explore categories, create and publish their own recipes in the <strong>User Module</strong>, and upon contributing more than 10 recipes, receive the prestigious <strong>👨‍🍳 Chef</strong> title!</p>
        </section>
        <section className="about-section">
          <h2>What You Can Do</h2>
          <div className="about-features">
            {[
              ['🍽️', 'Browse Recipes', 'Explore hundreds of recipes from different cuisines.'],
              ['📂', 'Explore Categories', 'Find dishes by food type or global area.'],
              ['➕', 'User Module & Add Recipes', 'Publish your own secret recipes with step-by-step instructions.'],
              ['👨‍🍳', 'Earn Chef Title', 'Add more than 10 recipes to get recognized as a Certified Chef!']
            ].map(x => (
              <div className="about-feature" key={x[1]}>
                <div className="about-feature-icon">{x[0]}</div>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="about-section">
          <h2>Technologies We Used</h2>
          <div className="technology-list">
            {[
              ['React', 'User Interface & State Management'],
              ['Vite', 'Ultra-fast Development and Build'],
              ['CSS', 'Modern Responsive Design'],
              ['Local Storage', 'User Auth, Recipe Storage & Chef Title State'],
              ['TheMealDB API', 'Global Recipe Database']
            ].map(x => (
              <div className="technology" key={x[0]}>
                <strong>{x[0]}</strong>
                <span>{x[1]}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default About;
