import React from "react";

const EntryList = ({ entries, moods, handleEdit, handleDelete }) => {
  return (
    <div className="card card-entries p-3">
      <h5 className="card-title">Your Entries</h5>
      {entries.length === 0 ? (
        <p className="text-white">No entries yet.</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {entries.map((entry) => {
            const moodObj = moods.find((m) => m.label === entry.mood);
            return (
              <li
                key={entry.id}
                className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary"
              >
                <div>
                  <strong className="entry-text">
                    {new Date(entry.datetime).toLocaleString()} -{" "}
                    {moodObj?.emoji} {entry.mood}
                  </strong>
                  <p className="mb-0 entry-text">{entry.text}</p>
                </div>
                <div>
                  <button
                    className="btn btn-violet btn-sm me-2"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-cyan btn-sm"
                    onClick={() => handleDelete(entry)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default EntryList;
