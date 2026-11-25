import { Link, useParams } from "react-router-dom";

import Layout from "../components/Layout";
import { getUsers } from "../utils/storage";

function Profile() {
  const { email } = useParams();

  const decodedEmail = decodeURIComponent(email || "").trim().toLowerCase();

  const u =
    decodedEmail === "admin@foodrecipe.com"
      ? { name: "Administrator", email: "admin@foodrecipe.com", role: "admin" }
      : getUsers().find(
          (x) => x.email.toLowerCase() === decodedEmail
        );

  return (
    <Layout>

      <main className="profile-page">

        <div className="profile-card">

          <Link
            className="back-dashboard"
            to="/admin"
          >
            ← Back to Dashboard
          </Link>

          {u ? (

            <>

              <div className="profile-header">

                <div className="profile-avatar">
                  👤
                </div>

                <p className="small-title">
                  USER PROFILE
                </p>

                <h2>{u.name}</h2>

                <p>Food Recipe App Member</p>

              </div>

              <div className="profile-details">

                <div className="profile-detail">
                  👤

                  <div>
                    <small>Full Name</small>
                    <strong>{u.name}</strong>
                  </div>
                </div>

                <div className="profile-detail">
                  📧

                  <div>
                    <small>Email Address</small>
                    <strong>{u.email}</strong>
                  </div>
                </div>

                <div className="profile-detail">
                  🛡️

                  <div>
                    <small>Account Role</small>
                    <strong style={{ textTransform: "capitalize" }}>{u.role || "user"}</strong>
                  </div>
                </div>

              </div>

            </>

          ) : (

            <p>User not found.</p>

          )}

        </div>

      </main>

    </Layout>
  );
}

export default Profile;