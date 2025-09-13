// Einstiegspunkt der React-Anwendung
// Autor: Torga
import React from "react"; // React-Bibliothek
import ReactDOM from "react-dom/client"; // ReactDOM für Rendering
import App from "./App.js"; // Haupt-App-Komponente

// Erstellt Root-Element und rendert die App
const root = ReactDOM.createRoot(document.getElementById("root")); // Root-Container aus HTML
root.render(<App />); // Rendert App-Komponente in den DOM

