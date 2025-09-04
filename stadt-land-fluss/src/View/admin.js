import React from "react";
import "./admin.css";
import { Test } from "./home.js";
import ReactDOM from "react-dom/client";

export default function AdminUserVerwaltung() {
    const [adminEmail, setAdminEmail] = React.useState("");
    const [adminRolle, setAdminRolle] = React.useState("");
    const [adminPasswort, setAdminPasswort] = React.useState("");
    const [adminBenutzername, setAdminBenutzername] = React.useState("");
    const [adminWort, setAdminWort] = React.useState("");
    const [adminCategory, setAdminCategory] = React.useState("Stadt");

    // Beispiel: statische Benutzerdaten
    const adminBenutzerListe = [
        { name: "Testnutzer", id: "247147" },
        { name: "TorgerLocker", id: "456789" },
    ];

    return (
        <div className="adminContainer">
            <header className="adminHeader">
                Admin User Verwaltung
                <button className="adminButtonHome" onClick={() => ReactDOM.createRoot(document.getElementById("root")).render(<Test />)}>Home</button>
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
                    <div className="adminButtonGroupSpacer">
                        <button className="adminButton">Benutzer Anlegen</button>
                        <button className="adminButton">Suchen</button>
                        <button className="adminButton">Benutzer Löschen</button>
                    </div>

                    <br />

                    <div className="adminCategoriesRow">
                        <div className="adminCategories" role="radiogroup" aria-label="Kategorie wählen">
                            {["Stadt", "Land", "Fluss", "Tier"].map((cat) => (
                                <div className="adminCategoryItem" key={cat}>
                                    <input
                                        type="radio"
                                        name="adminCategory"
                                        className="adminCategoryCheckbox"
                                        id={`adminCategory-${cat}`}
                                        checked={adminCategory === cat}
                                        onChange={() => setAdminCategory(cat)}
                                        aria-checked={adminCategory === cat}
                                        aria-label={cat}
                                    />
                                    <label className="adminCategoryLabel" htmlFor={`adminCategory-${cat}`}>{cat}</label>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="adminTextWort"
                            value={adminWort}
                            onChange={(e) => setAdminWort(e.target.value)}
                            aria-label=" Wort"
                            placeholder=" Wort"
                        />
                        <button
                            className="adminButtonWide"
                            aria-label="Wort anlegen"
                        >
                             Wort anlegen
                        </button>
                        <button
                            className="adminButtonWide"
                            aria-label=" Wort löschen"
                        >
                             Wort löschen
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}