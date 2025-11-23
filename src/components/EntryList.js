
import React from "react";
import { moods } from "../data/moodData";

const EntryList = ({ entries, handleEdit, handleDelete }) => {
  return (
    <div className="card card-entries p-3">
      <h5 className="card-title">Your Entries</h5>
      {entries.length === 0 ? (
        <p className="text-white">No entries yet.</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {entries.map((entry, idx) => (
            <li key={idx} className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
              <div>
                <strong className="entry-text">
                  {entry.datetime} - {moods.find(m => m.label === entry.mood).emoji} {entry.mood}
                </strong>
                <p className="mb-0 entry-text">{entry.text}</p>
              </div>
              <div>
                <button className="btn btn-violet btn-sm me-2" onClick={() => handleEdit(idx)}>Edit</button>
                <button className="btn btn-cyan btn-sm" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntryList;
