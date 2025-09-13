--
-- PostgreSQL database dump
--

\restrict cwGcwCBgNS5RSV7Ny2dR5DO1YaP4QaLeGvBWHBUK51hThESgsHo6mAKMiYTJFWK

-- Dumped from database version 16.10 (Debian 16.10-1.pgdg13+1)
-- Dumped by pg_dump version 16.10 (Debian 16.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(50) NOT NULL
);


ALTER TABLE public.categories OWNER TO root;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO root;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: game_entries; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.game_entries (
    game_entries_id integer NOT NULL,
    category_id integer NOT NULL,
    answer character varying(100) NOT NULL,
    points integer DEFAULT 0,
    user_id integer,
    is_multiplayer boolean DEFAULT false
);


ALTER TABLE public.game_entries OWNER TO root;

--
-- Name: game_entries_game_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.game_entries_game_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.game_entries_game_entries_id_seq OWNER TO root;

--
-- Name: game_entries_game_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.game_entries_game_entries_id_seq OWNED BY public.game_entries.game_entries_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    is_admin boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO root;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO root;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: valid_words; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.valid_words (
    word_id integer NOT NULL,
    category_id integer NOT NULL,
    word character varying(100) NOT NULL
);


ALTER TABLE public.valid_words OWNER TO root;

--
-- Name: valid_words_word_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.valid_words_word_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.valid_words_word_id_seq OWNER TO root;

