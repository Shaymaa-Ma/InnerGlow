import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Information.css";

const Information = () => {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/education`)
      .then(res => {
        setEducationData(res.data);
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="information-page">
      <div className="container">
        <h2 className="info-title animate">
          Mental Health Education
        </h2>

        {/* Cards */}
        <div className="education-grid">
          {!loading &&
            educationData.map((item, index) => (
              <div
                key={item.id}
                className="education-card animate"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <img src={item.img} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
        </div>

        {/* Button (appears after cards) */}
        {!loading && (
          <Link to="/book-appointment">
            <button className="book-appointment-btn animate">
              Book Appointment
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Information;
