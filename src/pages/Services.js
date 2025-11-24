import React from "react";
import "../styles/Services.css";
import { servicesData } from "../data/servicesData";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap"; 

const Services = () => {
  return (
    <div className="services-page animate-page">
      <Container>
        <h2 className="services-title">Our Services</h2>

        <Row className="services-row">
          {servicesData.map((service, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <div
                className="service-card animate-card"
                style={{ animationDelay: `${0.2 + idx * 0.2}s` }}
              >
                <span className="emoji">{service.emoji}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>

                <Link to={service.link} className="service-btn">
                  {service.btnText}
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
