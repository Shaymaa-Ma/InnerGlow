import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Exercises.css";

const Exercises = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Scroll to top smoothly
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Fetch exercises from backend
    axios.get("http://localhost:5000/api/exercises")
      .then(res => setExercises(res.data))
      .catch(err => console.error("Error fetching exercises:", err));
  }, []);

  return (
    <div className="exercises-container">
      {/* Page Header */}
      <header className="exercises-header fade-up" style={{ animationDelay: "0s" }}>
        <h1>Yoga Exercises</h1>
        <p>Practice these exercises daily to improve flexibility, strength, and mental calm.</p>
      </header>

      {/* Exercises Flip Cards */}
      <div className="flip-cards-grid">
        {exercises.map((exercise, idx) => (
          <div
            className="flip-card fade-up"
            key={exercise.id}
            style={{ animationDelay: `${0.2 + idx * 0.2}s` }}
          >
            <div className="flip-card-inner">
              {/* Front Side */}
              <div className="flip-card-front">
                <img src={`http://localhost:5000/images/exercises/${exercise.img}`} alt={exercise.name} className="exercise-img" />
                <h3 className="exercise-name">{exercise.name}</h3>
              </div>

              {/* Back Side */}
              <div className="flip-card-back">
                <h4>Steps:</h4>
                <ul>
                  {exercise.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
                <h4>Advantages:</h4>
                <ul>
                  {exercise.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/book-appointment">
        <button className="book-appointment-btn fade-up" >
          Book Appointment
        </button>
      </Link>
    </div>
  );
};

export default Exercises;
