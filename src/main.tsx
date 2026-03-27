import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import './i18n';

const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
