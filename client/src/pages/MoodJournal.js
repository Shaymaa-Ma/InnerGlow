import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MoodForm from "../components/MoodForm";
import MoodChart from "../components/MoodChart";
import EntryList from "../components/EntryList";
import QuotePopup from "../components/QuotePopup";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/MoodJournal.css";

const MoodJournal = () => {
  const { user, token } = useAuth();
  const [selectedMood, setSelectedMood] = useState("");
  const [journalText, setJournalText] = useState("");
  const [entries, setEntries] = useState([]); // logged-in user entries
  const [guestEntries, setGuestEntries] = useState([]); // guest entries
  const [editEntryId, setEditEntryId] = useState(null);
  const [quote, setQuote] = useState("");
  const [moods, setMoods] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const API = process.env.REACT_APP_API_URL;
  // Load moods, quotes, and entries
  useEffect(() => {
    axios.get(`${API}/api/moods`).then((res) => setMoods(res.data));
    axios.get(`${API}/api/quotes`).then((res) => setQuotes(res.data));

    if (user) fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${API}/api/journal-entries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!selectedMood) return alert("Please select a mood!");

    if (user) {
      try {
        let res;
        if (editEntryId) {
          res = await axios.put(
            `${API}/api/journal-entries/${editEntryId}`,
            { mood: selectedMood, text: journalText },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setEditEntryId(null);
        } else {
          res = await axios.post(
            `${API}/api/journal-entries`, 
            { mood: selectedMood, text: journalText },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setEntries(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to save entry.");
      }
    } else {
      const newEntry = {
        id: Date.now(),
        mood: selectedMood,
        text: journalText,
        datetime: new Date().toISOString(),
      };

      if (editEntryId) {
        setGuestEntries((prev) =>
          prev.map((entry) => (entry.id === editEntryId ? { ...entry, ...newEntry } : entry))
        );
        setEditEntryId(null);
      } else {
        setGuestEntries((prev) => [...prev, newEntry]);
      }
    }

    setSelectedMood("");
    setJournalText("");
  };

  const handleEdit = (entry) => {
    setSelectedMood(entry.mood);
    setJournalText(entry.text);
    setEditEntryId(entry.id);
  };

  const handleDelete = (entry) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    if (user) {
     axios.delete(`${API}/api/journal-entries/${entry.id}`, {
        })
        .then((res) => setEntries(res.data))
        .catch((err) => {
          console.error(err);
          alert("Failed to delete entry.");
        });
    } else {
      setGuestEntries((prev) => prev.filter((e) => e.id !== entry.id));
    }
  };

  const generateQuote = () => {
    if (!quotes.length) return;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random.quote);
  };

  return (
    <div className="mood-journal-page py-5">
      <div className="container">
        <h2 className="text-center mb-4 text-white">Mood & Journal Tracker</h2>

        <div className="row mb-4">
          <div className="col-lg-6 mb-3">
            <MoodForm
              selectedMood={selectedMood}
              setSelectedMood={setSelectedMood}
              journalText={journalText}
              setJournalText={setJournalText}
              handleSave={handleSave}
              generateQuote={generateQuote}
              editEntryId={editEntryId}
              moods={moods}
            />
          </div>
          <div className="col-lg-6 mb-3">
            <MoodChart entries={[...guestEntries, ...entries]} moods={moods} />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <EntryList
              entries={[...guestEntries, ...entries]}
              moods={moods}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
        </div>

        <QuotePopup quote={quote} onAnimationEnd={() => setQuote("")} />
      </div>

      <Link to="/book-appointment">
        <button className="book-appointment-btn">Book Appointment</button>
      </Link>
    </div>
  );
};

export default MoodJournal;
