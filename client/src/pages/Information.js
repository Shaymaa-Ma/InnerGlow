import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Information.css";

const Information = () => {
  const [educationData, setEducationData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/education")
      .then(res => setEducationData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="information-page">
      <div className="container">
        <h2 className="info-title animate" style={{ animationDelay: "0s" }}>
          Mental Health Education
        </h2>

        <div className="education-grid">
          {educationData.map((item) => (
            <div key={item.id} className="education-card animate" style={{ animationDelay: `${item.id * 0.2}s` }}>
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <Link to="/book-appointment">
          <button className="book-appointment-btn">Book Appointment</button>
        </Link>
      </div>
    </div>
  );
};

export default Information;
