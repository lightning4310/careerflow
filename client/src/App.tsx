
import { useEffect, useState, type SubmitEvent } from "react";
import "./App.css";
import API_BASE_URL from "./config/api";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import { fetchApplications } from "./services/applicationService";
import { saveApplication } from "./services/applicationService";

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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Application form state
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    jobType: "",
    workMode: "",
    jobLink: "",
    status: "SAVED",
    salary: "",
    notes: "",
  });

  // Reset and close the application form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);

    setFormData({
      company: "",
      role: "",
      location: "",
      jobType: "",
      workMode: "",
      jobLink: "",
      status: "SAVED",
      salary: "",
      notes: "",
    });
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );


  // Fetch applications after login
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadApplications = async () => {
      setLoading(true);
      setDashboardError("");

      try {
        const token = localStorage.getItem("token");
        const applications = await fetchApplications(token);

        setApplicationData(applications);
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

    loadApplications();
  }, [isLoggedIn]);


  // Login and registration handler
  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const endpoint = isRegister
        ? `${API_BASE_URL}/api/auth/register`
        : `${API_BASE_URL}/api/auth/login`;

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

  // Add or update an application
  const handleAddApplication = async (
    e: SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setDashboardError("");

    try{
      const token = localStorage.getItem("token")

      const savedApplication = await saveApplication(
        token,
        formData,
        editingId
      );
    if (editingId) {
      setApplicationData((prev) =>
      prev.map((application)=>
      application._id === editingId
      ? savedApplication
      : application
      )
    );
    
  } else {
    setApplicationData((prev) =>[
      savedApplication,
      ...prev,
    ]);
  }

  setFormData({
      company: "",
      role: "",
      location: "",
      jobType: "",
      workMode: "",
      jobLink: "",
      status: "SAVED",
      salary: "",
      notes: "",
    });

    setShowForm(false);
    setEditingId(null);
  }catch (error) {
    setDashboardError(
      error instanceof Error
      ? error.message
      :"Something went Wrong. Please try again."
    );
  }
};
  // Delete an application
  const handleDeleteApplication = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    setDashboardError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete application"
        );
      }

      setApplicationData((prev) =>
        prev.filter((application) => application._id !== id)
      );
    } catch (error) {
      setDashboardError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    }
  };

  // Update application status
  const handleStatusChange = async (
    id: string,
    newStatus: string
  ) => {
    setDashboardError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setApplicationData((prev) =>
        prev.map((application) =>
          application._id === id
            ? { ...application, ...data.application }
            : application
        )
      );
    } catch (error) {
      setDashboardError(
        error instanceof Error
          ? error.message
          : "Failed to update status"
      );
    }
  };

  // Prepare an application for editing
  const handleEditApplication = (application: any) => {
    setFormData({
      company: application.company || "",
      role: application.role || "",
      location: application.location || "",
      jobType: application.jobType || "",
      workMode: application.workMode || "",
      jobLink: application.jobLink || "",
      status: application.status || "SAVED",
      salary: application.salary?.toString() || "",
      notes: application.notes || "",
    });

    setEditingId(application._id);
    setShowForm(true);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setApplicationData([]);
    setDashboardError("");
    handleCancelForm();
  };

  // Dashboard
  if (isLoggedIn) {
    return (
      <main className="dashboard">
        <h1>CareerFlow Dashboard</h1>
        <p>Your Career, Organized.</p>

        <button onClick={handleLogout}>Logout</button>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              handleCancelForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "Add Application"}
        </button>

        {showForm && (
          <ApplicationForm
            formData={formData}
            editingId={editingId}
            onInputChange={handleInputChange}
            onSubmit={handleAddApplication}
          />
        )}

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

        <div className="application-list">
          {applicationData.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onEdit={handleEditApplication}
              onDelete={handleDeleteApplication}
              onStatusChange={handleStatusChange}
            />
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