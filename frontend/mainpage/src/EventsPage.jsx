import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EventsPage.css'; // Optional: CSS styling for the page

const EventsPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    fetch("http://localhost:3000/auth/check", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          window.location.href = "http://localhost:3000/auth/login";
        }
      })
      .catch((error) => console.error("Error checking authentication:", error));
  }, [navigate]);

  // You can add an array of event data here or fetch it from an API if needed
  const events = [
    {
      title: "Avishkar",
      description: "Avishkar is the annual technical festival of MNNIT Allahabad, featuring workshops, hackathons, and technical competitions to boost innovation.",
      link: "https://avishkar.mnnit.ac.in"
    },
    {
      title: "Culrav",
      description: "Culrav is the cultural fest, celebrating music, dance, drama, and other arts, and it attracts top performers and artists from across India.",
      link: "https://culrav.mnnit.ac.in"
    },
    {
      title: "Udbhav",
      description: "Udbhav is the annual sports fest of MNNIT, bringing together athletes for competitions across various sports and activities.",
      link: "https://udbhav.mnnit.ac.in"
    },
    {
      title: "Gnosiomania",
      description: "Gnosiomania is a quiz fest, hosting quizzes in diverse fields such as general knowledge, science, and current affairs.",
      link: "https://gnosiomania.mnnit.ac.in"
    },
    {
      title: "Avsar",
      description: "Avsar, the entrepreneurship summit, includes talks, workshops, and competitions that foster entrepreneurial skills among students.",
      link: "https://avsar.mnnit.ac.in"
    }
  ];

  return (
    isAuthenticated && (
      <div className="events-page">
        {events.map((event, index) => (
          <div className="event-card" key={index}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <Link to={`/events/${event.title.toLowerCase()}`} className="event-link">View Details</Link>
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              Official Website
            </a>
          </div>
        ))}
      </div>
    )
  );
};

export default EventsPage;
