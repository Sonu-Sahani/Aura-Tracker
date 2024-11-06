import React, { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    registrationNo: "",
    gender: "",
    year: "",
    branch: "",
    contact: "",
    email: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated
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
        console.log(data)
        console.log('gis')
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchData(); // Fetch the form data if authenticated
        } else {
          setIsAuthenticated(false);
          window.location.href = "http://localhost:3000/auth/login"; // Redirect to login page
        }
      } else {
        console.error("Failed to check authentication status.");
        window.location.href = "http://localhost:3000/auth/login";
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      window.location.href = "http://localhost:3000/auth/login";
    }
  };

  // Fetch data from the backend when the component loads or after a successful submit
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/profile/get", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
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
    checkAuthentication(); // Check authentication status on component load
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlEncodedData = new URLSearchParams(formData).toString();
    try {
      const response = await fetch("http://localhost:3000/profile/submit", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
      });

      if (response.ok) {
        // alert("Data submitted successfully!");
        const data=await response.json()
        if(data.submitted){
          window.location.href="http://localhost:4000"
        }
        // fetchData(); // Re-fetch data to update form fields with latest saved data
      } else {
        alert("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      registrationNo: "",
      gender: "",
      year: "",
      branch: "",
      contact: "",
      email: ""
    });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? (
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
            value={formData.profile_id}
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
            <option value="cse">Computer Science Engineering</option>
            <option value="civil">Civil Engineering</option>
            <option value="me">Mechanical Engineering</option>
            <option value="ee">Electrical Engineering</option>
            <option value="ece">Electronics and Communication Engineering</option>
            <option value="be">Biotechnology Engineering</option>
            <option value="pie">Production and Industrial Engineering</option>
            <option value="che">Chemical Engineering</option>
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
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  ) : (
    <p>Redirecting to login...</p>
  );
};

export default Profile;
