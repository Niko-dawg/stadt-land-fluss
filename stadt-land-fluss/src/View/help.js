import React from "react";
import ReactDOM from "react-dom/client";
import "./help.css";
import logo from "./img/Logo.png"; // Beispiel-Logo, bitte eigenes Logo hier einfügen

/* Emilia */
export default function HelpPage() {
  return (
    <div className="help-page">
      <header className="help-header">
        <div className="logo-container" aria-label="Stadt.Land.Fluss Logo">
          <img src={logo} alt="Stadt.Land.Fluss Logo" className="logo" />
          <span className="logo-text">Stadt.Land.Fluss</span>
        </div>
        <button
          className="home-button"
          onClick={() => window.location.href = "/"}
          aria-label="Zur Startseite"
        >
          Home
        </button>
      </header>

      <main className="help-content">
        <h1>Willkommen bei <strong>Stadt.Land.Fluss!</strong></h1>
        <p>
          Dein schnelles Wortspiel für Stadt–Land–Fluss – alleine oder gegen andere. Diese Anleitung erklärt dir kurz und einfach alles Wichtige.
        </p>
        <hr />

        <section>
          <h2>1. Ziel des Spiels</h2>
          <p>
            Finde zu vorgegebenen Kategorien passende Wörter, die <strong>mit demselben Anfangsbuchstaben</strong> starten. Sammle Punkte, klettere in die Highscore-Liste und hab Spaß – fair, schnell und barrierefrei.
          </p>
        </section>

        <hr />

        <section>
          <h2>2. Voraussetzungen &amp; Login</h2>
          <ul>
            <li><strong>Account einloggen :</strong> Loge dich mit deiner <strong>E‑Mail</strong> und einem <strong>Passwort ein</strong>.</li>
            <li><strong>Freischaltung:</strong> Neue Accounts werden von Admins freigeschaltet. Danach kannst du sofort loslegen.</li>
            <li><strong>Datenschutz:</strong> Wir speichern Passwörter <strong>verschlüsselt</strong>.</li>
          </ul>
          <blockquote>
            <strong>Tipp:</strong> Passwort sicher aufbewahren und nicht weitergeben.
          </blockquote>
        </section>

        <hr />

        <section>
          <h2>3. Spielstart &amp; Lobbys</h2>
          <ul>
            <li><strong>Sofortstart:</strong> Nach dem Einloggen kommst du direkt ins Spiel.</li>
            <li><strong>Laufende Runde:</strong> Läuft bereits eine Runde, steigst du <strong>ab der nächsten Runde</strong> ein.</li>
            <li><strong>Solo oder Multiplayer:</strong> Du kannst alleine üben oder mit anderen gleichzeitig spielen.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>4. Rundenablauf (60 Sekunden)</h2>
          <ol>
            <li><strong>Zufallsbuchstabe</strong>: Für alle Kategorien gilt derselbe Anfangsbuchstabe.</li>
            <li><strong>Kategorien</strong>:
              <ul>
                <li><strong>Stadt</strong>, <strong>Land</strong>, <strong>Fluss</strong>, <strong>Tier</strong></li>
              </ul>
            </li>
            <li><strong>Eingabe</strong>: Tippe deine Wörter in die Felder.
              <ul>
                <li><strong>Nicht case‑sensitiv</strong>: Groß-/Kleinschreibung ist egal.</li>
                <li><strong>Ähnlichkeitsprüfung</strong>: Schreibfehler sind ok (≈ <strong>80–100 %</strong> Match). Beispiele: <code>wahl</code> zählt als <strong>Wal</strong> (Tier), <code>Schanghei</code> als <strong>Shanghai</strong> (Stadt).</li>
              </ul>
            </li>
            <li><strong>Zeitlimit</strong>: Du hast <strong>60 Sekunden</strong> pro Runde.</li>
            <li><strong>Abgabe</strong>: Sende deine Lösungen spätestens zum Ablauf der Zeit (automatisch bei Zeitende).</li>
          </ol>
        </section>

        <hr />

        <section>
          <h2>5. Bewertung &amp; Punkte</h2>
          <ul>
            <li><strong>Datenbankabgleich</strong>: Das System prüft, ob dein Wort existiert.</li>
            <li><strong>Mehrfachnennungen</strong>: Haben mehrere Spieler dasselbe korrekte Wort, gibt es <strong>weniger Punkte</strong>.</li>
            <li><strong>Alleiniges Wort</strong>: Ein <strong>einzigartig</strong> korrektes Wort bringt <strong>mehr Punkte</strong>.</li>
            <li><strong>Unbekannte Wörter</strong>: Ist ein Wort nicht in der DB, startet eine <strong>Abstimmung</strong>:
              <ul>
                <li>Alle Spieler stimmen ab, ob das Wort gültig ist.</li>
                <li>Bei Mehrheit <strong>Ja</strong>: Das Wort zählt und wird ggf. aufgenommen.</li>
              </ul>
            </li>
            <li><strong>Rundenpunkte</strong>: Summe aus allen gültigen Eingaben.</li>
          </ul>
          <blockquote>
            <strong>Fair Play:</strong> Keine beleidigenden, rassistischen oder ungeeigneten Begriffe. Verstöße können gesperrt werden.
          </blockquote>
        </section>

        <hr />

        <section>
          <h2>6. Highscores</h2>
          <ul>
            <li><strong>Anzeigen</strong>: Vor und nach dem Spiel siehst du die <strong>Bestenliste</strong>.</li>
            <li><strong>Speicherung</strong>: Highscores werden <strong>datenbankbasiert</strong> und dauerhaft gespeichert.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>7. Bedienung – so nutzt du die Oberfläche</h2>
          <ul>
            <li><strong>Responsive Design</strong>: Funktioniert auf <strong>Smartphone, Tablet, PC</strong>.</li>
            <li><strong>Barrierefreiheit</strong>:
              <ul>
                <li>Klare Kontraste, skalierbare Schrift, Screenreader‑Labels.</li>
                <li>Statusmeldungen (Zeit, Fehler, Erfolge) sind <strong>visuell &amp; sprachlich</strong> erkennbar.</li>
              </ul>
            </li>
            <li><strong>Speichern</strong>: Deine Runde wird automatisch gespeichert, sobald du abgibst.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>8. Dein Profil</h2>
          <ul>
            <li><strong>Name/Avatar</strong> anpassen (optional).</li>
            <li><strong>Passwort ändern</strong>.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>9. Moderation &amp; Sicherheit</h2>
          <ul>
            <li><strong>User‑Rollen</strong>: Es gibt <strong>User</strong> und <strong>Admins</strong>.</li>
            <li><strong>Wortdatenbank</strong>: Admins pflegen Begriffe (anlegen /löschen) – Qualität vor Menge.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>10. Häufige Fragen (FAQ)</h2>
          <dl>
            <dt><strong>F: Ich komme nicht in die laufende Runde.</strong></dt>
            <dd>A: Warte kurz – du steigst automatisch in die <strong>nächste Runde</strong> ein (max. 60 Sek.).</dd>

            <dt><strong>F: Mein richtiges Wort wurde abgelehnt.</strong></dt>
            <dd>A: Prüfe den <strong>Anfangsbuchstaben</strong> und ob es die <strong>richtige Kategorie</strong> ist. Nicht gelistet? Nimm an der <strong>Abstimmung</strong> teil.</dd>

            <dt><strong>F: Ich habe mich vertippt.</strong></dt>
            <dd>A: Kleine Tippfehler werden durch die <strong>Ähnlichkeitsprüfung</strong> (≈80 %) meist erkannt.</dd>

            <dt><strong>F: Wie erhalte ich mehr Punkte?</strong></dt>
            <dd>A: Finde <strong>seltene</strong> korrekte Wörter – <strong>Alleinstellungs‑Bonus</strong>!</dd>

            <dt><strong>F: Ich habe keinen Freischalt‑Link bekommen.</strong></dt>
            <dd>A: Prüfe Spam‑Ordner. Sonst Support kontaktieren.</dd>
          </dl>
        </section>

        <hr />

        <section>
          <h2>11. Tipps &amp; Tricks</h2>
          <ul>
            <li>Setze auf <strong>ungewöhnliche</strong>, aber gültige Wörter.</li>
            <li>Behalte die  <strong>Zeit</strong> im Auge.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>12. Hilfe &amp; Support</h2>
          <ul>
            <li><strong>Hilfe‑Bereich</strong>: Erklärt Regeln, Steuerung, Datenschutz und Barrierefreiheit.</li>
            <li><strong>Kontakt</strong>: Support‑Formular im Menü oder per E‑Mail an den Support.</li>
            <li><strong>Status</strong>: Systemmeldungen im Kopfbereich informieren über Wartungen.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>13. Rechtliches &amp; Datenschutz (Kurzfassung)</h2>
          <ul>
            <li><strong>Cookies</strong> nur für Funktion (Session, Einstellungen).</li>
            <li><strong>Verschlüsselung</strong>: Übertragung und Speicherung sensibler Daten sind geschützt.</li>
            <li><strong>Löschung</strong>: Du kannst die Löschung deines Accounts beantragen.</li>
          </ul>
        </section>

        <hr />

        <section>
          <h2>14. Mini‑Regelkarte (Kurz &amp; knapp)</h2>
          <ol>
            <li><strong>Login</strong> → Warte ggf. bis zur nächsten Runde.</li>
            <li><strong>60 Sekunden</strong> Zeit, ein <strong>Buchstabe</strong> für alle Felder.</li>
            <li><strong>Stadt, Land, Fluss, Tier</strong> mindestens ausfüllen.</li>
            <li><strong>Tippfehler okay</strong> (≈80 % Ähnlichkeit). Groß/Klein egal.</li>
            <li><strong>Einzigartige</strong> richtige Wörter = <strong>Extrapunkte</strong>.</li>
            <li>Nicht in DB? → <strong>Abstimmung</strong> entscheidet.</li>
            <li><strong>Highscores</strong> checken, weiterspielen, Spaß haben!</li>
          </ol>
        </section>

        <hr />

        <section>
          <h2>15. Über das Spiel</h2>
          <ul>
            <li><strong>Name &amp; Logo</strong>: <em>Stadt.Land.Stadt–Land–Fluss!</em> – das Logo siehst du oben links.</li>
            <li><strong>Version</strong>: 1.0</li>
            <li><strong>Letzte Aktualisierung</strong>: 04.09.2025</li>
          </ul>
          <p>Viel Spaß und gute Wörterjagd!</p>
        </section>
      </main>
    </div>
  );
}