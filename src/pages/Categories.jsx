import Layout from "../components/Layout";
import Heading from "../components/Heading";

import useApi from "../hooks/useApi";
import cuisines from "../data/cuisines";

import { Link } from "react-router-dom";

function Categories() {
  const { data, error, loading } = useApi(
    "categories.php"
  );

  return (
    <Layout>

      <main className="categories">

        <Heading
          title="Explore Categories"
          sub="Choose a category or cuisine"
        />

        <h2>Food Categories</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="category-container">

            {(data?.categories || []).map((c) => (
              <Link
                className="category"
                key={c.idCategory}
                to={
                  "/category/category/" +
                  encodeURIComponent(c.strCategory)
                }
              >
                <img
                  className="category-icon"
                  src={c.strCategoryThumb}
                  alt={c.strCategory}
                />

                <h3>{c.strCategory}</h3>

              </Link>
            ))}

          </div>
        )}

        <h2>Explore by Cuisine</h2>

        <div className="category-container">

          {cuisines.map(([name, icon]) => (
            <Link
              className="category"
              key={name}
              to={"/category/cuisine/" + name}
            >
              <div className="category-icon">
                {icon}
              </div>

              <h3>{name}</h3>

            </Link>
          ))}

        </div>

      </main>

    </Layout>
  );
}

export default Categories;