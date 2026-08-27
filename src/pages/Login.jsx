import { useState } from "react";
import { login } from "../state/auth";
import ThemeSwitch from "../components/ThemeSwitch";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const session = login(username, password);
    if (!session) {
      setError("Wrong username or password.");
      return;
    }
    onLogin(session);
  }

  return (
    <div className="page login-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Circuit analysis</p>
          <h1>Circuito</h1>
        </div>
        <ThemeSwitch />
      </header>
      <form className="login-card" onSubmit={submit}>
        <h2>Log in</h2>
        <p className="login-hint">Student: student1 / password</p>
        <p className="login-hint">Admin: admin / meowmeow</p>
        <label>
          Username
          <input
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <p className="login-error">{error}</p> : null}
        <button type="submit" className="primary">
          Log in
        </button>
      </form>
    </div>
  );
}
