import React, { useState, useEffect } from "react";
import "./spiel.css";
import { Header } from "../components/Header.js";
import { useNavigate } from "react-router-dom";

/* Emilia */
export function Spiel() {
  const navigate = useNavigate();
  
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