--
-- Name: valid_words_word_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.valid_words_word_id_seq OWNED BY public.valid_words.word_id;


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: game_entries game_entries_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.game_entries ALTER COLUMN game_entries_id SET DEFAULT nextval('public.game_entries_game_entries_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: valid_words word_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.valid_words ALTER COLUMN word_id SET DEFAULT nextval('public.valid_words_word_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.categories (category_id, category_name) FROM stdin;
1	Stadt
2	Land
3	Fluss
4	Tier
\.


--
-- Data for Name: game_entries; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.game_entries (game_entries_id, category_id, answer, points, user_id, is_multiplayer) FROM stdin;
1	1	erfurt	11	1	t
2	1	erfurt	11	1	t
3	2	ungrn	6	1	t
4	4	natte	6	1	t
6	2	niederland	12	1	t
5	1	nürnber	9	1	t
7	1	chemnit	10	1	t
8	2	canada	9	1	t
9	2	banada	9	1	t
10	2	canada	9	1	t
11	1	chemnit	10	2	t
14	2	armenien	13	2	t
13	4	amselö	9	2	t
12	1	amsterdam	14	2	t
15	2	litauen	12	2	t
16	4	löwe	9	2	t
19	4	katze	10	2	t
18	2	kanada	11	2	t
17	1	karlsruhe	14	2	t
20	4	fuchs	10	2	t
21	1	frankfurt	14	2	t
22	2	frankreich	15	2	t
23	1	ulm	8	2	t
24	4	uhu	8	2	t
25	1	paris	10	2	t
27	4	pinguin	12	2	t
26	2	polen	10	2	t
28	1	regensburg	15	2	t
29	4	reh	8	2	t
30	4	giraffe	12	2	t
31	2	litauen	12	2	t
32	4	ochse	10	2	t
33	2	kanada	11	2	t
34	2	litauen	12	2	t
35	2	portugal	13	2	t
36	4	pelikan	12	2	t
37	1	brüssel	12	2	t
38	2	bulgarien	14	2	t
39	4	bieber	9	2	t
40	4	giraffe	12	2	t
41	1	gießen	11	2	t
42	1	ulm	8	2	t
43	2	estland	12	2	t
44	1	WASHINGTON	15	2	t
45	4	reh	8	2	t
46	4	wal	8	2	t
47	1	bremen	11	2	t
48	2	bangladesh	13	2	t
49	4	bär	8	2	t
50	4	jaguar	11	2	t
51	4	wal	8	2	t
52	4	elefant	12	2	t
53	1	marburg	12	3	t
54	1	chemnitz	13	2	t
55	1	marburg	12	2	t
56	4	reh	8	2	t
57	2	serbien	12	2	t
58	1	chemnitz	13	2	t
59	4	wal	8	2	t
60	2	dänemark	13	2	t
61	4	schlange	13	2	t
62	1	florenz	12	2	t
63	2	usbekistan	15	2	t
64	2	jamaika	12	2	t
65	4	jaguare	10	2	t
66	2	Estland	12	1	t
67	2	jamaika	12	2	t
68	4	Jaguar	11	1	t
69	1	Hamburg	12	1	t
70	2	Jamaika	12	6	t
71	4	jaguar	11	6	t
72	3	jdvgcdsc	8	6	t
73	2	mist	4	6	t
74	2	niederlande	16	2	t
75	4	reh	8	2	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (user_id, username, email, password_hash, is_admin) FROM stdin;
1	testuser	test@example.com	$2a$10$B24142b/rrVBjHE.7veI9eH7TKheGKcb0n49fAoWMHGziecLDc0Gm	f
2	admin	admin@example.com	$2a$10$4tutlgU7y8k1zSPbGimq6uWT0R1RDD9ml8p/8EHS8jOYPJAGfhzMa	t
3	apfel	apfel@apfel.com	$2b$10$e4eLLGXawq5ltgjhslFPX.KgSvzsUJVI33rSOMe6dkZG2bX8Alchq	f
4	peteraufdie1	grüning@admin.de	$2b$10$N07hplXoRvNn30I.fnp9OuFAfezMawdYh7wwn87Ta2JwFdpFrcJhK	t
5	user2	user@123.de	$2b$10$6O1dWHOnqHbMFPfj68GIeeFPFT/3vaAUInjOWdy9F3C1XCQZ8kJRi	f
6	highscore	highscore@example.com	$2b$10$dxM2xLUH3rTR.WdoIBsGl.X7gV3FP.r8WFcqB6TkRJetGD8X/QSk6	f
\.


--
-- Data for Name: valid_words; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.valid_words (word_id, category_id, word) FROM stdin;
1	1	Berlin
2	1	Hamburg
3	1	München
4	1	Köln
5	1	Frankfurt
6	1	Stuttgart
7	1	Düsseldorf
8	1	Dortmund
9	1	Essen
10	1	Leipzig
11	1	Bremen
12	1	Dresden
13	1	Hannover
14	1	Nürnberg
15	1	Duisburg
16	1	Bochum
17	1	Wuppertal
18	1	Bielefeld
19	1	Bonn
20	1	Münster
21	1	Karlsruhe
22	1	Mannheim
23	1	Augsburg
24	1	Wiesbaden
25	1	Gelsenkirchen
26	1	Mönchengladbach
27	1	Braunschweig
28	1	Chemnitz
29	1	Kiel
30	1	Aachen
31	1	Halle
32	1	Magdeburg
33	1	Freiburg
34	1	Krefeld
35	1	Lübeck
36	1	Oberhausen
37	1	Erfurt
38	1	Mainz
39	1	Rostock
40	1	Kassel
41	1	Hagen
42	1	Potsdam
43	1	Saarbrücken
44	1	Hamm
45	1	Mülheim
46	1	Ludwigshafen
47	1	Leverkusen
48	1	Oldenburg
49	1	Neuss
50	1	Solingen
51	1	Heidelberg
52	1	Paderborn
53	1	Regensburg
54	1	Ingolstadt
55	1	Würzburg
56	1	Fürth
57	1	Wolfsburg
58	1	Offenbach
59	1	Ulm
60	1	Heilbronn
61	1	Pforzheim
62	1	Göttingen
63	1	Bottrop
64	1	Trier
65	1	Recklinghausen
66	1	Reutlingen
67	1	Bremerhaven
68	1	Koblenz
69	1	Bergisch
70	1	Jena
71	1	Remscheid
72	1	Erlangen
73	1	Moers
74	1	Siegen
75	1	Hildesheim
76	2	Deutschland
77	2	Frankreich
78	2	Italien
79	2	Spanien
80	2	Polen
81	2	Niederlande
82	2	Belgien
83	2	Österreich
84	2	Schweiz
85	2	Dänemark
86	2	Schweden
87	2	Norwegen
88	2	Finnland
89	2	England
90	2	Schottland
91	2	Irland
92	2	Portugal
93	2	Griechenland
94	2	Türkei
95	2	Russland
96	2	Ukraine
97	2	Tschechien
98	2	Ungarn
99	2	Slowakei
100	2	Slowenien
101	2	Kroatien
102	2	Serbien
103	2	Bulgarien
104	2	Rumänien
105	2	Litauen
106	2	Lettland
107	2	Estland
108	2	Island
109	2	Malta
110	2	Zypern
111	2	Luxemburg
112	2	Monaco
113	2	Liechtenstein
114	2	Andorra
115	2	Albanien
116	2	Bosnien
117	2	Montenegro
118	2	Mazedonien
119	2	Moldawien
120	2	Weißrussland
121	2	Georgien
122	2	Armenien
123	2	Aserbaidschan
124	2	Kasachstan
125	2	Usbekistan
126	2	China
127	2	Japan
128	2	Indien
129	2	Thailand
130	2	Vietnam
131	2	Südkorea
132	2	Nordkorea
133	2	Malaysia
134	2	Indonesien
135	2	Philippinen
136	2	Singapur
137	2	Myanmar
138	2	Kambodscha
139	2	Laos
140	2	Nepal
141	2	Bangladesch
142	2	Pakistan
144	2	Iran
145	2	Irak
146	2	Saudi
147	2	Syrien
148	2	Libanon
149	2	Israel
150	2	Jordanien
151	2	Ägypten
152	2	Libyen
153	2	Tunesien
154	2	Algerien
155	2	Marokko
156	2	Sudan
157	2	Äthiopien
158	2	Kenia
159	2	Tansania
160	2	Uganda
161	2	Südafrika
162	2	Nigeria
163	2	Ghana
164	2	Kongo
165	2	Kamerun
166	3	Rhein
167	3	Elbe
168	3	Donau
169	3	Weser
170	3	Ems
171	3	Oder
172	3	Main
173	3	Neckar
174	3	Ruhr
175	3	Lahn
176	3	Mosel
177	3	Saar
178	3	Inn
179	3	Isar
180	3	Lech
181	3	Aller
182	3	Fulda
183	3	Werra
184	3	Saale
185	3	Mulde
186	3	Spree
187	3	Havel
188	3	Peene
189	3	Warnow
190	3	Trave
191	3	Eider
192	3	Hunte
193	3	Leine
194	3	Oker
195	3	Innerste
196	3	Lippe
197	3	Emscher
198	3	Wupper
199	3	Sieg
200	3	Agger
201	3	Erft
202	3	Rur
203	3	Inde
204	3	Wurm
205	3	Niers
206	3	Themse
207	3	Seine
208	3	Loire
209	3	Rhone
210	3	Garonne
211	3	Po
212	3	Tiber
213	3	Arno
214	3	Adige
215	3	Piave
216	3	Wolga
217	3	Don
218	3	Dnjepr
219	3	Dnjestr
220	3	Bug
221	3	Weichsel
222	3	Warthe
223	3	Netze
224	3	Brahe
225	3	Drweca
226	3	Nil
227	3	Kongo
228	3	Niger
229	3	Sambesi
230	3	Oranje
231	3	Mississippi
232	3	Missouri
233	3	Colorado
234	3	Columbia
235	3	Hudson
236	3	Amazonas
237	3	Orinoco
238	3	Parana
239	3	Uruguay
240	3	Magdalena
241	3	Jangtse
242	3	Gelber
243	3	Mekong
244	3	Ganges
245	3	Indus
246	3	Euphrat
247	3	Tigris
248	3	Jordan
249	3	Litani
250	3	Orontes
251	4	Katze
252	4	Hund
253	4	Elefant
254	4	Löwe
255	4	Tiger
256	4	Bär
257	4	Wolf
258	4	Fuchs
259	4	Hase
260	4	Reh
261	4	Hirsch
262	4	Wildschwein
263	4	Dachs
264	4	Marder
265	4	Otter
266	4	Biber
267	4	Eichhörnchen
268	4	Maus
269	4	Ratte
270	4	Hamster
271	4	Meerschweinchen
272	4	Kaninchen
273	4	Frettchen
274	4	Igel
275	4	Maulwurf
276	4	Fledermaus
277	4	Pferd
278	4	Esel
279	4	Maultier
280	4	Zebra
281	4	Giraffe
282	4	Nashorn
283	4	Nilpferd
284	4	Büffel
285	4	Antilope
286	4	Gazelle
287	4	Gnu
288	4	Leopard
289	4	Gepard
290	4	Jaguar
291	4	Puma
292	4	Lynx
293	4	Ozelot
294	4	Hyäne
295	4	Schakal
296	4	Affe
297	4	Gorilla
298	4	Schimpanse
299	4	Orang
300	4	Lemur
301	4	Känguru
302	4	Koala
303	4	Wombat
304	4	Opossum
305	4	Gürteltier
306	4	Faultier
307	4	Ameisenbär
308	4	Tapir
309	4	Lama
310	4	Alpaka
311	4	Kamel
312	4	Dromedar
313	4	Rentier
314	4	Elch
315	4	Karibu
316	4	Bison
317	4	Yak
318	4	Wisent
319	4	Okapi
320	4	Kudu
321	4	Impala
322	4	Springbock
323	4	Oryx
324	4	Steinbock
325	4	Gemse
326	4	Mufflon
327	4	Schaf
328	4	Ziege
329	4	Schwein
330	4	Rind
331	4	Kuh
332	4	Stier
333	4	Ochse
334	4	Kalb
335	4	Ferkel
336	4	Adler
337	4	Falke
338	4	Habicht
339	4	Sperber
340	4	Bussard
341	4	Milan
342	4	Geier
343	4	Eule
344	4	Uhu
345	4	Kauz
346	4	Rabe
347	4	Krähe
348	4	Elster
349	4	Häher
350	4	Specht
351	4	Amsel
352	4	Drossel
353	4	Star
354	4	Fink
355	4	Zeisig
356	4	Meise
357	4	Kleiber
358	4	Rotkehlchen
359	4	Zaunkönig
360	4	Lerche
361	4	Schwalbe
362	4	Mauersegler
363	4	Storch
364	4	Kranich
365	4	Reiher
366	4	Ente
367	4	Gans
368	4	Schwan
369	4	Möwe
370	4	Pelikan
371	4	Flamingo
372	4	Ibis
373	4	Pinguin
374	4	Albatros
375	4	Kormoran
376	1	Salzgitter
377	1	Cottbus
378	1	Gera
379	1	Zwickau
380	1	Iserlohn
381	1	Gütersloh
382	1	Schwerin
383	1	Düren
384	1	Ratingen
385	1	Lünen
386	1	Villingen
387	1	Marl
388	1	Velbert
389	1	Minden
390	1	Norderstedt
391	1	Rheine
392	1	Gladbeck
393	1	Viersen
394	1	Delmenhorst
395	1	Bamberg
396	1	Lüdenscheid
397	1	Castrop
398	1	Landshut
399	1	Aschaffenburg
400	1	Bayreuth
401	1	Lüneburg
402	1	Celle
403	1	Plauen
404	1	Neubrandenburg
405	1	Dorsten
406	1	Herford
407	1	Grevenbroich
408	1	Weimar
409	1	Fulda
410	1	Kerpen
411	1	Rüsselsheim
412	1	Gießen
413	1	Schwäbisch
414	1	Sindelfingen
415	1	Rosenheim
416	1	Konstanz
417	1	Worms
418	1	Stralsund
419	1	Marburg
420	1	Passau
421	1	Suhl
422	1	Lörrach
423	1	Greifswald
424	1	Eschweiler
425	1	Hürth
426	1	Paris
427	1	London
428	1	Madrid
429	1	Rom
430	1	Mailand
431	1	Barcelona
432	1	Amsterdam
433	1	Brüssel
434	1	Wien
435	1	Zürich
436	1	Kopenhagen
437	1	Stockholm
438	1	Oslo
439	1	Helsinki
440	1	Warschau
441	1	Prag
442	1	Budapest
443	1	Bratislava
444	1	Ljubljana
445	1	Zagreb
446	1	Belgrad
447	1	Sofia
448	1	Bukarest
449	1	Riga
450	1	Vilnius
451	1	Tallinn
452	1	Dublin
453	1	Edinburgh
454	1	Cardiff
455	1	Belfast
456	1	Lissabon
457	1	Porto
458	1	Valencia
459	1	Sevilla
460	1	Bilbao
461	1	Neapel
462	1	Turin
463	1	Bologna
464	1	Florenz
465	1	Venedig
466	1	Genua
467	1	Palermo
468	1	Catania
469	1	Bari
470	1	Verona
471	1	Athen
472	1	Thessaloniki
473	1	Istanbul
474	1	Ankara
475	1	Izmir
476	1	Moskau
477	1	Petersburg
478	1	Kiew
479	1	Minsk
480	1	Chisinau
481	1	Tiflis
482	1	Eriwan
483	1	Baku
484	1	Almaty
485	1	Taschkent
486	1	Peking
487	1	Shanghai
488	1	Tokio
489	1	Osaka
490	1	Kyoto
491	1	Bangkok
492	1	Manila
493	1	Jakarta
494	1	Singapur
495	1	Kuala
496	1	Hanoi
497	1	Seoul
498	1	Pyongyang
499	1	Rangun
500	1	Phnom
501	1	Neu
502	1	Los
503	1	Chicago
504	1	Houston
505	1	Phoenix
506	1	Philadelphia
507	1	San
508	1	Dallas
509	1	San
510	1	Detroit
511	1	Boston
512	1	Washington
513	1	Miami
514	1	Atlanta
515	1	Denver
516	1	Toronto
517	1	Montreal
518	1	Vancouver
519	1	Ottawa
520	1	Calgary
521	1	Sydney
522	1	Melbourne
523	1	Brisbane
524	1	Perth
525	1	Adelaide
526	1	Kairo
527	1	Casablanca
528	1	Tunis
529	1	Algier
530	1	Tripolis
531	1	Lagos
532	1	Nairobi
533	1	Kapstadt
534	1	Johannesburg
535	1	Durban
536	1	Rio
537	1	São
538	1	Buenos
539	1	Santiago
540	1	Lima
541	1	Bogota
542	1	Caracas
543	1	Montevideo
544	1	Quito
545	1	La
546	2	Angola
547	2	Botswana
548	2	Burkina
549	2	Burundi
550	2	Benin
551	2	Tschad
552	2	Dschibuti
553	2	Eritrea
554	2	Gabun
555	2	Gambia
556	2	Guinea
557	2	Elfenbeinküste
558	2	Lesotho
559	2	Liberia
560	2	Madagaskar
561	2	Malawi
562	2	Mali
563	2	Mauretanien
564	2	Mauritius
565	2	Mosambik
566	2	Namibia
567	2	Niger
568	2	Ruanda
569	2	Senegal
570	2	Sierra
571	2	Somalia
572	2	Swasiland
573	2	Togo
574	2	Sambia
575	2	Simbabwe
576	2	Argentinien
577	2	Bolivien
578	2	Brasilien
579	2	Chile
580	2	Ecuador
581	2	Guyana
582	2	Kolumbien
583	2	Paraguay
584	2	Peru
585	2	Suriname
586	2	Uruguay
587	2	Venezuela
588	2	Kanada
589	2	Mexiko
590	2	Guatemala
591	2	Belize
592	2	Honduras
593	2	Salvador
594	2	Nicaragua
595	2	Costa
596	2	Panama
597	2	Kuba
598	2	Haiti
599	2	Dominikanische
600	2	Jamaika
601	2	Trinidad
602	2	Barbados
603	2	Bahamas
604	2	Antigua
605	2	Dominica
606	2	Sri
607	2	Bhutan
608	2	Malediven
609	2	Mongolei
610	2	Tadschikistan
611	2	Kirgisistan
612	2	Turkmenistan
613	2	Brunei
614	2	Osttimor
615	2	Papua
616	2	Fidschi
617	2	Salomonen
618	2	Vanuatu
619	2	Samoa
620	2	Tonga
621	2	Kiribati
622	2	Tuvalu
623	2	Nauru
624	2	Palau
625	2	Marshallinseln
626	2	Australien
627	2	Neuseeland
628	2	Mikronesien
629	2	San
630	2	Vatikanstadt
631	2	Nordmazedonien
632	2	Kosovo
633	3	Kinzig
634	3	Regnitz
635	3	Naab
636	3	Regen
637	3	Ilz
638	3	Salzach
639	3	Enns
640	3	Traun
641	3	Iller
642	3	Günz
643	3	Mindel
644	3	Zusam
645	3	Schmutter
646	3	Paar
647	3	Abens
648	3	Große
649	3	Kleine
650	3	Vils
651	3	Naarn
652	3	Erlauf
653	3	Ybbs
654	3	Melk
655	3	Pielach
656	3	Traisen
657	3	Schwechat
658	3	Fischa
659	3	Leitha
660	3	March
661	3	Thaya
662	3	Kamp
663	3	Krems
664	3	Perschling
665	3	Tulln
666	3	Wienfluss
667	3	Schwarz
668	3	Enns
669	3	Steyr
670	3	Krems
671	3	Alm
672	3	Traun
673	3	Ager
674	3	Vöckla
675	3	Ach
676	3	Mattig
677	3	Antiesen
678	3	Salzach
679	3	Saalach
680	3	Sur
681	3	Mur
682	3	Mürz
683	3	Moldau
684	3	Elbe
685	3	Moldava
686	3	Morava
687	3	Dyje
688	3	Svitava
689	3	Svratka
690	3	Jihlava
691	3	Sazava
692	3	Berounka
693	3	Eger
694	3	Ohre
695	3	Teplá
696	3	Radbusa
697	3	Mže
698	3	Úhlava
699	3	Radbuza
700	3	Úslava
701	3	Lomnice
702	3	Cidlina
703	3	Jizera
704	3	Ploučnice
705	3	Kamenice
706	3	Lužická
707	3	Mandava
708	3	Weichsel
709	3	Oder
710	3	Neiße
711	3	Bober
712	3	Queis
713	3	Katzbach
714	3	Deichsel
715	3	Bartsch
716	3	Obra
717	3	Netze
718	3	Loire
719	3	Rhone
720	3	Garonne
721	3	Dordogne
722	3	Charente
723	3	Vienne
724	3	Creuse
725	3	Indre
726	3	Cher
727	3	Allier
728	3	Saône
729	3	Doubs
730	3	Ain
731	3	Ardèche
732	3	Gard
733	3	Hérault
734	3	Aude
735	3	Têt
736	3	Tech
737	3	Agly
738	3	Tarn
739	3	Aveyron
740	3	Lot
741	3	Truyère
742	3	Célé
743	3	Durance
744	3	Verdon
745	3	Var
746	3	Argens
747	3	Gapeau
748	3	Arve
749	3	Isère
750	3	Drôme
751	3	Ouvèze
752	3	Lez
753	3	Vidourle
754	3	Vistrenque
755	3	Cèze
756	3	Ardèche
757	3	Chassezac
758	3	Beaume
759	3	Eyrieux
760	3	Drôme
761	3	Roubion
762	3	Jabron
763	3	Senegal
764	3	Volta
765	3	Benue
766	3	Ubangi
767	3	Kasai
768	3	Lualaba
769	3	Lomami
770	3	Aruwimi
771	3	Ituri
772	3	Uele
773	3	Sangha
774	3	Logone
775	3	Chari
776	3	Bahr
777	3	Sobat
778	3	Atbara
779	3	Tekeze
780	3	Awash
781	3	Omo
782	3	Turkana
783	3	Tana
784	3	Galana
785	3	Pangani
786	3	Rufiji
787	3	Ruvuma
788	3	Irrawaddy
789	3	Salween
790	3	Chao
791	3	Ping
792	3	Nan
793	3	Yom
794	3	Chi
795	3	Mun
796	3	Songkhram
797	3	Ing
798	3	Loei
799	3	Huai
800	3	Mae
801	3	Kok
802	3	Fang
803	3	Tarim
804	3	Ili
805	3	Irtysch
806	3	Ob
807	3	Jenissei
808	3	Lena
809	3	Amur
810	3	Ussuri
811	3	Sungari
812	3	Nonni
813	3	Yukon
814	3	Mackenzie
815	3	Saskatchewan
816	3	Nelson
817	3	Churchill
818	3	Albany
819	3	Moose
820	3	Severn
821	3	Winisk
822	3	Attawapiskat
823	3	Río
824	3	Colorado
825	3	Gila
826	3	Salt
827	3	Verde
828	3	Little
829	3	Canadian
830	3	Cimarron
831	3	Washita
832	3	Red
833	4	Wal
834	4	Delfin
835	4	Hai
836	4	Rochen
837	4	Thunfisch
838	4	Lachs
839	4	Forelle
840	4	Karpfen
841	4	Hecht
842	4	Barsch
843	4	Aal
844	4	Sardine
845	4	Hering
846	4	Makrele
847	4	Kabeljau
848	4	Scholle
849	4	Seezunge
850	4	Heilbutt
851	4	Steinbutt
852	4	Flunder
853	4	Seehecht
854	4	Seelachs
855	4	Pollack
856	4	Wittling
857	4	Schellfisch
858	4	Rotbarsch
859	4	Knurrhahn
860	4	Leng
861	4	Lumb
862	4	Dorsch
863	4	Seebär
864	4	Seehund
865	4	Kegelrobbe
866	4	Walross
867	4	Seekuh
868	4	Tintenfisch
869	4	Krake
870	4	Kalmar
871	4	Sepia
872	4	Nautilus
873	4	Hummer
874	4	Krebs
875	4	Garnele
876	4	Languste
877	4	Krill
878	4	Seestern
879	4	Seeigel
880	4	Seegurke
881	4	Qualle
882	4	Koralle
883	4	Käfer
884	4	Schmetterling
885	4	Libelle
886	4	Biene
887	4	Wespe
888	4	Hummel
889	4	Hornisse
890	4	Ameise
891	4	Termite
892	4	Grille
893	4	Heuschrecke
894	4	Gottesanbeterin
895	4	Wanze
896	4	Zikade
897	4	Blattlaus
898	4	Marienkäfer
899	4	Maikäfer
900	4	Hirschkäfer
901	4	Nashornkäfer
902	4	Rosenkäfer
903	4	Laufkäfer
904	4	Rüsselkäfer
905	4	Borkenkäfer
906	4	Prachtkäfer
907	4	Bockkäfer
908	4	Motte
909	4	Spinner
910	4	Spanner
911	4	Eule
912	4	Weißling
913	4	Admiral
914	4	Pfauenauge
915	4	Bläuling
916	4	Falter
917	4	Schwärmer
918	4	Fliege
919	4	Mücke
920	4	Schnake
921	4	Bremse
922	4	Schwebfliege
923	4	Tanzfliege
924	4	Raubfliege
925	4	Dickkopffliege
926	4	Fleischfliege
927	4	Schmeißfliege
928	4	Floh
929	4	Laus
930	4	Silberfischchen
931	4	Kellerassel
932	4	Springschwanz
933	4	Schlange
934	4	Eidechse
935	4	Gecko
936	4	Leguan
937	4	Chamäleon
938	4	Echse
939	4	Skink
940	4	Waran
941	4	Krokodil
942	4	Alligator
943	4	Kaiman
944	4	Gavial
945	4	Schildkröte
946	4	Wasserschildkröte
947	4	Landschildkröte
948	4	Meeresschildkröte
949	4	Sumpfschildkröte
950	4	Dosenschildkröte
951	4	Schmuckschildkröte
952	4	Gelbwangenschildkröte
953	4	Python
954	4	Boa
955	4	Kobra
956	4	Mamba
957	4	Viper
958	4	Klapperschlange
959	4	Korallenschlange
960	4	Natter
961	4	Ringelnatter
962	4	Schlingnatter
963	4	Frosch
964	4	Kröte
965	4	Laubfrosch
966	4	Wasserfrosch
967	4	Grasfrosch
968	4	Springfrosch
969	4	Moorfrosch
970	4	Teichfrosch
971	4	Seefrosch
972	4	Kleiner
973	4	Erdkröte
974	4	Wechselkröte
975	4	Kreuzkröte
976	4	Knoblauchkröte
977	4	Geburtshelferkröte
978	4	Unke
979	4	Molch
980	4	Salamander
981	4	Axolotl
982	4	Olm
983	4	Waschbär
984	4	Stinktier
985	4	Nasenbär
986	4	Mungo
987	4	Erdmännchen
988	4	Surikat
989	4	Fossa
990	4	Ginsterkatze
991	4	Zibetkatze
992	4	Binturong
993	4	Honigdachs
994	4	Vielfrass
995	4	Zobel
996	4	Nerz
997	4	Wiesel
998	4	Hermelin
999	4	Iltis
1000	4	Steinmarder
1001	4	Baummarder
1002	4	Fischermarder
1003	4	Tayra
1004	4	Grison
1005	4	Patagonienwiesel
1006	4	Südamerikanischer
1007	4	Riesenotter
1008	4	Seeotter
1009	4	Eurasischer
1010	4	Zwergotter
1011	4	Glatthaarotter
1012	4	Riesenbiber
1013	4	Bisamratte
1014	4	Ondatra
1015	4	Nutria
1016	4	Chinchilla
1017	4	Viscacha
1018	4	Degus
1019	4	Chinchillaratte
1020	4	Pakaratte
1021	4	Aguti
1022	4	Paka
1023	4	Capybara
1024	4	Wasserschwein
1025	4	Mara
1026	4	Meerschweinchen
1027	4	Cuy
1028	4	Präriehund
1029	4	Ziesel
1030	4	Murmeltier
1031	4	Streifenhörnchen
1032	4	Backenhörnchen
1033	4	Kolibri
1034	4	Eisvogel
1035	4	Bienenfresser
1036	4	Racke
1037	4	Hoopoe
1038	4	Hornvogel
1039	4	Tukan
1040	4	Ara
1041	4	Papagei
1042	4	Wellensittich
1043	4	Nymphensittich
1044	4	Kakadu
1045	4	Lori
1046	4	Amazone
1047	4	Graupapagei
1048	4	Unzertrennliche
1049	4	Agaporniden
1050	4	Sperlingspapagei
1051	4	Edelpapagei
1052	4	Kea
1053	4	Kakapo
1054	4	Fasan
1055	4	Wachtel
1056	1	Rebhuhn
1057	4	Perlhuhn
1058	4	Pfau
1059	4	Truthahn
1060	4	Pute
1061	4	Huhn
1062	4	Hahn
1063	4	Strauss
1064	4	Emu
1065	4	Nandu
1066	4	Kiwi
1067	4	Kasuar
1068	4	Taube
1069	4	Turteltaube
1070	4	Ringeltaube
1071	4	Türkentaube
1072	4	Lachtaube
1073	4	Dodo
1074	4	Wandertaube
1075	4	Felsentaube
1076	4	Hohltaube
1077	4	Stadttaube
1078	4	Kiebitz
1079	4	Brachvogel
1080	4	Regenpfeifer
1081	4	Sandpfeifer
1082	4	Austernfischer
1083	4	Säbelschnäbler
1084	4	Stelzenläufer
1085	4	Kampfläufer
1086	4	Goldregenpfeifer
1087	4	Mornellregenpfeifer
1088	4	Steinwälzer
1089	4	Knutt
1090	4	Sanderling
1091	4	Zwergstrandläufer
1092	4	Temminckstrandläufer
1093	4	Quetzal
1094	4	Kondor
1095	4	Kakapo
1096	4	Schnabeltier
1097	4	Ameisenigel
1098	4	Beutelteufel
1099	4	Beutelwolf
1100	4	Numbat
1101	4	Quoll
1102	4	Bandicoot
1103	4	Bilby
1104	4	Potoroo
1105	4	Bettong
1106	4	Wallaby
1107	4	Wallaroo
1108	4	Quokka
1109	4	Pademelon
1110	4	Felskänguru
1111	4	Baumkänguru
1112	4	Nagelkänguru
1113	4	Hasenkänguru
1114	4	Ratkänguru
1115	4	Kuskus
1116	4	Gleitbeutler
1117	4	Ringbeutler
1118	4	Beutelbär
1119	4	Wombat
1120	4	Haarnasenwombat
1121	4	Bergwombat
1122	4	Südlicher
1123	4	Okapi
1124	4	Bongo
1125	4	Sitatunga
1126	4	Nyala
1127	4	Buschbock
1128	4	Wasserbock
1129	4	Pferdeantilope
1130	4	Säbelantilope
1131	4	Addax
1132	4	Mendesantilope
1133	4	Dorkasgazelle
1134	4	Thomsongazelle
1135	4	Grantgazelle
1136	4	Springgazelle
1137	4	Gerenuk
1138	4	Dikdik
1139	4	Klippspringer
1140	4	Ducker
1141	4	Oribi
1142	4	Rehantilope
1143	2	Afghanistan
1144	2	itrtcr
1145	3	tibib
1146	4	chimpanse
1147	4	xtgbgf
1148	4	ktcxxf
1149	4	jtrxtgr
1150	4	xiulkb
1151	2	ewfecd
1152	1	Encnfh
1153	3	ebfjfj
1154	3	jdvgcdsc
1155	2	mist
\.


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 4, true);


--
-- Name: game_entries_game_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.game_entries_game_entries_id_seq', 75, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.users_user_id_seq', 6, true);


--
-- Name: valid_words_word_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.valid_words_word_id_seq', 1155, true);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: game_entries game_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.game_entries
    ADD CONSTRAINT game_entries_pkey PRIMARY KEY (game_entries_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: valid_words valid_words_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.valid_words
    ADD CONSTRAINT valid_words_pkey PRIMARY KEY (word_id);


--
-- Name: game_entries fk_category_entry; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.game_entries
    ADD CONSTRAINT fk_category_entry FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: valid_words fk_category_valid; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.valid_words
    ADD CONSTRAINT fk_category_valid FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: game_entries fk_user; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.game_entries
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cwGcwCBgNS5RSV7Ny2dR5DO1YaP4QaLeGvBWHBUK51hThESgsHo6mAKMiYTJFWK

