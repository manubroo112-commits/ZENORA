import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import { registerServiceWorker } from "./utils/pwa";

registerServiceWorker();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
      <Analytics />
  </React.StrictMode>
);
