import React from "react";
import { Link } from "react-router-dom";
import "../styles/Information.css";
import { educationData } from "../data/educationData";

const Information = () => {
  return (
    <div className="information-page">
      <div className="container">
        <h2 className="info-title animate" style={{ animationDelay: "0s" }}>
          Mental Health Education
        </h2>

        <div className="education-grid">
          {educationData.map((item, idx) => (
            <div
              key={idx}
              className="education-card animate"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <img src={item.img} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
        <Link to="/book-appointment">
          <button className="book-appointment-btn">
            Book Appointment
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Information;
