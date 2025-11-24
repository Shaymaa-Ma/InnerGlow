// pages/MoodJournal.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MoodForm from "../components/MoodForm";
import MoodChart from "../components/MoodChart";
import EntryList from "../components/EntryList";
import QuotePopup from "../components/QuotePopup";
import "../styles/MoodJournal.css";
import { quotes } from "../data/moodData";

const MoodJournal = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [journalText, setJournalText] = useState("");
  const [entries, setEntries] = useState([]); // Now memory only
  const [editIndex, setEditIndex] = useState(null);
  const [quote, setQuote] = useState("");

  const handleSave = () => {
    if (!selectedMood) {
      alert("Please select a mood before saving!");
      return;
    }

    const newEntry = {
      mood: selectedMood,
      text: journalText,
      datetime: new Date().toLocaleString(),
    };

    if (editIndex !== null) {
      const updated = [...entries];
      updated[editIndex] = newEntry;
      setEntries(updated);
      setEditIndex(null);
    } else {
      setEntries([newEntry, ...entries]);
    }

    setSelectedMood("");
    setJournalText("");
  };

  const handleEdit = (idx) => {
    setSelectedMood(entries[idx].mood);
    setJournalText(entries[idx].text);
    setEditIndex(idx);
  };

  const handleDelete = (idx) => {
    setEntries(entries.filter((_, i) => i !== idx));
  };

  const generateQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
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
              editIndex={editIndex}
            />
          </div>

          <div className="col-lg-6 mb-3">
            <MoodChart entries={entries} />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <EntryList
              entries={entries}
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
