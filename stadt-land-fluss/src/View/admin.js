import React from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";

export default function AdminUserVerwaltung() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminRolle, setAdminRolle] = React.useState("");
  const [adminPasswort, setAdminPasswort] = React.useState("");
  const [adminBenutzername, setAdminBenutzername] = React.useState("");

  // Beispiel: statische Benutzerdaten
  const adminBenutzerListe = [
    { name: "Testnutzer", id: "247147" },
    { name: "TorgerLocker", id: "456789" },
  ];

  return (
    <div className="adminContainer">
      <header className="adminHeader">
        Admin User Verwaltung
        <button className="adminButtonHome" onClick={() => navigate('/')}>Home</button>
      </header>

      <div className="adminMain">
        {/* Benutzer Liste */}
        <section className="adminUserListSection">
          <button className="adminButtonBenutzerAnzeigen">
            Benutzer Anzeigen
          </button>
          <div className="adminUserListContainer">
            {adminBenutzerListe.map((benutzer) => (
              <p key={benutzer.id}>
                {benutzer.name} : {benutzer.id}
              </p>
            ))}
          </div>
        </section>

        {/* Benutzer Verwalten */}
        <section className="adminUserManageSection">
          <h2 className="adminManageTitle">Benutzer Verwalten</h2>

          <input
            type="text"
            placeholder="email"
            className="adminInput"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
          />


          <select
            className="adminInput"
            value={adminRolle}
            onChange={(e) => setAdminRolle(e.target.value)}
          >
            <option value="">Rolle wählen</option>
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>


          <input
            type="password"
            placeholder="Passwort"
            className="adminInput"
            value={adminPasswort}
            onChange={(e) => setAdminPasswort(e.target.value)}
          />

          <input
            type="text"
            placeholder="Benutzer Name"
            className="adminInput"
            value={adminBenutzername}
            onChange={(e) => setAdminBenutzername(e.target.value)}
          />

          <button className="adminButton">Benutzer Anlegen</button>

          <button className="adminButton">Suchen</button>

          <button className="adminButton">Benutzer Löschen</button>

          <button className="adminButton">Ändern</button>
            <div className="adminCategories">
            <div className="adminCategoryItem">
                <label className="adminCategoryLabel">
                <input type="checkbox" className="adminCategoryCheckbox" defaultChecked />
                Stadt
                </label>
            </div>
            <div className="adminCategoryItem">
                <label className="adminCategoryLabel">
                <input type="checkbox" className="adminCategoryCheckbox" defaultChecked />
                Land
                </label>
            </div>
            <div className="adminCategoryItem">
                <label className="adminCategoryLabel">
                <input type="checkbox" className="adminCategoryCheckbox" defaultChecked />
                Fluss
                </label>
            </div>
            <div className="adminCategoryItem">
                <label className="adminCategoryLabel">
                <input type="checkbox" className="adminCategoryCheckbox" />
                Tier
                </label>
            </div>
            </div>

          <button className="adminButton adminButtonWide">neues Wort Anlegen</button>

          <input
            type="text"
            className="adminText"
            value="Lamur"
            readOnly
          />
        </section>
      </div>
    </div>
  );
}