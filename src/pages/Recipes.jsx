import { useState } from "react";

import Layout from "../components/Layout";
import Heading from "../components/Heading";
import RecipeGrid from "../components/RecipeGrid";

import useApi from "../hooks/useApi";
import { getCustomRecipes } from "../utils/storage";

function Recipes() {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");

  const { data, error, loading } = useApi(
    "search.php?s=" + encodeURIComponent(term)
  );

  const customMatches = getCustomRecipes().filter((r) =>
    !term ||
    r.strMeal.toLowerCase().includes(term.toLowerCase()) ||
    r.strCategory?.toLowerCase().includes(term.toLowerCase()) ||
    r.strArea?.toLowerCase().includes(term.toLowerCase())
  );

  const combinedData = {
    meals: [...customMatches, ...(data?.meals || [])]
  };

  return (
    <Layout>

      <main className="recipes">

        <Heading
          title="Explore Recipes"
          sub="Find your next favorite meal"
        />

        <div className="search-box">

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && setTerm(q)
            }
            placeholder="Search recipes, ingredients, cuisines..."
          />

          <button onClick={() => setTerm(q)}>
            Search
          </button>

        </div>

        <RecipeGrid
          data={combinedData}
          error={error}
          loading={loading}
        />

      </main>

    </Layout>
  );
}

export default Recipes;
