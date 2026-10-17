import React from "react";
import ReactDOM from "react-dom/client";
import NotFoundPage from "./NotFoundPage";
import "./styles/global.css";
import "./styles/cv-dark.css"; // same dark tokens, top bar and background as the CV page
import "./styles/agents.css"; // panel and section styles of the agents page

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NotFoundPage />
  </React.StrictMode>
);
