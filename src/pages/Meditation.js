import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Meditation.css";
import { meditationVideos } from "../data/meditationVideos";

const Meditation = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [customTime, setCustomTime] = useState("");
  const [unit, setUnit] = useState("seconds");
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const circumference = 2 * Math.PI * 60;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("meditationHistory")) || [];
    setHistory(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("meditationHistory", JSON.stringify(history));
  }, [history]);

  // ----- Timer Functions -----
  const setTimer = (seconds) => {
    clearInterval(intervalRef.current);
    setTimeLeft(seconds);
    setTotalTime(seconds);
    updateProgress(1);
  };

  const setCustomTimerFunc = () => {
    let seconds = Number(customTime);
    if (unit === "minutes") seconds *= 60;
    if (unit === "hours") seconds *= 3600;
    if (!seconds || seconds <= 0) return alert("Enter a valid time!");
    setTimer(seconds);
  };

const sessionSavedRef = useRef(false);

const startTimer = () => {
  if (timeLeft <= 0) return alert("Select a timer first!");
  clearInterval(intervalRef.current);
  sessionSavedRef.current = false; // reset for new session
  intervalRef.current = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);

        if (!sessionSavedRef.current) {
          sessionSavedRef.current = true; // ensure we save only once
          saveHistory(totalTime);
          alert("Meditation Complete! 🎵");
        }

        return 0;
      }

      updateProgress((prev - 1) / totalTime);
      return prev - 1;
    });
  }, 1000);
};


  const stopTimer = () => clearInterval(intervalRef.current);

  const updateProgress = (ratio) => {
    if (progressRef.current) {
      progressRef.current.style.strokeDashoffset = circumference * (1 - ratio);
    }
  };

  const saveHistory = (duration) => {
    const newEntry = { id: Date.now(), duration, timestamp: new Date().toISOString() };
    setHistory((prev) => [...prev, newEntry]);
  };

  const deleteHistory = (id) => setHistory((prev) => prev.filter((h) => h.id !== id));

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="meditation-container">
      <header className="meditation-header">
        <h1>🧘 Meditation & Mindfulness</h1>
        <p>Relax, meditate, and track your calm moments daily.</p>
      </header>

      <section className="meditation-card">
        <h2>Meditation Timers</h2>
        <p>
          Use these timers to structure your meditation sessions, track your progress, and stay focused
          without worrying about the clock. Select a preset duration or set a custom time for your practice.
        </p>

        <div className="timer-buttons">
          {[30, 60, 120, 300, 600, 900].map((t) => (
            <button key={t} onClick={() => setTimer(t)} className="timer-btn">
              {t >= 60 ? `${t / 60} min` : `${t} sec`}
            </button>
          ))}
        </div>

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
          <button onClick={setCustomTimerFunc} className="timer-btn">Set</button>
        </div>

        <div className="progress-ring">
          <svg width="120" height="120">
            <circle className="bg" r="60" cx="60" cy="60" stroke="#e0e0eb" strokeWidth="10" fill="none" />
            <circle
              ref={progressRef}
              className="progress"
              r="60"
              cx="60"
              cy="60"
              stroke="#8b5cf6"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="timer-display">{formatTime(timeLeft)}</div>
        <div className="timer-controls">
          <button className="timer-btn" onClick={startTimer}>Start</button>
          <button className="timer-btn" onClick={stopTimer}>Stop</button>
        </div>
      </section>

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

      <section className="meditation-card">
        <h2>Tips for Mindfulness</h2>
        <p>
          Start with 5–10 minutes daily, focus on your breathing, and gradually increase your session time.
          Be patient with yourself — mindfulness is a journey, not a race.
        </p>
      </section>

      <section className="meditation-card">
        <h2>📝 Meditation History</h2>
        <ul className="history-list">
          {history.length === 0 && <li className="text-muted">No sessions yet.</li>}
          {history.map((h) => (
            <li key={h.id} className="history-item">
              {((h.duration / 60).toFixed(1))} min session on {new Date(h.timestamp).toLocaleString()}
              <button className="delete-btn" onClick={() => deleteHistory(h.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/book-appointment">
        <button className="book-appointment-btn">Book Appointment</button>
      </Link>
    </div>
  );
};

export default Meditation;
