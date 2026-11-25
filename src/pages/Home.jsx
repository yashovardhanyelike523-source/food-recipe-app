import { useState } from "react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import Heading from "../components/Heading";
import RecipeGrid from "../components/RecipeGrid";

import useApi from "../hooks/useApi";
import cuisines from "../data/cuisines";
import { getCustomRecipes } from "../utils/storage";

function Home() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");

  const { data, error, loading } = useApi(
    "search.php?s=" + encodeURIComponent(search)
  );

  return (
    <Layout>

      <section className="hero">
        <div className="hero-content">

          <p className="small-title">
            GOOD FOOD, A BETTER YOU
          </p>

          <h2>
            Discover Delicious
            <br />
            Recipes from Around the World
          </h2>

          <p className="hero-text">
            Explore, cook, and enjoy recipes from different
            cultures. Find your next favorite dish today!
          </p>

          <div className="search-box">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && setSearch(q)
              }
              placeholder="Search for a recipe, cuisine or ingredient..."
            />

            <button onClick={() => setSearch(q)}>
              Search
            </button>
          </div>

        </div>
      </section>

      <section className="categories">

        <Heading
          title="Explore by Cuisine"
          sub="Discover recipes from different parts of the world"
        />

        <div className="category-container">

          {cuisines.map(([name, icon]) => (
            <Link
              className="category"
              to={"/category/cuisine/" + name}
              key={name}
            >
              <div className="category-icon">
                {icon}
              </div>

              <h3>{name}</h3>
            </Link>
          ))}

        </div>
      </section>

      <section className="recipes">

        <Heading
          title="Popular Recipes"
          sub="Try our most loved recipes from around the world"
        />

        <RecipeGrid
          data={{
            meals: [
              ...getCustomRecipes().filter(
                (r) =>
                  !search ||
                  r.strMeal.toLowerCase().includes(search.toLowerCase())
              ),
              ...(data?.meals || [])
            ].slice(0, 12)
          }}
          loading={loading}
          error={error}
        />

        <div className="center-action">
          <Link
            className="auth-button"
            to="/recipes"
          >
            Explore All Recipes
          </Link>
        </div>

      </section>

      <section className="about">

        <div>
          <h2>Cook. Share. Enjoy.</h2>

          <p>
            Join our community of food lovers and explore
            amazing recipes from different cultures around
            the world.
          </p>
        </div>

        <div className="about-icon">🌿</div>

      </section>

    </Layout>
  );
}

export default Home;