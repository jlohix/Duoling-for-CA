import { useState } from "react";
import { todayKey } from "../state/progress";
import {
  addChangeLog,
  listChangeLogs,
  removeChangeLog,
} from "../state/changelog";

export default function Updates({ canEdit = false }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(() => todayKey());
  const [logs, setLogs] = useState(() => listChangeLogs());

  function submit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    addChangeLog({ title, body, date });
    setLogs(listChangeLogs());
    setTitle("");
    setBody("");
    setDate(todayKey());
  }

  function remove(id) {
    removeChangeLog(id);
    setLogs(listChangeLogs());
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">{canEdit ? "Staff" : "Help"}</p>
          <h1>Updates</h1>
        </div>
      </header>
      <p className="focus-line">
        {canEdit
          ? "Add a note when you ship a change. Built-in notes also get added from coding chat when a student-facing feature ships. Students see this list as read-only. Built-in notes cannot be deleted."
          : "What's new in Circuito. Notes appear here when the app is updated."}
      </p>

      {canEdit ? (
        <form className="profile-block change-form" onSubmit={submit}>
          <h2>Add a change</h2>
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What changed?"
              required
            />
          </label>
          <label>
            Notes
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Optional details"
            />
          </label>
          <button type="submit" className="primary">
            Add to log
          </button>
        </form>
      ) : null}

      <ol className="change-log">
        {logs.map((entry) => (
          <li key={entry.id} className="profile-block change-item">
            <div className="change-head">
              <p className="eyebrow">{entry.date}</p>
              {canEdit ? (
                entry.custom ? (
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => remove(entry.id)}
                  >
                    Remove
                  </button>
                ) : (
                  <span className="login-hint">Built in</span>
                )
              ) : null}
            </div>
            <h2>{entry.title}</h2>
            {entry.body ? <p>{entry.body}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

