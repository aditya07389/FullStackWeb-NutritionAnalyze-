import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Global CSS Styles ---
// We define all styles here, replacing Tailwind classes.
const GlobalStyles = () => (
  <style>{`
    :root {
      --color-bg-light: #f3f4f6;
      --color-bg-white: #ffffff;
      --color-text-primary: #1f2937;
      --color-text-secondary: #6b7280;
      --color-text-medium: #374151;
      --color-border: #d1d5db;
      --color-input-bg: #f9fafb;
      --color-blue-600: #2563eb;
      --color-blue-700: #1d4ed8;
      --color-blue-500: #3b82f6;
      --color-indigo-600: #4f46e5;
      --color-indigo-700: #4338ca;
      --color-blue-100: #dbeafe;
      --color-blue-800: #1e40af;
      --color-green-100: #dcfce7;
      --color-green-800: #166534;
      --color-red-100: #fee2e2;
      --color-red-800: #991b1b;
      --color-gray-400: #9ca3af;
      
      --border-radius-lg: 0.5rem;
      --border-radius-2xl: 1rem;
      --border-radius-full: 9999px;
      
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      --ring-shadow: 0 0 0 2px var(--color-blue-500);
    }
    
    /* Global body styles */
    .profile-app-container {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      background-color: var(--color-bg-light);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box; /* Ensures padding doesn't affect width */
    }
    
    *, *::before, *::after {
      box-sizing: inherit;
    }
    
    /* Main form card */
    .profile-card {
      max-width: 42rem;
      width: 100%;
      background-color: var(--color-bg-white);
      border-radius: var(--border-radius-2xl);
      box-shadow: var(--shadow-xl);
      padding: 2rem;
      transition: all 0.3s ease-in-out;
    }
    
    .profile-header-title {
      font-size: 1.875rem; /* 30px */
      line-height: 2.25rem; /* 36px */
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 0.5rem;
    }
    
    .profile-header-subtitle {
      color: var(--color-text-secondary);
      margin-bottom: 2rem;
    }
    
    /* Form Message */
    .form-message {
      padding: 1rem;
      border-radius: var(--border-radius-lg);
      margin-bottom: 1.5rem;
    }
    .form-message-success {
      background-color: var(--color-green-100);
      color: var(--color-green-800);
    }
    .form-message-error {
      background-color: var(--color-red-100);
      color: var(--color-red-800);
    }
    
    /* Form grid layout */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* Form field groups */
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: flex;
      align-items: center;
      font-size: 0.875rem; /* 14px */
      font-weight: 500;
      color: var(--color-text-medium);
      margin-bottom: 0.5rem;
    }
    
    .form-label .icon {
      margin-right: 0.5rem;
      color: var(--color-text-secondary);
    }
    
    /* Standard input/select styles */
    .form-input, .form-select {
      width: 100%;
      appearance: none;
      padding: 0.75rem 1rem;
      background-color: var(--color-input-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-lg);
      transition: all 0.2s ease-in-out;
      font-size: 1rem; /* Ensure text is readable */
    }
    
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: transparent;
      box-shadow: var(--ring-shadow);
    }
    
    .select-wrapper {
      position: relative;
    }
    
    .select-arrow {
      position: absolute;
      inset: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding-right: 0.5rem;
      pointer-events: none;
    }
    
    .select-arrow .icon {
      color: var(--color-gray-400);
    }
    
    /* Tag Input Component */
    .tag-input-wrapper {
      display: flex;
    }
    
    .tag-input-field {
      flex-grow: 1;
      /* Adjust border-radius to connect to button */
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    .tag-input-button {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1rem;
      background-color: var(--color-blue-600);
      color: white;
      border: none;
      border-top-right-radius: var(--border-radius-lg);
      border-bottom-right-radius: var(--border-radius-lg);
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }
    
    .tag-input-button:hover {
      background-color: var(--color-blue-700);
    }
    
    .tag-input-button:focus {
      outline: none;
      box-shadow: var(--ring-shadow);
      z-index: 10; /* Ensure focus ring is visible */
    }
    
    .tag-input-button-text {
      margin-left: 0.5rem;
      display: none;
    }
    
    @media (min-width: 640px) {
      .tag-input-button-text {
        display: inline;
      }
    }
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    
    .tag-item {
      display: inline-flex;
      align-items: center;
      background-color: var(--color-blue-100);
      color: var(--color-blue-800);
      font-size: 0.875rem; /* 14px */
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      border-radius: var(--border-radius-full);
    }
    
    .tag-remove-button {
      margin-left: 0.5rem;
      color: var(--color-blue-600);
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      display: flex; /* Helps center the icon */
    }
    
    .tag-remove-button:hover {
      color: var(--color-blue-800);
    }
    
    /* Submit Button */
    .submit-button-wrapper {
      margin-top: 2.5rem;
    }
    
    .submit-button {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background-image: linear-gradient(to right, var(--color-blue-600), var(--color-indigo-600));
      color: white;
      font-weight: 600;
      font-size: 1.125rem; /* 18px */
      border: none;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    
    .submit-button:hover {
      background-image: linear-gradient(to right, var(--color-blue-700), var(--color-indigo-700));
    }
    
    .submit-button:focus {
      outline: none;
      box-shadow: var(--ring-shadow);
    }

    /* Icon Styles */
    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
    .icon-sm {
      width: 1rem;
      height: 1rem;
    }
  `}</style>
);

