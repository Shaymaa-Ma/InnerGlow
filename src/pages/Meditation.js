// src/pages/Meditation.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Meditation.css";
import { meditationVideos } from "../data/meditationVideos";

const Meditation = () => {
  // --- TIMER STATE ---
  const circumference = 2 * Math.PI * 60; // Progress circle circumference
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [customTime, setCustomTime] = useState("");
  const [unit, setUnit] = useState("seconds");
  const [dashOffset, setDashOffset] = useState(circumference);
  const [history, setHistory] = useState([]);

  // --- SCROLL TO TOP ON LOAD ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      const newTime = timeLeft - 1;
      setTimeLeft(newTime);
      setDashOffset(circumference * (newTime / totalTime));

      if (newTime === 0) {
        alert("Meditation Complete! 🎵");
        saveHistory(totalTime);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, totalTime, circumference]);

  // --- SET TIMER ---
  const setTimer = (seconds) => {
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setDashOffset(circumference);
  };

  // --- CUSTOM TIMER ---
  const setCustomTimerFunc = () => {
    let seconds = Number(customTime);
    if (unit === "minutes") seconds *= 60;
    if (unit === "hours") seconds *= 3600;

    if (!seconds || seconds <= 0) return alert("Enter a valid time!");
    setTimer(seconds);
  };

  // --- START / STOP ---
  const startTimer = () => {
    if (timeLeft <= 0) return alert("Select a timer first!");
    setTimeLeft(timeLeft); // Just to trigger effect
  };

  const stopTimer = () => {
    setTimeLeft(0);
    setDashOffset(circumference);
  };

  // --- HISTORY MANAGEMENT ---
  const saveHistory = (duration) => {
    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        duration,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  // --- FORMAT TIME ---
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="meditation-container">
      <header className="meditation-header">
        <h1>🧘 Meditation & Mindfulness</h1>
        <p>Relax, meditate, and track your calm moments daily.</p>
      </header>

      {/* TIMER CARD */}
      <section className="meditation-card">
        <h2>Meditation Timers</h2>
        <div className="timer-buttons">
          {[30, 60, 120, 300, 600, 900].map((t) => (
            <button key={t} onClick={() => setTimer(t)} className="timer-btn">
              {t >= 60 ? `${t / 60} min` : `${t} sec`}
            </button>
          ))}
        </div>

        {/* Custom timer */}
        <div className="custom-timer">
          <input
            type="number"
            placeholder="Enter time"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
          />
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
          <button onClick={setCustomTimerFunc} className="timer-btn">
            Set
          </button>
        </div>

        {/* Progress ring */}
        <div className="progress-ring">
          <svg width="120" height="120">
            <circle
              className="bg"
              r="60"
              cx="60"
              cy="60"
              stroke="#e0e0eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              className="progress"
              r="60"
              cx="60"
              cy="60"
              stroke="#8b5cf6"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="timer-display">{formatTime(timeLeft)}</div>

        <div className="timer-controls">
          <button className="timer-btn" onClick={startTimer}>
            Start
          </button>
          <button className="timer-btn" onClick={stopTimer}>
            Stop
          </button>
        </div>
      </section>

      {/* VIDEOS */}
      <section className="meditation-card">
        <h2 className="videos-header">Guided Meditation Videos</h2>
        <div className="videos-grid">
          {meditationVideos.map((v) => (
            <div key={v.id} className="video-wrapper">
              <iframe
                src={v.src}
                title={v.title}
                allowFullScreen
                className="video-frame"
              />
            </div>
          ))}
        </div>
      </section>

      {/* HISTORY */}
      <section className="meditation-card">
        <h2>📝 Meditation History</h2>
        <ul className="history-list">
          {history.length === 0 && <li>No sessions yet.</li>}
          {history.map((h) => (
            <li key={h.id} className="history-item">
              {(h.duration / 60).toFixed(1)} min — {h.timestamp}
              <button className="delete-btn" onClick={() => deleteHistory(h.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* BOOK APPOINTMENT */}
      <Link to="/book-appointment">
        <button className="book-appointment-btn">Book Appointment</button>
      </Link>
    </div>
  );
};

export default Meditation;
