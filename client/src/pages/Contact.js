import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import axios from "axios";
import "../styles/Contact.css";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setAlertMsg(""); // clear alert on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setAlertMsg("Please fill in all fields!");
      setAlertVariant("danger");
      return;
    }

    try {
      setLoading(true);
      const BASE_URL = process.env.REACT_APP_API_URL;

      await axios.post(`${BASE_URL}/api/contact`, { name, email, message });

      setAlertMsg("Thank you! Your message has been sent.");
      setAlertVariant("success");

      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setAlertMsg("Failed to send message. Try again later.");
      setAlertVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page fade-in">

      <div
        className="contact-bg"
        style={{
          backgroundImage: `url(${process.env.REACT_APP_API_URL}/images/contact-bg.png)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          filter: "brightness(0.3)",
        }}
      ></div>


      <Container className="contact-container">
        {/* Alert message */}
        {alertMsg && (
          <Alert variant={alertVariant} onClose={() => setAlertMsg("")} dismissible>
            {alertMsg}
          </Alert>
        )}

        <Row>
          {/* LEFT INFO */}
          <Col xs={12} md={5} className="info-box hover-box">
            <h2>Get in Touch</h2>
            <p>Your mental wellness matters — reach out anytime.</p>
            <ul className="info-list">
              <li><span className="icon"><LocationOnIcon /></span>Tyre, Lebanon</li>
              <li><span className="icon"><PhoneIcon /></span>+961 76 123 456</li>
              <li><span className="icon"><EmailIcon /></span>info@innerglow.app</li>
            </ul>
          </Col>

          {/* RIGHT FORM */}
          <Col xs={12} md={7} className="form-box hover-box">
            <h2>Contact Us</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows={5}
                  placeholder="Write your message..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button className="send-btn" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Send Message"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
