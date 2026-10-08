import React from "react";
import ReactDOM from "react-dom/client";
import CVPage from "./CVPage";
import "./styles/global.css";
import "./styles/cv-dark.css"; // dark theme on screen; print stays light

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CVPage />
  </React.StrictMode>
);
