import React from "react";
import "./spiel.css";

export class Spiel extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="header">
          <div className="logo">SLF!</div>
          <div className="timer">60</div>
        </div>

        <div className="letter">
          <p>Der Gesuchte Buchstabe ist :</p>
          <div className="big-letter">A</div>
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

        <button>Antworten Abgeben</button>

        <div className="players-finished">
          fertige Spieler <span>1/3</span>
        </div>
      </div>
    );
  }
}