// --- Placeholder Icons ---
const Icon = ({ name, className = "icon" }) => {
  const icons = {
    Plus: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
    X: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    AlertOctagon: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    HeartPulse: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 10.5h-1.5l-1 2-2-4-1 2H6.5" /></svg>,
    Sparkles: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m10-1h4m-2-2v4m-7-14l2-2 2 2m-4 7l2-2 2 2m-4 7l2-2 2 2" /></svg>,
    User: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Cake: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15.25V11.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 11.25v4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.5V9m0 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>,
    ChevronDown: () => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  };
  const IconComponent = icons[name] || (() => null);
  return <IconComponent />;
}

// --- Reusable TagInput Component ---
function TagInput({ label, id, tags, setTags, placeholder, iconName }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTag(e);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {iconName && <Icon name={iconName} />}
        {label}
      </label>
      <div className="tag-input-wrapper">
        <input
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="form-input tag-input-field"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="tag-input-button"
        >
          <Icon name="Plus" />
          <span className="tag-input-button-text">Add</span>
        </button>
      </div>
      <div className="tag-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag-item">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="tag-remove-button"
              aria-label={`Remove ${tag}`}
            >
              <Icon name="X" className="icon-sm" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function UserProfileForm() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    allergies: [],
    medicalConditions: [],
    preferences: [],
  });


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token);
      // Clean up URL by removing token parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  const [formMessage, setFormMessage] = useState(null);
  const [isLoading,setIsLoading]=useState(false);
  const COMMON_ALLERGIES = [
    'Peanuts',
    'Dairy',
    'Gluten',
    'Shellfish',
    'Soy',
    'Eggs',
    'Tree Nuts',
    'Fish'
  ];

  // Handler for simple form inputs (gender, age)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handler for the common allergies dropdown
  const handleCommonAllergySelect = (e) => {
    const allergy = e.target.value;
    if (allergy && !profile.allergies.includes(allergy)) {
      setProfile(prevProfile => ({
        ...prevProfile,
        allergies: [...prevProfile.allergies, allergy],
      }));
    }
    // Reset dropdown after selection
    e.target.value = "";
  };

  // Handlers to pass to the TagInput component
  const setAllergies = (newAllergies) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      allergies: newAllergies,
    }));
  };

  const setMedicalConditions = (newConditions) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      medicalConditions: newConditions,
    }));
  };

  const setPreferences = (newPreferences) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      preferences: newPreferences,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);
    setIsLoading(true);

    const token=localStorage.getItem('token');
    if(!token)
    {
        setFormMessage({
            type:'error',
            text:'you are not logged in.Please log in again.'
        });
        setIsLoading(false);
        return;
    }

    //calling backend end point 
    try
    {
        const response=await fetch('http://localhost:5001/api/profile/update',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`

            },
            body:JSON.stringify(profile)
        });

        if(!response.ok)
        {
            let errorMsg = `Failed to save profile. Status: ${response.status}`;
            try {
              const errorData = await response.json();
              errorMsg = errorData.msg || errorMsg;
            } catch (jsonError) {
              errorMsg = `Failed to save Profile: ${response.statusText} (Not Found)`;
            }
            throw new Error(errorMsg);
        }
        
        const data = await response.json();

        setFormMessage({
            type:'success',
            text: data.msg || 'Profile saved successfully!' 
        });
        
        // Redirect to home after successful profile creation
        setTimeout(() => {
            navigate('/home');
        }, 2000); // Wait 2 seconds to show success message
    }
    catch(err){
        console.error('Profile update error',err);
        setFormMessage({
            type:'error',
            text: err.message || 'An error occured.Please try again' 
        });
    }
    finally{
        setIsLoading(false);
        setTimeout(()=>setFormMessage(null),3000);
    }
   
  };

  return (
    <>
      <GlobalStyles />
      <div className="profile-app-container">
        <div className="profile-card">
          <h1 className="profile-header-title">
            Your Health Profile
          </h1>
          <p className="profile-header-subtitle">
            Please fill out the form below to help us personalize your experience.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Form Message */}
            {formMessage && (
              <div className={`form-message ${
                formMessage.type === 'success' 
                  ? 'form-message-success' 
                  : 'form-message-error'
              }`}
              role="alert"
              >
                {formMessage.text}
              </div>
            )}
            
            {/* Grid Layout for Basic Info */}
            <div className="form-grid">
              {/* Gender */}
              <div>
                <label htmlFor="gender" className="form-label">
                  <Icon name="User" />
                  Gender
                </label>
                <div className="select-wrapper">
                  <select
                    id="gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  <div className="select-arrow">
                    <Icon name="ChevronDown" />
                  </div>
                </div>
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="form-label">
                  <Icon name="Cake" />
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  min="0"
                  max="120" // Increased max from model for flexibility
                  placeholder="Enter your age"
                  className="form-input"
                />
              </div>
            </div>

            {/* Allergies Section */}
            <div className="form-group">
              <label htmlFor="common-allergies" className="form-label">
                <Icon name="AlertOctagon" />
                Allergies
              </label>
              <div className="select-wrapper" style={{ marginBottom: '0.75rem' }}>
                <select
                  id="common-allergies"
                  onChange={handleCommonAllergySelect}
                  defaultValue=""
                  className="form-select"
                >
                  <option value="" disabled>Select a common allergy to add...</option>
                  {COMMON_ALLERGIES.map(allergy => (
                    <option key={allergy} value={allergy}>{allergy}</option>
                  ))}
                </select>
                <div className="select-arrow">
                    <Icon name="ChevronDown" />
                  </div>
              </div>
              
              {/* Custom Allergies */}
              <TagInput
                label="Added/Custom Allergies"
                id="allergies"
                tags={profile.allergies}
                setTags={setAllergies}
                placeholder="Add a custom allergy..."
                iconName={null} // No icon for the sub-label
              />
            </div>

            {/* Medical Conditions */}
            <TagInput
              label="Medical Conditions"
              id="medicalConditions"
              tags={profile.medicalConditions}
              setTags={setMedicalConditions}
              placeholder="Add a condition..."
              iconName="HeartPulse"
            />

            {/* Preferences */}
            <TagInput
              label="Dietary Preferences"
              id="preferences"
              tags={profile.preferences}
              setTags={setPreferences}
              placeholder="e.g., Vegan, Low-carb..."
              iconName="Sparkles"
            />

            {/* Submit Button */}
            <div className="submit-button-wrapper">
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading} // Add disabled state
              >
                {isLoading ? 'Saving...' : 'Save Profile'} {/* Add loading text */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

