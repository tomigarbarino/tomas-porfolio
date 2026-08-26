import React from "react";
import "./styles/design-tokens.css";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import TrainlyCaseStudy from "./pages/TrainlyCaseStudy";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/trainly" element={<TrainlyCaseStudy />} />
        <Route path="/trainyl" element={<Navigate to="/trainly" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
