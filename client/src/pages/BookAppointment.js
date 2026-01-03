import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Modal,
  Alert
} from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/BookAppointment.css";

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const initialFormData = () => {
    const saved = JSON.parse(localStorage.getItem("appointmentForm")) || {};
    return {
      firstName: saved.firstName || "",
      lastName: saved.lastName || "",
      email: user?.email || "",
      birthday: saved.birthday || "",
      date: saved.date || "",
      time: saved.time || "",
      service: saved.service || "",
      therapist: saved.therapist || "",
      message: saved.message || "",
    };
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Alert state (like in Contact page)
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alertMsg) {
      const timer = setTimeout(() => setAlertMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

  useEffect(() => {
    const { email, ...rest } = formData;
    localStorage.setItem("appointmentForm", JSON.stringify(rest));
  }, [formData]);

  useEffect(() => {
    if (!user) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        birthday: "",
        date: "",
        time: "",
        service: "",
        therapist: "",
        message: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "service") setFormData((prev) => ({ ...prev, service: value, therapist: "" }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
    setAlertMsg(""); // clear alert when user edits form
  };

  const validateForm = () => {
    const { firstName, lastName, email, service, date, time, therapist } = formData;
    if (!firstName || !lastName || !email || !service || !date || !time)
      return "Please fill in all required fields!";
    if (service === "Specific Doctor Consultation" && !therapist)
      return "Please select a therapist!";
    if (date === today) {
      const now = new Date().toTimeString().slice(0, 5);
      if (time <= now) return "Please select a future time.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const error = validateForm();
    if (error) {
      setAlertMsg(error);
      setAlertVariant("danger");
      return;
    }

    setLoading(true);
    try {
      const BASE_URL = process.env.REACT_APP_API_URL;

      await axios.post(`${BASE_URL}/api/appointments`, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        birthday: formData.birthday || null,
        appointment_date: formData.date,
        appointment_time: formData.time,
        service: formData.service,
        therapist: formData.therapist || null,
        message: formData.message || null,
      });


      // Show success alert
      setAlertMsg("Appointment booked successfully!");
      setAlertVariant("success");

      // Reset form except email
      setFormData((prev) => ({
        firstName: "",
        lastName: "",
        email: prev.email,
        birthday: "",
        date: "",
        time: "",
        service: "",
        therapist: "",
        message: "",
      }));
    } catch (err) {
      console.error(err);
      setAlertMsg("Failed to book appointment. Please try again later.");
      setAlertVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-appointment-page fade-in-page">
      <Container>
        {/* ALERT like Contact page */}
        {alertMsg && (
          <Alert
            variant={alertVariant}
            onClose={() => setAlertMsg("")}
            dismissible
          >
            {alertMsg}
          </Alert>
        )}

        <h2 className="appointment-title mb-4">Book Your Appointment</h2>

        <Card className="appointment-card shadow-lg p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Your Last Name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                placeholder="Your Email"
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    max={today}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Appointment Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Service</Form.Label>
                  <Form.Select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Choose a service --</option>
                    <option>Awareness Session</option>
                    <option>Yoga / Meditation</option>
                    <option>Diet Consultation</option>
                    <option>Mood / Wellness Consultation</option>
                    <option>Specific Doctor Consultation</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {formData.service === "Specific Doctor Consultation" && (
              <Form.Group className="mb-3">
                <Form.Label>Select Therapist</Form.Label>
                <Form.Select
                  name="therapist"
                  value={formData.therapist}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose a doctor --</option>
                  <option>Dr. Maha Hodroj</option>
                  <option>Dr. Michel Nawfal</option>
                  <option>Dr. Nicole Hani</option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Label>Additional Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={formData.message}
                placeholder="Optional Message..."
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-appointment w-100"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Confirm Appointment"}
            </Button>
          </Form>
        </Card>

        {/* LOGIN REQUIRED MODAL */}
        <Modal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          centered
          className="login-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Login Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You must be logged in to book an appointment.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowLoginModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => navigate("/auth")}>
              Go to Login
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default BookAppointment;
