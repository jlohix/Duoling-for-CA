import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ThemeProvider } from "./state/theme.jsx";

const root = document.getElementById("root");

if (window.location.protocol === "file:") {
  root.innerHTML = `
    <div class="boot">
      <h1>Circuito needs the dev server</h1>
      <p>Do not open index.html directly. In a terminal, run <code>npm run dev</code>, then visit <a href="http://127.0.0.1:5173">http://127.0.0.1:5173</a>.</p>
    </div>
  `;
} else {
  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
