import React from "react";
import ReactDOM from "react-dom/client";
import CVPage from "./CVPage";
import "./styles/global.css";
import "./styles/glass.css"; // EXPERIMENT: glassmorphism theme

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CVPage />
  </React.StrictMode>
);
