import React, { useState } from "react"; 
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import "../styles/BookAppointment.css";

const BookAppointment = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [therapist, setTherapist] = useState("");
  const [birthday, setBirthday] = useState(""); // new
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !service || !date || !time) {
      alert("Please fill in all required fields!");
      return;
    }
    if (service === "Specific Doctor Consultation" && !therapist) {
      alert("Please select a therapist!");
      return;
    }

    alert("Appointment booked successfully! ✅");
    setName(""); setEmail(""); setService(""); setTherapist(""); setBirthday(""); setDate(""); setTime(""); setMessage("");
  };

  return (
    <div className="book-appointment-page">
      <Container>
        <h2 className="appointment-title animate">Book Your Appointment</h2>

        <Card className="appointment-card glass-card animate-up">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="custom-input"
                  />
                </Form.Group>
              </Col>
            </Row>

        

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="custom-input"
                    max={new Date().toISOString().split("T")[0]} // cannot be future
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Appointment Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="custom-input"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="custom-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Select Service</Form.Label>
              <Form.Select
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
                className="custom-input"
              >
                <option value="">-- Choose a service --</option>
                <option value="Awareness Session">Awareness Session</option>
                <option value="Yoga / Meditation">Yoga / Meditation</option>
                <option value="Diet Consultation">Diet Consultation</option> 
                <option value="Mood/Wellness Consultation">Mood/Wellness Consultation</option>
                <option value="Specific Doctor Consultation">Specific Doctor</option>
              </Form.Select>
            </Form.Group>

            {service === "Specific Doctor Consultation" && (
              <Form.Group className="mb-3">
                <Form.Label>Select Therapist / Doctor</Form.Label>
                <Form.Select
                  value={therapist}
                  onChange={(e) => setTherapist(e.target.value)}
                  required
                  className="custom-input"
                >
                  <option value="">-- Choose a doctor --</option>
                  <option value="Dr. Maha Hodroj">Dr. Maha Hodroj</option>
                  <option value="Dr. Michel Nawfal">Dr. Michel Nawfal</option>
                  <option value="Dr. Nicole Hani">Dr. Nicole Hani</option>
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Additional Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="custom-input"
              />
            </Form.Group>

            <Button type="submit" className="btn-appointment w-100">
              Confirm Appointment
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default BookAppointment;
