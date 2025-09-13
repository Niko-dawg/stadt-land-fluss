//===================================================================
// REACT ENTRY POINT - Haupteinstiegspunkt der React Application
//===================================================================
// Autor: Torga Aslan
//
// Beschreibung: React DOM Rendering Setup 
// - React 18 createRoot API für Concurrent Features
// - App Component Mount ins HTML root-Element
// - Entry Point für Webpack Bundle
//===================================================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";

//===================================================================
// REACT DOM RENDERING - App Mount Point
//===================================================================

// React 18 Root Creation - Aktiviert Concurrent Features
const root = ReactDOM.createRoot(document.getElementById("root")); // HTML root-Container

// App Component Rendering - Mount Main App ins DOM
root.render(<App />); // React App startet hier

