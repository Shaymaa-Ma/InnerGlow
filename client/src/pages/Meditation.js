import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/Meditation.css";

const Meditation = () => {
  const { user, token } = useAuth();
  const API = process.env.REACT_APP_API_URL;

  const circumference = 2 * Math.PI * 60;
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [customTime, setCustomTime] = useState("");
  const [unit, setUnit] = useState("seconds");
  const [dashOffset, setDashOffset] = useState(circumference);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [history, setHistory] = useState([]);
  const [guestHistory, setGuestHistory] = useState([]);
  const [videos, setVideos] = useState([]);

  // Scroll to top on load
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  // Fetch videos
  useEffect(() => {
    axios.get(`${API}/api/meditation/meditation-videos`)
      .then(res => setVideos(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch user history
  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/api/meditation-history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const formatted = res.data.map(h => ({ ...h, timestamp: new Date(h.timestamp).toLocaleString() }));
        setHistory(formatted);
      })
      .catch(err => console.error(err));
  }, [user]);

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      const newTime = timeLeft - 1;
      setTimeLeft(newTime);
      setDashOffset(circumference * (newTime / totalTime));
      if (newTime === 0 && !sessionCompleted) {
        alert("Meditation Complete! 🎵");
        saveHistory(totalTime);
        setSessionCompleted(true);
        setIsRunning(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, totalTime, isRunning, sessionCompleted]);

  const setTimer = (seconds) => {
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setDashOffset(circumference);
    setSessionCompleted(false);
    setIsRunning(false);
  };

  const setCustomTimerFunc = () => {
    let seconds = Number(customTime);
    if (unit === "minutes") seconds *= 60;
    if (unit === "hours") seconds *= 3600;
    if (!seconds || seconds <= 0) return alert("Enter a valid time!");
    setTimer(seconds);
  };

  const startTimer = () => {
    if (timeLeft <= 0) return alert("Select a timer first!");
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setDashOffset(circumference);
  };

  const saveHistory = (duration) => {
    if (user) {
      axios.post(`${API}/api/meditation-history`, { duration }, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const newEntry = { id: res.data.id, duration: res.data.duration, timestamp: new Date(res.data.timestamp).toLocaleString() };
          setHistory(prev => [newEntry, ...prev]);
        })
        .catch(err => console.error(err));
    } else {
      const newGuestEntry = { id: Date.now(), duration, timestamp: new Date().toLocaleString() };
      setGuestHistory(prev => [newGuestEntry, ...prev]);
    }
  };

  const deleteHistory = (entry) => {
    if (user) {
      axios.delete(`${API}/api/meditation-history/${entry.id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => setHistory(prev => prev.filter(h => h.id !== entry.id)))
        .catch(err => console.error(err));
    } else {
      setGuestHistory(prev => prev.filter(h => h.id !== entry.id));
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const combinedHistory = [...guestHistory, ...history];

  return (
    <div className="meditation-container">
      <header className="meditation-header">
        <h1>🧘 Meditation & Mindfulness</h1>
        <p>Relax, meditate, and track your calm moments daily.</p>
      </header>

      {/* Timer */}
      <section className="meditation-card">
        <h2>Meditation Timers</h2>
        <div className="timer-buttons">
          {[30, 60, 120, 300, 600, 900].map(t => (
            <button key={t} onClick={() => setTimer(t)} className="timer-btn">{t >= 60 ? `${t / 60} min` : `${t} sec`}</button>
          ))}
        </div>
        <div className="custom-timer">
          <input type="number" placeholder="Enter time" value={customTime} onChange={e => setCustomTime(e.target.value)} />
          <select value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
          <button onClick={setCustomTimerFunc} className="timer-btn">Set</button>
        </div>
        <div className="progress-ring">
          <svg width="120" height="120">
            <circle r="60" cx="60" cy="60" stroke="#e0e0eb" strokeWidth="10" fill="none" />
            <circle r="60" cx="60" cy="60" stroke="#8b5cf6" strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" />
          </svg>
        </div>
        <div className="timer-display">{formatTime(timeLeft)}</div>
        <div className="timer-controls">
          <button className="timer-btn" onClick={startTimer}>Start</button>
          <button className="timer-btn" onClick={stopTimer}>Stop</button>
        </div>
      </section>

      {/* Videos */}
      <section className="meditation-card">
        <h2>Guided Meditation Videos</h2>
        <div className="videos-grid">
          {videos.map(v => (
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

      {/* History */}
      <section className="meditation-card">
        <h2>📝 Meditation History</h2>
        <ul className="history-list">
          {combinedHistory.length === 0 && <li>No sessions yet.</li>}
          {combinedHistory.map(h => (
            <li key={h.id}>
              {(h.duration / 60).toFixed(1)} min — {h.timestamp}
              <button className="delete-btn" onClick={() => deleteHistory(h)}>Delete</button>
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
