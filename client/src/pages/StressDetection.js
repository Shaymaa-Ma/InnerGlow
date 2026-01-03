import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import "../styles/StressDetection.css";

const StressDetection = () => {
  const { user, token } = useAuth();
  const [sleep, setSleep] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [resp, setResp] = useState("");
  const [heart, setHeart] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]); // logged-in user
  const [guestHistory, setGuestHistory] = useState([]); // guest local history

  // Load user history on mount
  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stress-history", {
        headers: user ? { Authorization: `Bearer ${token}` } : {},
      });

      // Format timestamps
      const formatted = res.data.map((entry) => ({
        ...entry,
        timestamp: new Date(entry.timestamp).toLocaleString(),
      }));
      setHistory(formatted);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sleep || !systolic || !diastolic || !resp || !heart) {
      alert("Please fill in all fields!");
      return;
    }

    // Determine stress level and advice
    let stress_level = "Low";
    let advice = "Keep a calm routine!";
    if (heart > 100 || systolic > 140 || resp > 20) {
      stress_level = "High";
      advice = "Take a break, breathe, and relax.";
    } else if (heart > 80 || systolic > 120 || resp > 16) {
      stress_level = "Medium";
      advice = "Consider light exercise or meditation.";
    }

    const entry = {
      sleep,
      bp: `${systolic}/${diastolic}`,
      resp,
      heart,
      stress_level,
      advice,
      timestamp: new Date().toISOString(),
    };

    if (user) {
      // Logged-in user: save to backend and fetch updated list
      try {
        const res = await axios.post(
          "http://localhost:5000/api/stress-history",
          entry,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Format timestamps
        const formatted = res.data.map((e) => ({
          ...e,
          timestamp: new Date(e.timestamp).toLocaleString(),
        }));

        setHistory(formatted);
        setResult(`Stress Level: ${stress_level}\n${advice}`);
      } catch (err) {
        console.error("Error saving history:", err);
        alert("Failed to save entry.");
      }
    } else {
      // Guest: save locally
      const newGuestEntry = {
        ...entry,
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
      };
      setGuestHistory((prev) => [newGuestEntry, ...prev]);
      setResult(`Stress Level: ${stress_level}\n${advice}`);
    }

    // Reset inputs
    setSleep("");
    setSystolic("");
    setDiastolic("");
    setResp("");
    setHeart("");
  };

  const handleDelete = async (entry) => {
    if (!window.confirm("Delete this entry?")) return;

    if (user) {
      try {
        await axios.delete(`http://localhost:5000/api/stress-history/${entry.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory((prev) => prev.filter((e) => e.id !== entry.id));
      } catch (err) {
        console.error("Error deleting entry:", err);
        alert("Failed to delete entry.");
      }
    } else {
      setGuestHistory((prev) => prev.filter((e) => e.id !== entry.id));
    }
  };

  const combinedHistory = [...guestHistory, ...history]; // merge guest + logged-in

  return (
    <div className="stress-page py-5 fade-in-page">
      <Container>
        <Card className="card-stress p-4 mb-4 shadow-lg">
          <h3 className="text-center mb-4">Detect Your Stress Level</h3>

          <Form onSubmit={handleSubmit}>
            {[
              { label: "Sleeping Hours", value: sleep, setter: setSleep, type: "number", min: 1, max: 24 },
              { label: "Systolic BP (mmHg)", value: systolic, setter: setSystolic, type: "number", min: 80, max: 250 },
              { label: "Diastolic BP (mmHg)", value: diastolic, setter: setDiastolic, type: "number", min: 40, max: 150 },
              { label: "Respiration Rate (breaths/min)", value: resp, setter: setResp, type: "number", min: 5, max: 40 },
              { label: "Heart Rate (bpm)", value: heart, setter: setHeart, type: "number", min: 30, max: 200 },
            ].map((input, idx) => (
              <Form.Group className="mb-3" key={idx}>
                <Form.Label>{input.label}</Form.Label>
                <Form.Control
                  type={input.type}
                  min={input.min}
                  max={input.max}
                  value={input.value}
                  onChange={(e) => input.setter(e.target.value)}
                  required
                  className="custom-input"
                />
              </Form.Group>
            ))}

            <Button type="submit" className="w-100 btn-lavender">Predict</Button>
          </Form>

          {result && (
            <div className="mt-3 text-center result-box">
              <pre>{result}</pre>
            </div>
          )}
        </Card>

        <Card className="card-history p-3 shadow-lg">
          <h3 className="text-center mb-3">Your Stress History</h3>

          {combinedHistory.length === 0 ? (
            <p className="text-center text-muted">
              No history found. Run a test to see your results here.
            </p>
          ) : (
            combinedHistory.map((item) => (
              <Card
                key={item.id}
                className={`mb-2 p-3 border-start border-4 ${
                  item.stress_level === "Low"
                    ? "border-success"
                    : item.stress_level === "Medium"
                    ? "border-warning"
                    : "border-danger"
                }`}
              >
                <h5>Stress Level: {item.stress_level}</h5>
                <p><strong>Advice:</strong> {item.advice}</p>
                <p>
                  <strong>Sleep:</strong> {item.sleep} hrs |{" "}
                  <strong>BP:</strong> {item.bp} |{" "}
                  <strong>Resp:</strong> {item.resp} |{" "}
                  <strong>Heart:</strong> {item.heart}
                </p>
                <p><em>Date: {item.timestamp}</em></p>

                <Button
                  variant="danger"
                  size="sm"
                  className="btn-delete"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </Button>
              </Card>
            ))
          )}
        </Card>
      </Container>

      <Link to="/book-appointment">
        <button className="book-appointment-btn">Book Appointment</button>
      </Link>
    </div>
  );
};

export default StressDetection;
