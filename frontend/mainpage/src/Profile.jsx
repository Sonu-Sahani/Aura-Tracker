import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    registrationNo: "",
    gender: "",
    year: "",
    branch: "",
    section: "",  // Added section field
    contact: "",
    email: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const checkAuthentication = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/check", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchData();
        } else {
          setIsAuthenticated(false);
          window.location.href = "http://localhost:3000/auth/login";
        }
      } else {
        console.error("Failed to check authentication status.");
        window.location.href = "http://localhost:3000/auth/login";
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      alert("Network error. Redirecting to login.");
      window.location.href = "http://localhost:3000/auth/login";
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/profile/get", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setIsSubmitted(true);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlEncodedData = new URLSearchParams(formData).toString();
    const endpoint = isSubmitted ? "update" : "submit";
    const apiUrl = `http://localhost:3000/profile/${endpoint}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.submitted) {
          alert("Data submitted successfully!");
          setIsSubmitted(true);
          window.location.href = "http://localhost:4000";
        }
      } else {
        alert("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? (
    <div className="form-body">
      <div className="form-container">
        <h2>Student Registration Form</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.student_name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Registration No.:
            <input
              type="text"
              name="registrationNo"
              value={formData.registration_num}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Gender:
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Year:
            <select name="year" value={formData.year} onChange={handleChange} required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </label>

          <label>
            Branch:
            <select name="branch" value={formData.branch} onChange={handleChange} required>
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="CIVIL">Civil Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="EE">Electrical Engineering</option>
              <option value="ECE">Electronics and Communication Engineering</option>
              <option value="BT">Biotechnology Engineering</option>
              <option value="PIE">Production and Industrial Engineering</option>
              <option value="CHE">Chemical Engineering</option>
            </select>
          </label>

          <label>
            Section:
            <select name="section" value={formData.section} onChange={handleChange} required>
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
              <option value="J">J</option>
            </select>
          </label>

          <label>
            Contact:
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email ID:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form-buttons">
            <button type="submit">{isSubmitted ? "Update Profile" : "Submit"}</button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p>Redirecting to login...</p>
  );
};

export default Profile;
