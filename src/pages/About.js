import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom"; // import Link instead
import "../styles/About.css";
import aboutBg from "../assets/about-mentalwellness.png";

const About = () => {
  return (
    <div
      className="about-hero"
      style={{
        backgroundImage: `url(${aboutBg})`,
      }}
    >
      <div className="overlay">
        <Container className="py-5 about-container">
          <Row className="align-items-center text-light">
            
            {/* LEFT TEXT SIDE */}
            <Col md={6} className="animate-left">
              <h1 className="fw-bold mb-3 about-title">About Us</h1>

              <p className="lead about-text">
                We are dedicated to helping you build emotional balance, track your
                mood, and understand your mental wellness patterns.
              </p>

              <p className="about-text">
                Our mission is to provide a safe and uplifting space where science,
                mindfulness, and AI insights meet to guide your journey toward
                healthier daily habits.
              </p>

              <Link to="/services" className="btn-lavender mt-3 px-4 py-2">
                Discover More
              </Link>
            </Col>

            {/* RIGHT CARD SIDE */}
            <Col md={6} className="animate-right">
              <Card className="glass-card p-4">
                <h4 className="text-center mb-3">Our Vision</h4>
                <p>
                  To make mental wellness accessible, friendly, and empowering for
                  everyone—no judgement, just guidance and compassion.
                </p>
              </Card>
            </Col>

          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;
