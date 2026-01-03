import React from "react";

const MoodForm = ({
  selectedMood,
  setSelectedMood,
  journalText,
  setJournalText,
  handleSave,
  generateQuote,
  editEntryId,
  moods,
}) => {
  return (
    <div className="card card-entry h-100 p-3">
      <h5 className="card-title">Log Your Mood & Journal</h5>
      <form>
        <div className="mb-3">
          <label className="form-label text-white">
            Mood <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            required
          >
            <option value="">Select Mood</option>
            {moods.map((m) => (
              <option key={m.id} value={m.label}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Journal Entry (optional)</label>
          <textarea
            className="form-control"
            rows={4}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
          />
        </div>

        <div className="d-flex flex-wrap">
          <button type="button" className="btn btn-violet me-2 mb-2" onClick={handleSave}>
            {editEntryId ? "Update Entry" : "Save Entry"}
          </button>
          <button type="button" className="btn btn-cyan mb-2" onClick={generateQuote}>
            Generate Quote
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoodForm;
