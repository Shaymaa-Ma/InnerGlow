import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/FindTherapist.css";

const FindTherapist = () => {
  const [location, setLocation] = useState("");
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps?q=therapist+near+me&output=embed"
  );

  const updateMap = () => {
    if (location.trim() !== "") {
      setMapUrl(
        `https://www.google.com/maps?q=therapist+in+${encodeURIComponent(
          location
        )}&output=embed`
      );
    }
  };

  return (
    <div className="find-page animate-page">

      {/* Header Section */}
      <header className="therapist-header animate-header">
        <h1>Find a Therapist Near You</h1>
        <p>Your well-being matters. Start by finding help around you.</p>
      </header>

      {/* Search Section */}
      <div className="search-area container animate-search">
        <input
          type="text"
          placeholder="Enter any city, country…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button className="search-btn animate-btn" onClick={updateMap}>
          Search
        </button>
      </div>

      {/* Map */}
      <div className="map-wrapper container animate-map">
        <iframe title="map" src={mapUrl} loading="lazy"></iframe>
      </div>

      {/* Note */}
      <div className="therapist-note container animate-note">
        🌍 Search anywhere worldwide
        🚑 In emergencies, contact your nearest hospital immediately.
      </div>
    </div>
  );
};

export default FindTherapist;
