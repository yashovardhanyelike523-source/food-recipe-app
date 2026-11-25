import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import Heading from "../components/Heading";
import RecipeGrid from "../components/RecipeGrid";

import useApi from "../hooks/useApi";
import { getCustomRecipes } from "../utils/storage";

const CUISINE_AREAS = {
  Indian: "India",
  India: "India",
  French: "France",
  France: "France",
  American: "United States",
  "United States": "United States",
  USA: "United States",
  Italian: "Italian",
  Chinese: "Chinese",
  Japanese: "Japanese",
  Mexican: "Mexican",
  Thai: "Thai"
};

function Category() {
  const { type, name } = useParams();

  const n = decodeURIComponent(name || "");

  const area = CUISINE_AREAS[n] || n;

  const { data, error, loading } = useApi(
    type === "category"
      ? "filter.php?c=" + encodeURIComponent(n)
      : "filter.php?a=" + encodeURIComponent(area)
  );

  const customMatches = getCustomRecipes().filter((r) => {
    if (type === "category") {
      return r.strCategory?.toLowerCase() === n.toLowerCase();
    } else {
      return (
        r.strArea?.toLowerCase() === n.toLowerCase() ||
        r.strArea?.toLowerCase() === area.toLowerCase()
      );
    }
  });

  const combinedData = {
    meals: [...customMatches, ...(data?.meals || [])]
  };

  return (
    <Layout>
      <main className="recipes">
        <Heading
          title={n + " Recipes"}
          sub="Explore delicious dishes"
        />

        <RecipeGrid
          data={combinedData}
          loading={loading}
          error={error}
          tag={n}
        />
      </main>
    </Layout>
  );
}

export default Category;
