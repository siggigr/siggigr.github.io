import React from "react";
import ReactDOM from "react-dom/client";
import AgentsPage from "./AgentsPage";
import "./styles/global.css";
import "./styles/cv-dark.css"; // same dark tokens, top bar and background as the CV page
import "./styles/agents.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AgentsPage />
  </React.StrictMode>
);
