import React, { useState, useEffect } from "react";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ username: '', credits: 0 });
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editedGender, setEditedGender] = useState('');
  const [editedAge, setEditedAge] = useState('');
  const [editedAllergies, setEditedAllergies] = useState('');
  const [editedMedicalConditions, setEditedMedicalConditions] = useState('');
  const [editedPreferences, setEditedPreferences] = useState('');

  // Helper function to sync form fields
  const syncEditFields = (profileData) => {
    setEditedGender(profileData?.gender || 'other');
    setEditedAge(profileData?.age || '');
    setEditedAllergies((profileData?.allergies || []).join(", "));
    setEditedMedicalConditions((profileData?.medicalConditions || []).join(", "));
    setEditedPreferences((profileData?.preferences || []).join(", "));
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
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

        setUserData({ username: data.username, credits: data.credits });
        setProfile(data.profile || {});
        syncEditFields(data.profile || {});
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle edit mode
  const handleEditClick = () => {
    if (profile) {
      syncEditFields(profile);
      setIsEditing(true);
    }
  };

  // Handle save click
  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in again.");
      return;
    }

    const updatedProfile = {
      gender: editedGender,
      age: editedAge ? parseInt(editedAge, 10) : null,
      allergies: editedAllergies.split(",").map(cond => cond.trim()).filter(Boolean),
      medicalConditions: editedMedicalConditions.split(",").map(cond => cond.trim()).filter(Boolean),
      preferences: editedPreferences.split(",").map(cond => cond.trim()).filter(Boolean),
    };

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST", // Use PUT for update
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      const data = await response.json();
      setProfile(data.profile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Loading / error UI
  if (isLoading) {
    return <div style={styles.container}><p>Loading your profile...</p></div>;
  }

  if (!profile) {
    return <div style={styles.container}><p>Could not load profile. Please log in again.</p></div>;
  }

  // Main UI
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NutriChoice Profile</h1>

      <div style={styles.card}>
        <p style={styles.label}><strong>Username:</strong> {userData.username}</p>
        <p style={styles.label}><strong>Credits:</strong> {userData.credits}</p>

        {/* --- Gender --- */}
        <div style={styles.section}>
          <strong>Gender:</strong>
          {!isEditing ? (
            <p style={styles.text}>{profile?.gender || 'Not set'}</p>
          ) : (
            <select
              style={styles.select}
              value={editedGender}
              onChange={(e) => setEditedGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other / Prefer not to say</option>
            </select>
          )}
        </div>

        {/* --- Age --- */}
        <div style={styles.section}>
          <strong>Age:</strong>
          {!isEditing ? (
            <p style={styles.text}>{profile?.age || 'Not set'}</p>
          ) : (
            <input
              type="number"
              style={styles.input}
              value={editedAge}
              onChange={(e) => setEditedAge(e.target.value)}
              placeholder="Enter your age"
              min="0"
              max="120"
            />
          )}
        </div>

        {/* --- Medical Conditions --- */}
        <div style={styles.section}>
          <strong>Medical Conditions:</strong>
          <p style={styles.smallLabel}>Separate with commas (e.g., Diabetes, Asthma)</p>
          {!isEditing ? (
            <ul style={styles.list}>
              {profile?.medicalConditions?.length > 0 ? (
                profile.medicalConditions.map((condition, index) => (
                  <li key={index} style={styles.listItem}>{condition}</li>
                ))
              ) : (
                <li style={styles.listItem}>None</li>
              )}
            </ul>
          ) : (
            <textarea
              style={styles.textArea}
              value={editedMedicalConditions}
              onChange={(e) => setEditedMedicalConditions(e.target.value)}
            />
          )}
        </div>

        {/* --- Allergies --- */}
        <div style={styles.section}>
          <strong>Allergies:</strong>
          <p style={styles.smallLabel}>Separate with commas (e.g., Peanuts, Gluten)</p>
          {!isEditing ? (
            <ul style={styles.list}>
              {profile?.allergies?.length > 0 ? (
                profile.allergies.map((item, index) => (
                  <li key={index} style={styles.listItem}>{item}</li>
                ))
              ) : (
                <li style={styles.listItem}>None</li>
              )}
            </ul>
          ) : (
            <textarea
              style={styles.textArea}
              value={editedAllergies}
              onChange={(e) => setEditedAllergies(e.target.value)}
            />
          )}
        </div>

        {/* --- Preferences --- */}
        <div style={styles.section}>
          <strong>Dietary Preferences:</strong>
          <p style={styles.smallLabel}>Separate with commas (e.g., Vegan, Low-carb)</p>
          {!isEditing ? (
            <ul style={styles.list}>
              {profile?.preferences?.length > 0 ? (
                profile.preferences.map((item, index) => (
                  <li key={index} style={styles.listItem}>{item}</li>
                ))
              ) : (
                <li style={styles.listItem}>None</li>
              )}
            </ul>
          ) : (
            <textarea
              style={styles.textArea}
              value={editedPreferences}
              onChange={(e) => setEditedPreferences(e.target.value)}
            />
          )}
        </div>

        <div style={styles.buttonContainer}>
          {!isEditing ? (
            <button style={styles.editButton} onClick={handleEditClick}>
              ✏️ Edit Profile
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

// Inline styles
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
    width: "100%",
    maxWidth: "500px",
  },
  label: {
    fontSize: "16px",
    color: "#333",
    margin: "10px 0",
  },
  text: {
    fontSize: "15px",
    color: "#555",
    margin: "5px 0 0 0",
  },
  smallLabel: {
    fontSize: "12px",
    color: "#888",
    margin: "2px 0 5px 0",
  },
  section: {
    marginTop: "15px",
    color: "#333",
  },
  list: {
    listStyleType: "circle",
    paddingLeft: "20px",
    margin: "5px 0 0 0",
  },
  listItem: {
    marginBottom: "5px",
    color: "#555",
  },
  buttonContainer: {
    marginTop: "25px",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  textArea: {
    width: "100%",
    boxSizing: "border-box",
    height: "60px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "8px",
    marginTop: "5px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "8px",
    marginTop: "5px",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: "5px",
    border: "1px solid #ccc",
    padding: "8px",
    marginTop: "5px",
    fontSize: "14px",
    backgroundColor: "white",
  },
};

export default ProfilePage;
