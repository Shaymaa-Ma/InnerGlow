import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const API = process.env.REACT_APP_API_URL; // use the .env variable

  useEffect(() => {
    axios.get(`${API}/api/services`)
      .then(res => setServices(res.data))
      .catch(err => console.error("Failed to fetch services:", err));
  }, [API]);

  return (
    <div className="services-page animate-page">
      <Container>
        <h2 className="services-title">Our Services</h2>
        <Row className="services-row">
          {services.map((service) => (
            <Col key={service.id} md={4} className="mb-4">
              <div className="service-card animate-card">
                <span className="emoji">{service.emoji}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to={service.link} className="service-btn">
                  {service.btn_text}
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Services;
