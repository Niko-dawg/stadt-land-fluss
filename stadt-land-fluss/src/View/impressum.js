import React from 'react';
import './impressum.css'; 
import logo from './img/Logo.png'; 
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header.js';

/* Autoren Emilia */
const Impressum = () => {
  const navigate = useNavigate();
  
  const customButtons = [
    {
      text: "Home",
      className: "homeBtn",
      title: "Home", 
      onClick: () => navigate('/')
    }
  ];

  const contacts = [
    {
      imgAlt: 'Foto Emilia Lohmann',
      name: 'Emilia Lohmann',
      company: 'Statistisches Bundesamt',
      email: 'emilialohmann03@gmail.com',
    },
    {
      imgAlt: 'Foto Torga',
      name: 'Caner Torga Aslan',
      company: 'Vodafone',
      email: 'torgaaslan@gmail.com',
    },
    {
      imgAlt: 'Foto Nikolas Zimmer',
      name: 'Nikolas Zimmer',
      company: 'Bundeskriminalamt',
      email: 'Nikolas@gmail.com',
    },
  ];

  return (
    <div className="impressum-container">

      <Header 
              showLogin={false} 
              showAdmin={false} 
              showHighscore={false}
              showHelp={false}
              showImpressum={false}
              customButtons={customButtons}
            />

      <h1>Impressum</h1>
      <p>Dieses Spiel ist ein nicht-kommerzielles Schulprojekt.</p>

      <div className="contacts">
        {contacts.map(({ imgAlt, name, company, email }, index) => (
          <div key={index} className="contact-card">
            <div className="photo-placeholder" aria-label={imgAlt}>
              Foto : img
            </div>
            <p><strong>Erstellt von:</strong> {name}</p>
            <p><strong>Firma:</strong> {company}</p>
            <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
          </div>
        ))}
      </div>

      <div className="additional-info">
        <p><strong>Auftraggeber:</strong> Brühlwiesenschule Hofheim</p>
        <p><strong>Ort:</strong> Frankfurt am Main Hofheim</p>
        <p><strong>Hinweis:</strong> Dieses Projekt dient ausschließlich Lern- und Demonstrationszwecken.</p>
        <p>Es besteht kein Anspruch auf Vollständigkeit, Verfügbarkeit oder Support.</p>
      </div>
    </div>
  );
};

export default Impressum;