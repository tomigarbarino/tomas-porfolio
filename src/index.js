import React from "react";
import "./styles/design-tokens.css";
import "./index.css";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import TrainlyCaseStudy from "./pages/TrainlyCaseStudy";
import { LanguageProvider } from "./contexts/LanguageContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const rootElement = document.getElementById("root");
const application = (
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/en" element={<App />} />
          <Route path="/trainly" element={<TrainlyCaseStudy />} />
          <Route path="/en/trainly" element={<TrainlyCaseStudy />} />
          <Route path="/es" element={<Navigate to="/" replace />} />
          <Route path="/es/trainly" element={<Navigate to="/trainly" replace />} />
          <Route path="/trainyl" element={<Navigate to="/trainly" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, application);
} else {
  createRoot(rootElement).render(application);
}
