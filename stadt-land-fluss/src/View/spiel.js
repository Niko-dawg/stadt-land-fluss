import React, { useState, useEffect } from "react";
import "./spiel.css";
import { Header } from "../components/Header.js";
import { useNavigate } from "react-router-dom";


/* Emilia */
export function Spiel() {
  const navigate = useNavigate();

  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const [secondsLeft, setSecondsLeft] = useState(60);
  const [currentLetter, setCurrentLetter] = useState("");
  const [recentLetters, setRecentLetters] = useState([]); // Letzte 5 Buchstaben

  // States für Eingabefelder
  const [stadt, setStadt] = useState("");
  const [land, setLand] = useState("");
  const [fluss, setFluss] = useState("");
  const [tier, setTier] = useState("");

  // Funktion: wähle zufälligen Buchstaben, der nicht in recentLetters ist
  const getRandomLetter = () => {
    const availableLetters = ALPHABET.filter(
      (letter) => !recentLetters.includes(letter)
    );
    if (availableLetters.length === 0) {
      setRecentLetters([]);
      return ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    const randomIndex = Math.floor(Math.random() * availableLetters.length);
    return availableLetters[randomIndex];
  };

  // Starte Timer und setze Buchstabe am Anfang jeder Runde
  useEffect(() => {
    if (secondsLeft === 60) {
      const newLetter = getRandomLetter();
      setCurrentLetter(newLetter);

      setRecentLetters((prev) => {
        const updated = [...prev, newLetter];
        if (updated.length > 5) updated.shift();
        return updated;
      });
    }
   
    if (secondsLeft <= 0) return; // Timer stoppen bei 0

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [secondsLeft]);

  // Wenn sich currentLetter ändert, Inputs mit neuem Buchstaben vorbefüllen
  useEffect(() => {
    setStadt(currentLetter);
    setLand(currentLetter);
    setFluss(currentLetter);
    setTier(currentLetter);
  }, [currentLetter]);

  // Funktion zum Speichern und Weitergeben der Antworten
  const handleSubmit = () => {
    const antworten = {
      stadt,
      land,
      fluss,
      tier,
      buchstabe: currentLetter,
    };

    fetch("../../model/points/router.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"},
      body: JSON.stringify(antworten)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Erfolg:", data);
    })
    .catch((error) => {
      console.error("Fehler:", error);
    });

    console.log("Antworten gespeichert:", antworten);

    // Hier kannst du die Daten weiterverarbeiten, z.B. an API senden
    processAnswers(antworten);

    // Timer neu starten
    setSecondsLeft(60);
  };

  const processAnswers = (data) => {
    // Beispiel: Datenverarbeitung
    console.log("Verarbeite Antworten:", data);
  };

  const customButtons = [
    {
      text: "Home",
      className: "homeBtn",
      title: "Home",
      onClick: () => navigate('/')
    }
  ];

  return (
    <div className="container">
      <Header 
        showLogin={false} 
        showAdmin={false} 
        customButtons={customButtons}
      />
      <div className="secondheader">
        <div className="timer">{secondsLeft}</div>
        <div className="letter"> 
          <p>Der gesuchte Buchstabe ist :</p>
          <div className="big-letter">{currentLetter}</div>
        </div>
      </div>
      <div className="game-grid">
        <div className="input-row">
          <div className="background-image bg-1"></div>
          <label>Stadt</label>
          <input type="text" value={stadt} onChange={e => setStadt(e.target.value)} />
        </div>
        <div className="input-row">
          <div className="background-image bg-2"></div>
          <label>Land</label>
          <input type="text" value={land} onChange={e => setLand(e.target.value)} />
        </div>
        <div className="input-row">
          <div className="background-image bg-3"></div>
          <label>Fluss</label>
          <input type="text" value={fluss} onChange={e => setFluss(e.target.value)} />
        </div>
        <div className="input-row">
          <div className="background-image bg-4"></div>
          <label>Tier</label>
          <input type="text" value={tier} onChange={e => setTier(e.target.value)} />
        </div>
      </div>

      <button className="AntwortBtn" onClick={handleSubmit}>Antworten abgeben</button>

      <div className="players-finished">
        fertige Spieler <span>1/3</span>
      </div>
    </div>
  );
}