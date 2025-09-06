import React from "react";
import "./spiel.css";
import { Header } from "../components/Header.js";
import { useNavigate, useParams } from "react-router-dom";

/* Emilia */
export function Spiel() {
  const navigate = useNavigate();
  // TODO: Später URL-Parameter für Single/Multiplayer nutzen
  
  return (
      <div className="container">
        <Header 
          showLogin={false} 
          showAdmin={false}
          showHome={true}
        />
        <div className="secondheader">
        <div className="timer">60</div>
        <div className="letter"> 
          <p>Der gesuchte Buchstabe ist :</p>
          <div className="big-letter">A</div>
        </div>
    </div>
        <div className="game-grid">
          <div className="input-row">
            <div className="background-image bg-1"></div>
            <label>Stadt</label>
            <input type="text" defaultValue="Aachen" />
          </div>
          <div className="input-row">
            <div className="background-image bg-2"></div>
            <label>Land</label>
            <input type="text" defaultValue="Australien" />
          </div>
          <div className="input-row">
            <div className="background-image bg-3"></div>
            <label>Fluss</label>
            <input type="text" defaultValue="Ahr" />
          </div>
          <div className="input-row">
            <div className="background-image bg-4"></div>
            <label>Tier</label>
            <input type="text" defaultValue="Affe" />
          </div>
        </div>

        <button className="AntwortBtn">Antworten abgeben</button>

        <div className="players-finished">
          fertige Spieler <span>1/3</span>
        </div>
      </div>
    );
}