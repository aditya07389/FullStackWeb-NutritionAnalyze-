import React, { useState, useEffect } from "react"; // 1. Added useEffect

const ProfilePage = () => {
  // 2. Updated state to be null and added loading
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  // 3. Initialize as empty string, will be set after fetch
  const [editedConditions, setEditedConditions] = useState("");

  // 4. Added useEffect to fetch data on component load
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        // In a real app, you'd redirect to login
        return;
      }

      try {
        // We use the proxy path, so no "http://localhost:3001"
        const response = await fetch("/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        
        // 5. Set user data from the server
        setUser(data);
        setEditedConditions(data.healthConditions.join(", "));
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // The empty array [] means this runs only once on mount

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 6. Updated handleSaveClick to be async and call the API
  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    const updatedConditions = editedConditions.split(",").map(cond => cond.trim());

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ healthConditions: updatedConditions }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      // 7. If API save is successful, update local state
      setUser({ ...user, healthConditions: updatedConditions });
      setIsEditing(false);

    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // 8. Added loading and error states for good UX
  if (isLoading) {
    return <div style={styles.container}><p>Loading your profile...</p></div>;
  }

  if (!user) {
    return <div style={styles.container}><p>Could not load profile. Please log in again.</p></div>;
  }

  // 9. Your original JSX (no changes needed)
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NutriChoice Profile</h1>

      <div style={styles.card}>
        <p style={styles.label}><strong>Username:</strong> {user.username}</p>
        <p style={styles.label}><strong>Credits:</strong> {user.credits}</p>

        <div style={styles.section}>
          <strong>Health Conditions:</strong>
          {!isEditing ? (
            <ul style={styles.list}>
              {user.healthConditions.map((condition, index) => (
                <li key={index} style={styles.listItem}>{condition}</li>
              ))}
            </ul>
          ) : (
            <textarea
              style={styles.textArea}
              value={editedConditions}
              onChange={(e) => setEditedConditions(e.target.value)}
            />
          )}
        </div>

        <div style={styles.buttonContainer}>
          {!isEditing ? (
            <button style={styles.editButton} onClick={handleEditClick}>
              ✏️ Edit Health Conditions
            </button>
          ) : (
            <button style={styles.saveButton} onClick={handleSaveClick}>
              💾 Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline styles (no changes)
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    padding: "30px",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "350px",
  },
  label: {
    fontSize: "16px",
    color: "#333",
    margin: "10px 0",
  },
  section: {
    marginTop: "10px",
    color: "#333",
  },
  list: {
    listStyleType: "circle",
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "5px",
  },
  buttonContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  textArea: {
    width: "100%",
    height: "60px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "8px",
    marginTop: "10px",
    fontSize: "14px",
  },
};

export default ProfilePage;