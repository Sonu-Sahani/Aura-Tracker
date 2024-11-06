import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Assignments.css';

function Assignments() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Check user authentication and fetch assignments if authenticated
    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/check', {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          fetchAssignments(); // Fetch assignments if authenticated
        } else {
          setIsAuthenticated(false);
          window.location.href = 'http://localhost:3000/auth/login';
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        window.location.href = 'http://localhost:3000/auth/login';
          
      }
    };

    checkAuthentication();
  }, [navigate]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/assignments', {
        credentials: 'include',
      });
      const data = await response.json();

      const formattedData = data.map((assignment) => ({
        ...assignment,
        dueDate: assignment.duedate, // Convert 'duedate' to 'dueDate'
        completed: false,            // Default completed status if not provided
      }));
      setAssignments(formattedData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (id) => {
    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', id);
  
    try {
      const response = await fetch('http://localhost:3000/api/assignments/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
  
      if (response.ok) {
        const result = await response.json(); // Assuming the response contains { completed: true }
        alert("File uploaded successfully!");
  
        // Update the assignments state to reflect the completion status
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id ? { ...assignment, completed: result.completed } : assignment
          )
        );
  
        setFile(null); // Clear the file input
      } else {
        alert("Failed to upload file.");
      }
    } catch (error) {
      alert("Error uploading file.");
    }
  };
  

  const handleShowDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
  };

  const handleViewPdf = (pdfId) => {
    window.open(`http://localhost:3000/api/assignments/view/${pdfId}`, '_blank');
  };

  return (
    isAuthenticated && (
      <div className="assignment-page">
        <h1>Assignments</h1>
        <ul className="assignment-list">
          {assignments.map((assignment) => (
            <li key={assignment.id} className={`assignment-item ${assignment.completed ? 'completed' : ''}`}>
              <h3>{assignment.title}</h3>
              <p>Due: {assignment.dueDate}</p>
              <button onClick={() => handleShowDetails(assignment)}>View Details</button>
              
              <div className="file-upload">
                <input type="file"  accept='.pdf' onChange={handleFileChange} />
                <button onClick={() => handleSubmit(assignment.id)}>Submit File</button>
              </div>
            </li>
          ))}
        </ul>

        {selectedAssignment && (
          <div className="modal">
            <div className="modal-content">
              <h2>{selectedAssignment.title}</h2>
              <p>Due Date: {selectedAssignment.dueDate}</p>
              <p>Instructions:</p>
              <p>{selectedAssignment.comments}</p>
              
              <button onClick={() => handleViewPdf(selectedAssignment.id)}>View PDF</button>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default Assignments;
