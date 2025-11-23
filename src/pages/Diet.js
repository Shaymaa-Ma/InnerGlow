import React from "react";
import { Link } from "react-router-dom";
import { dietItems } from "../data/dietData";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Diet.css";
import heroImage from "../assets/diet/heroImage.png";

const Diet = () => {
  // Force scroll to top on page render
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="diet-page">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="hero-content">
          <h1>Diet for Better Mental Health</h1>
          <p>
            A balanced diet nourishes your brain, reduces stress, and improves
            your mood. Explore these brain-boosting foods.
          </p>
        </div>
      </div>

      {/* Diet Cards */}
      <section className="container diet-section py-5">
        <h1>Foods That Boost Your Mental Wellness</h1>
        <div className="row g-4">
          {dietItems.map((item, index) => (
            <div
              key={item.id}
              className="col-md-6 col-lg-4 diet-card-wrapper"
              style={{ animationDelay: `${0.2 + index * 0.2}s` }}
            >
              <div className="card diet-card shadow-sm h-100 border-0">
                <img src={item.img} className="card-img-top" alt={item.name} />
                <div className="card-body">
                  <h5>{item.name}</h5>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Food Pyramid */}
      <section className="pyramid-section">
        <h2>Mental Health Food Pyramid</h2>
        <div className="pyramid mx-auto">
          <div className="pyramid-level level-1">🍫 Healthy Fats & Treats</div>
          <div className="pyramid-level level-2">🥗 Lean Proteins & Omega-3</div>
          <div className="pyramid-level level-3">🍎 Fruits & Berries</div>
          <div className="pyramid-level level-4">🥦 Vegetables & Leafy Greens</div>
          <div className="pyramid-level level-5">🌾 Whole Grains</div>
          <div className="pyramid-level level-6">💧 Water & Hydration</div>
        </div>
        <p>
          A pyramid guide: hydration forms the base, followed by grains, vegetables, fruits, proteins, and healthy fats. Eating this way promotes mental clarity, emotional balance, and stress reduction.
        </p>
        <Link to="/book-appointment">
          <button className="book-appointment-btn">
            Book Appointment
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Diet;
