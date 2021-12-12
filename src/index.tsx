import React from "react";
import ReactDOM from "react-dom";

import reportWebVitals from "./reportWebVitals";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./assets/locales/en.json";
import * as pl from "./assets/locales/pl.json";

import "./index.css";
import App from "./App";
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en.translation },
    pl: {
      translation: pl.translation,
    },
  },
  lng: "en",
  fallbackLng: "en",
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
