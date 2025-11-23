import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import "../styles/Contact.css";

const Contact = () => {

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    alert("Thank you! Your message has been sent.");
  };

  return (
    <div className="contact-page fade-in">

      {/* BACKGROUND OVERLAY */}
      <div className="contact-bg"></div>

      <Container className="contact-container">
        <Row>

          {/* LEFT INFO SECTION */}
          <Col md={5} className="info-box hover-box">
            <h2>Get in Touch</h2>
            <p>Your mental wellness matters — reach out anytime.</p>

            <ul className="info-list">
              <li>
                <span className="icon"><LocationOnIcon /></span>
                Tyre, Lebanon
              </li>

              <li>
                <span className="icon"><PhoneIcon /></span>
                +961 76 123 456
              </li>

              <li>
                <span className="icon"><EmailIcon /></span>
                info@innerglow.app
              </li>
            </ul>
          </Col>

          {/* RIGHT FORM SECTION */}
          <Col md={7} className="form-box hover-box">
            <h2>Contact Us</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control required type="text" placeholder="Enter your name" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control required type="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control required as="textarea" rows={5} placeholder="Write your message..." />
              </Form.Group>

              <Button className="send-btn" type="submit">
                Send Message
              </Button>
            </Form>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Contact;
