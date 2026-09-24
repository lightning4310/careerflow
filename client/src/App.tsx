
import { useEffect, useState, type SubmitEvent } from "react";
import "./App.css";

function App() {
  // Application states
  const [applicationData, setApplicationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  // Authentication states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // Fetch applications after login
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchApplications = async () => {
      setLoading(true);
      setDashboardError("");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplicationData(data.applications || []);
      } catch (error) {
        setDashboardError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isLoggedIn]);

  // Login and registration handler
  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const endpoint = isRegister
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      // After successful registration, return to login
      if (isRegister) {
        setName("");
        setEmail("");
        setPassword("");
        setIsRegister(false);
        setSuccess("Account created successfully. Please sign in.");
        return;
      }

      // Successful login
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Unable to connect to server");
    }
  };

  // Dashboard
  if (isLoggedIn) {
    return (
      <main className="dashboard">
        <h1>CareerFlow Dashboard</h1>
        <p>Your Career, Organized.</p>

        {loading && <p>Loading applications...</p>}

        {dashboardError && (
          <p className="error-message">{dashboardError}</p>
        )}

        {!loading &&
          !dashboardError &&
          applicationData.length === 0 && (
            <p>
              No applications yet. Start tracking your job search!
            </p>
          )}

        <div className="applications-list">
          {applicationData.map((application) => (
            <div
              key={application._id}
              className="application-card"
            >
              <h3>{application.role}</h3>
              <p>{application.company}</p>
              <p>Status: {application.status}</p>
              <p>
                Location: {application.location || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // Login and registration page
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand">
          <h1>CareerFlow</h1>
          <p>Your Career, Organized.</p>
        </div>

        <div className="auth-content">
          <h2>
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>

          <p className="subtitle">
            {isRegister
              ? "Start organizing your job applications."
              : "Sign in to manage your applications"}
          </p>

          <form onSubmit={handleLogin}>
            {isRegister && (
              <>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </>
            )}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="error-message">{error}</p>
            )}

            {success && (
              <p className="success-message">{success}</p>
            )}

            <button type="submit">
              {isRegister ? "Create account" : "Sign In"}
            </button>
          </form>

          <p className="signup-text">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              className="link-button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
              }}
            >
              {isRegister ? "Sign In" : "Create one"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;