--Autor: Nikolas Paul Zimmer & Emilia &TTorga
--Datenbank-Init für Stadt-Land-Fluss
--Tabelle für Benutzer, mit email, username, Passwort-Hash und Rolle (Admin/Normal)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

--Tabelle für Kategorien (z.B. Stadt, Land, Fluss, etc.) mit eindeutigen Namen
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

--Tabelle für gültige Wörter, die einer Kategorie zugeordnet sind
--Fremdschlüssel zu categories
CREATE TABLE valid_words (
    word_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    word VARCHAR(100) NOT NULL,
    CONSTRAINT fk_category_valid
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

--Tabelle für Spieleinträge, die eine Antwort in einer bestimmten Kategorie für einen Benutzer speichern
--Fremdschlüssel zu users und categories, Punktewert und Multiplayer-Flag
CREATE TABLE game_entries (
    game_entries_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    answer VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0,
    user_id INTEGER,
    is_multiplayer BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category_entry
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- Test-User für Development
-- Passwort für test@example.com: "password123"
-- Passwort für admin@example.com: "admin123"
--Benutzer einfügen
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('testuser', 'test@example.com', '$2a$10$B24142b/rrVBjHE.7veI9eH7TKheGKcb0n49fAoWMHGziecLDc0Gm', FALSE),
('admin', 'admin@example.com', '$2a$10$4tutlgU7y8k1zSPbGimq6uWT0R1RDD9ml8p/8EHS8jOYPJAGfhzMa', TRUE);

-- Kategorien für Stadt-Land-Fluss
--Kategorien einfügen
INSERT INTO categories (category_name) VALUES
('Stadt'),
('Land'), 
('Fluss'),
('Tier');

-- Gültige Wörter einfügen
-- === STADT (Kategorie 1) ===
INSERT INTO valid_words (category_id, word) VALUES
(1, 'Berlin'), (1, 'Hamburg'), (1, 'München'), (1, 'Köln'), (1, 'Frankfurt'),
(1, 'Stuttgart'), (1, 'Düsseldorf'), (1, 'Dortmund'), (1, 'Essen'), (1, 'Leipzig'),
(1, 'Bremen'), (1, 'Dresden'), (1, 'Hannover'), (1, 'Nürnberg'), (1, 'Duisburg'),
(1, 'Bochum'), (1, 'Wuppertal'), (1, 'Bielefeld'), (1, 'Bonn'), (1, 'Münster'),
(1, 'Karlsruhe'), (1, 'Mannheim'), (1, 'Augsburg'), (1, 'Wiesbaden'), (1, 'Gelsenkirchen'),
(1, 'Mönchengladbach'), (1, 'Braunschweig'), (1, 'Chemnitz'), (1, 'Kiel'), (1, 'Aachen'),
(1, 'Halle'), (1, 'Magdeburg'), (1, 'Freiburg'), (1, 'Krefeld'), (1, 'Lübeck'),
(1, 'Oberhausen'), (1, 'Erfurt'), (1, 'Mainz'), (1, 'Rostock'), (1, 'Kassel'),
(1, 'Hagen'), (1, 'Potsdam'), (1, 'Saarbrücken'), (1, 'Hamm'), (1, 'Mülheim'),
(1, 'Ludwigshafen'), (1, 'Leverkusen'), (1, 'Oldenburg'), (1, 'Neuss'), (1, 'Solingen'),
(1, 'Heidelberg'), (1, 'Paderborn'), (1, 'Regensburg'), (1, 'Ingolstadt'), (1, 'Würzburg'),
(1, 'Fürth'), (1, 'Wolfsburg'), (1, 'Offenbach'), (1, 'Ulm'), (1, 'Heilbronn'),
(1, 'Pforzheim'), (1, 'Göttingen'), (1, 'Bottrop'), (1, 'Trier'), (1, 'Recklinghausen'),
(1, 'Reutlingen'), (1, 'Bremerhaven'), (1, 'Koblenz'), (1, 'Bergisch'), (1, 'Jena'),
(1, 'Remscheid'), (1, 'Erlangen'), (1, 'Moers'), (1, 'Siegen'), (1, 'Hildesheim'),

-- === LAND (Kategorie 2) ===
(2, 'Deutschland'), (2, 'Frankreich'), (2, 'Italien'), (2, 'Spanien'), (2, 'Polen'),
(2, 'Niederlande'), (2, 'Belgien'), (2, 'Österreich'), (2, 'Schweiz'), (2, 'Dänemark'),
(2, 'Schweden'), (2, 'Norwegen'), (2, 'Finnland'), (2, 'England'), (2, 'Schottland'),
(2, 'Irland'), (2, 'Portugal'), (2, 'Griechenland'), (2, 'Türkei'), (2, 'Russland'),
(2, 'Ukraine'), (2, 'Tschechien'), (2, 'Ungarn'), (2, 'Slowakei'), (2, 'Slowenien'),
(2, 'Kroatien'), (2, 'Serbien'), (2, 'Bulgarien'), (2, 'Rumänien'), (2, 'Litauen'),
(2, 'Lettland'), (2, 'Estland'), (2, 'Island'), (2, 'Malta'), (2, 'Zypern'),
(2, 'Luxemburg'), (2, 'Monaco'), (2, 'Liechtenstein'), (2, 'Andorra'), (2, 'Albanien'),
(2, 'Bosnien'), (2, 'Montenegro'), (2, 'Mazedonien'), (2, 'Moldawien'), (2, 'Weißrussland'),
(2, 'Georgien'), (2, 'Armenien'), (2, 'Aserbaidschan'), (2, 'Kasachstan'), (2, 'Usbekistan'),
(2, 'China'), (2, 'Japan'), (2, 'Indien'), (2, 'Thailand'), (2, 'Vietnam'),
(2, 'Südkorea'), (2, 'Nordkorea'), (2, 'Malaysia'), (2, 'Indonesien'), (2, 'Philippinen'),
(2, 'Singapur'), (2, 'Myanmar'), (2, 'Kambodscha'), (2, 'Laos'), (2, 'Nepal'),
(2, 'Bangladesch'), (2, 'Pakistan'), (2, 'Afghanistan'), (2, 'Iran'), (2, 'Irak'),
(2, 'Saudi'), (2, 'Syrien'), (2, 'Libanon'), (2, 'Israel'), (2, 'Jordanien'),
(2, 'Ägypten'), (2, 'Libyen'), (2, 'Tunesien'), (2, 'Algerien'), (2, 'Marokko'),
(2, 'Sudan'), (2, 'Äthiopien'), (2, 'Kenia'), (2, 'Tansania'), (2, 'Uganda'),
(2, 'Südafrika'), (2, 'Nigeria'), (2, 'Ghana'), (2, 'Kongo'), (2, 'Kamerun'),

-- === FLUSS (Kategorie 3) ===
(3, 'Rhein'), (3, 'Elbe'), (3, 'Donau'), (3, 'Weser'), (3, 'Ems'),
(3, 'Oder'), (3, 'Main'), (3, 'Neckar'), (3, 'Ruhr'), (3, 'Lahn'),
(3, 'Mosel'), (3, 'Saar'), (3, 'Inn'), (3, 'Isar'), (3, 'Lech'),
(3, 'Aller'), (3, 'Fulda'), (3, 'Werra'), (3, 'Saale'), (3, 'Mulde'),
(3, 'Spree'), (3, 'Havel'), (3, 'Peene'), (3, 'Warnow'), (3, 'Trave'),
(3, 'Eider'), (3, 'Hunte'), (3, 'Leine'), (3, 'Oker'), (3, 'Innerste'),
(3, 'Lippe'), (3, 'Emscher'), (3, 'Wupper'), (3, 'Sieg'), (3, 'Agger'),
(3, 'Erft'), (3, 'Rur'), (3, 'Inde'), (3, 'Wurm'), (3, 'Niers'),
(3, 'Themse'), (3, 'Seine'), (3, 'Loire'), (3, 'Rhone'), (3, 'Garonne'),
(3, 'Po'), (3, 'Tiber'), (3, 'Arno'), (3, 'Adige'), (3, 'Piave'),
(3, 'Wolga'), (3, 'Don'), (3, 'Dnjepr'), (3, 'Dnjestr'), (3, 'Bug'),
(3, 'Weichsel'), (3, 'Warthe'), (3, 'Netze'), (3, 'Brahe'), (3, 'Drweca'),
(3, 'Nil'), (3, 'Kongo'), (3, 'Niger'), (3, 'Sambesi'), (3, 'Oranje'),
(3, 'Mississippi'), (3, 'Missouri'), (3, 'Colorado'), (3, 'Columbia'), (3, 'Hudson'),
(3, 'Amazonas'), (3, 'Orinoco'), (3, 'Parana'), (3, 'Uruguay'), (3, 'Magdalena'),
(3, 'Jangtse'), (3, 'Gelber'), (3, 'Mekong'), (3, 'Ganges'), (3, 'Indus'),
(3, 'Euphrat'), (3, 'Tigris'), (3, 'Jordan'), (3, 'Litani'), (3, 'Orontes'),

-- === TIER (Kategorie 4) ===
(4, 'Katze'), (4, 'Hund'), (4, 'Elefant'), (4, 'Löwe'), (4, 'Tiger'),
(4, 'Bär'), (4, 'Wolf'), (4, 'Fuchs'), (4, 'Hase'), (4, 'Reh'),
(4, 'Hirsch'), (4, 'Wildschwein'), (4, 'Dachs'), (4, 'Marder'), (4, 'Otter'),
(4, 'Biber'), (4, 'Eichhörnchen'), (4, 'Maus'), (4, 'Ratte'), (4, 'Hamster'),
(4, 'Meerschweinchen'), (4, 'Kaninchen'), (4, 'Frettchen'), (4, 'Igel'), (4, 'Maulwurf'),
(4, 'Fledermaus'), (4, 'Pferd'), (4, 'Esel'), (4, 'Maultier'), (4, 'Zebra'),
(4, 'Giraffe'), (4, 'Nashorn'), (4, 'Nilpferd'), (4, 'Büffel'), (4, 'Antilope'),
(4, 'Gazelle'), (4, 'Gnu'), (4, 'Leopard'), (4, 'Gepard'), (4, 'Jaguar'),
(4, 'Puma'), (4, 'Lynx'), (4, 'Ozelot'), (4, 'Hyäne'), (4, 'Schakal'),
(4, 'Affe'), (4, 'Gorilla'), (4, 'Schimpanse'), (4, 'Orang'), (4, 'Lemur'),
(4, 'Känguru'), (4, 'Koala'), (4, 'Wombat'), (4, 'Opossum'), (4, 'Gürteltier'),
(4, 'Faultier'), (4, 'Ameisenbär'), (4, 'Tapir'), (4, 'Lama'), (4, 'Alpaka'),
(4, 'Kamel'), (4, 'Dromedar'), (4, 'Rentier'), (4, 'Elch'), (4, 'Karibu'),
(4, 'Bison'), (4, 'Yak'), (4, 'Wisent'), (4, 'Okapi'), (4, 'Kudu'),
(4, 'Impala'), (4, 'Springbock'), (4, 'Oryx'), (4, 'Steinbock'), (4, 'Gemse'),
(4, 'Mufflon'), (4, 'Schaf'), (4, 'Ziege'), (4, 'Schwein'), (4, 'Rind'),
(4, 'Kuh'), (4, 'Stier'), (4, 'Ochse'), (4, 'Kalb'), (4, 'Ferkel'),
(4, 'Adler'), (4, 'Falke'), (4, 'Habicht'), (4, 'Sperber'), (4, 'Bussard'),
(4, 'Milan'), (4, 'Geier'), (4, 'Eule'), (4, 'Uhu'), (4, 'Kauz'),
(4, 'Rabe'), (4, 'Krähe'), (4, 'Elster'), (4, 'Häher'), (4, 'Specht'),
(4, 'Amsel'), (4, 'Drossel'), (4, 'Star'), (4, 'Fink'), (4, 'Zeisig'),
(4, 'Meise'), (4, 'Kleiber'), (4, 'Rotkehlchen'), (4, 'Zaunkönig'), (4, 'Lerche'),
(4, 'Schwalbe'), (4, 'Mauersegler'), (4, 'Storch'), (4, 'Kranich'), (4, 'Reiher'),
(4, 'Ente'), (4, 'Gans'), (4, 'Schwan'), (4, 'Möwe'), (4, 'Pelikan'),
(4, 'Flamingo'), (4, 'Ibis'), (4, 'Pinguin'), (4, 'Albatros'), (4, 'Kormoran');
