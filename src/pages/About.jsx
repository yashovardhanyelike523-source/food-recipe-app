import Layout from "../components/Layout";

function About() {
  return (
    <Layout>

      <main className="about-page">

        <section className="about-hero">

          <h2>About Food Recipe App</h2>

          <p>
            Discover, explore and save delicious recipes
            from different cuisines around the world.
          </p>

        </section>

        <section className="about-introduction">

          <h2>About Our Website</h2>

          <p>
            Food Recipe App is a web-based recipe platform
            designed to make discovering and exploring
            recipes simple and convenient.
          </p>

          <p>
            Users can browse recipes, explore different
            categories and cuisines, view complete recipe
            details and save their favorite recipes for later.
          </p>

        </section>

        <section className="about-section">

          <h2>What You Can Do</h2>

          <div className="about-features">

            {[
              [
                "🍽️",
                "Browse Recipes",
                "Explore recipes from different cuisines."
              ],
              [
                "📂",
                "Explore Categories",
                "Find dishes by category."
              ],
              [
                "🌎",
                "Discover Cuisines",
                "Explore recipes from around the world."
              ],
              [
                "❤️",
                "Save Recipes",
                "Keep your favorite recipes in one place."
              ]
            ].map((x) => (

              <div
                className="about-feature"
                key={x[1]}
              >

                <div className="about-feature-icon">
                  {x[0]}
                </div>

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
              ["React", "User Interface"],
              ["Vite", "Development and Build Tool"],
              ["CSS", "Design and Layout"],
              [
                "Local Storage",
                "Demo Authentication and Saved Data"
              ],
              ["TheMealDB API", "Recipe Data"]
            ].map((x) => (

              <div
                className="technology"
                key={x[0]}
              >

                <strong>{x[0]}</strong>
                <span>{x[1]}</span>

              </div>

            ))}

          </div>

        </section>

      </main>

    </Layout>
  );
}

export default About;