import React from "react";
import "./spiel.css";

export class Spiel extends React.Component {
/*
    handleSinglePlayer = () => {
    alert("Single Player ausgewählt!");
  };

  handleMultiPlayer = () => {
    alert("Multiplayer ausgewählt!");
  };
*/
  render() {
    return (
        <div>Hello World</div>
     /*
     <div style={{ backgroundColor: "#fcf8ed", minHeight: "100vh", padding: "10px" }}>
        <Header />
        <GameMode title="Single Player" onClick={this.handleSinglePlayer} />
        <GameMode title="Multiplayer" players={4} onClick={this.handleMultiPlayer} />
      </div>
      */
    );
  }
}