// SV Hockenheim – Statische Inhalte
var builtinArticles = [
  {id:'dossenheim2026',title:'Dossenheim 2026',date:'28.02.2026',folder:'2026',teaser:'Der Wettkampfsamstag startete um 15 Uhr und endete um 22 Uhr beim 11. Late Night Schwimmfest.',full:'<p>Der vergangene Wettkampfsamstag (28.02.2026) startete für die Schwimmer des SVH erst um 15 Uhr und ging bis 22 Uhr. Das Besondere: Im Dunkeln schwimmen, mit Leuchtarmbändern und Musik bei den Staffeln.</p><p><strong>Ergebnisse:</strong><br/>Justin Rieger: 2. Platz 50m Brust – 00:34,06<br/>Pascal Dehoust: 1. Platz 100m Lagen – 01:19,57<br/>Luca Göddelmann: 1. Platz 100m Brust – 01:54,83</p>'},
  {id:'hoggicup2026',title:'Hoggi Cup 2026',date:'06.02.2026',folder:'2026',teaser:'Vereinseigener Wettkampf für die Jahrgänge 2014 bis 2020.',full:'<p>Am 06.02.2026 fand der diesjährige Hoggi Cup für die Jahrgänge 2014 bis 2020 statt.</p>'},
  {id:'heddesheim2026',title:'Heddesheim 2026',date:'25.01.2026',folder:'2026',teaser:'Erfolgreicher Nachmittag bei den Kreismeisterschaften – vor allem für Pascal Dehoust.',full:'<p>Der SVH war am 25.01.2026 zu Gast bei den Kreismeisterschaften des Schwimmkreis Mannheim.</p>'},
  {id:'bruehlmasters2026',title:'Masters Brühl 2026',date:'Januar 2026',folder:'2026',teaser:'Die Masters beim 23. Internationalen Masters-Schwimmfest des SV Hellas Brühl.',full:'<p>Der Sonntagnachmittag gehörte den Masters beim 23. Internationalen Masters-Schwimmfest in Brühl.</p>'},
  {id:'vereinsfeier2025',title:'Vereinsfeier 2025',date:'Herbst 2025',folder:'2025',teaser:'Gemütliches Beisammensein mit Essen, Trinken und Ehrung der Vereinsmeister.',full:'<p>Gemütliches Beisammensein mit Essen und Trinken und der Ehrung der Vereinsmeister in der Grillhütte Hockenheim.</p>'},
  {id:'neptuncup2025',title:'Neptun Cup 2025',date:'Sommer 2025',folder:'2025',teaser:'Erfolgreiches Wochenende beim 5. Neptun Cup – Highlight: Sieg der männlichen Staffel.',full:'<p>Erfolgreiches Wochenende beim 5. Neptun Cup des SK Neptun Leimen. Viele vordere Plätze und der Staffelsieg der Männer.</p>'},
  {id:'wandertag2025',title:'Wandertag 2025',date:'03.10.2025',folder:'2025',teaser:'Am Tag der Deutschen Einheit gemeinsam auf dem Leimener Wichtelpfad.',full:'<p>Am Tag der Deutschen Einheit ab 10 Uhr in Leimen – gemeinsam den Leimener Wichtelpfad erkundet.</p>'},
  {id:'trainingslager2025',title:'Trainingslager 2025',date:'April 2025',folder:'2025',teaser:'15 Schwimmer und 4 Trainer eine Woche in Freudenstadt im Schwarzwald.',full:'<p>In der 2. Osterferienwoche für 15 Schwimmer und 4 Trainer nach Freudenstadt im Schwarzwald. Zweimal täglich Training auf zwei Bahnen.</p>'}
];
var vorstand = [{n:'Ramona Brenner',r:'Vorstand für Öffentlichkeit',e:'ramona.brenner@svhockenheim.de'},{n:'Timo Bierlein',r:'Vorstand Sport',e:'timo.bierlein@svhockenheim.de'},{n:'Kay Uhlig',r:'Vorstand für Verwaltung',e:'verwaltung@svhockenheim.de'}];
var erweiterter = [{n:'Justin Rieger',r:'Jugendvorstand'},{n:'Pascal Reinmuth',r:'Stv. Jugendvorstand'},{n:'Tatjana Sturm',r:'Schwimmwart'},{n:'Tanina Nieli',r:'Pressewart'},{n:'Antje Geiler',r:'Beisitzer'},{n:'Sven Grunder',r:'Beisitzer'}];
var trainers = ['Anneli Friedrich','Carolin Köller','Christopher Sturm','Frauke Sievers','Isabelle Sturm','Justin Rieger','Kay Uhlig','Lotte Hartmann','Natalia Troschina','Nele Baumann','Nils Schmitt','Pascal Reinmuth','Ramona Brenner','Simone Berger','Stephanie Friedrich','Sven Grundner','Tatjana Sturm','Timo Bierlein','Vivien Haase','Yannis Haase'];
var kurstrainer = ['Anneli Friedrich','Antje Geiler','Carolin Köller','Christopher Sturm','Daniel Buzengeiger','Emily-Maya Ziegler','Isabelle Sturm','Jennifer Bierlein','Justin Rieger','Lotte Hartmann','Nele Baumann','Ramona Brenner','Simone Berger','Tatjana Sturm','Timo Bierlein','Vivien Haase'];
var slideLabels = [
  {title:'Vereinsmeisterschaften 2025',sub:'Früh aufgestanden, stark geschwommen'},
  {title:'Hoggi Cup 2026',sub:'Unser vereinseigener Nachwuchswettbewerb'},
  {title:'Trainingslager 2025',sub:'Freudenstadt im Schwarzwald'},
  {title:'Wandertag 2025',sub:'Gemeinschaft auch abseits des Wassers'}
];
var defaultRekorde = {
  lang:[
    {mName:'Schreiber, Michael',mJg:'82',mZeit:'25.85',mDatum:'',disc:'50 Freistil',fZeit:'29.40',fJg:'78',fName:'Duggen, Katja',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'57.61',mDatum:'',disc:'100 Freistil',fZeit:'1:05.72',fJg:'84',fName:'Sawa, Evelyn',fDatum:''},
    {mName:'Schimmel, Michael',mJg:'68',mZeit:'2:07.60',mDatum:'',disc:'200 Freistil',fZeit:'2:23.05',fJg:'84',fName:'Sawa, Evelyn',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'4:57.60',mDatum:'',disc:'400 Freistil',fZeit:'5:10.31',fJg:'84',fName:'Zierath, Eva',fDatum:''},
    {mName:'Jahnke, Klaus',mJg:'78',mZeit:'31.28',mDatum:'',disc:'50 Rücken',fZeit:'33.97',fJg:'95',fName:'Haag, Jennifer',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'1:08.42',mDatum:'',disc:'100 Rücken',fZeit:'1:13.58',fJg:'84',fName:'Sawa, Evelyn',fDatum:''},
    {mName:'Rieger, Justin',mJg:'03',mZeit:'34.63',mDatum:'',disc:'50 Brust',fZeit:'35.84',fJg:'89',fName:'Köller, Carolin',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'1:16.11',mDatum:'',disc:'100 Brust',fZeit:'1:23.22',fJg:'89',fName:'Köller, Carolin',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'2:44.60',mDatum:'',disc:'200 Brust',fZeit:'3:08.63',fJg:'89',fName:'Köller, Carolin',fDatum:''},
    {mName:'Jahnke, Klaus',mJg:'78',mZeit:'27.90',mDatum:'',disc:'50 Schmetterling',fZeit:'31.81',fJg:'93',fName:'Brenner, Ramona',fDatum:''},
    {mName:'Jahnke, Klaus',mJg:'78',mZeit:'1:07.19',mDatum:'',disc:'100 Schmetterling',fZeit:'1:19.25',fJg:'90',fName:'Mäder, Lisa',fDatum:''},
    {mName:'Jahnke, Klaus',mJg:'78',mZeit:'2:34.89',mDatum:'',disc:'200 Lagen',fZeit:'2:49.20',fJg:'79',fName:'Misch, Sara-Marisa',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'5:46.46',mDatum:'',disc:'400 Lagen',fZeit:'6:00.96',fJg:'79',fName:'Wehr, Margot',fDatum:''}
  ],
  kurz:[
    {mName:'Stenzel, Jörn',mJg:'74',mZeit:'25.16',mDatum:'',disc:'50 Freistil',fZeit:'28.97',fJg:'93',fName:'Brenner, Ramona',fDatum:''},
    {mName:'Stenzel, Jörn',mJg:'74',mZeit:'55.70',mDatum:'',disc:'100 Freistil',fZeit:'1:04.72',fJg:'93',fName:'Brenner, Ramona',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'30.74',mDatum:'',disc:'50 Rücken',fZeit:'33.49',fJg:'95',fName:'Haag, Jennifer',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'1:04.57',mDatum:'',disc:'100 Rücken',fZeit:'1:13.09',fJg:'84',fName:'Sawa, Evelyn',fDatum:''},
    {mName:'Freitag, Michael',mJg:'73',mZeit:'33.30',mDatum:'',disc:'50 Brust',fZeit:'35.41',fJg:'89',fName:'Köller, Carolin',fDatum:''},
    {mName:'Dommaschk, Martin',mJg:'76',mZeit:'1:12.27',mDatum:'',disc:'100 Brust',fZeit:'1:19.08',fJg:'89',fName:'Köller, Carolin',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'2:42.40',mDatum:'',disc:'200 Brust',fZeit:'3:00.82',fJg:'89',fName:'Köller, Carolin',fDatum:''},
    {mName:'Jahnke, Klaus',mJg:'78',mZeit:'27.57',mDatum:'',disc:'50 Schmetterling',fZeit:'31.64',fJg:'93',fName:'Brenner, Ramona',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'2:24.26',mDatum:'',disc:'200 Lagen',fZeit:'2:44.76',fJg:'79',fName:'Misch, Sara-Marisa',fDatum:''},
    {mName:'Ern, Keyvan',mJg:'78',mZeit:'5:35.09',mDatum:'',disc:'400 Lagen',fZeit:'6:03.66',fJg:'79',fName:'Misch, Sara-Marisa',fDatum:''}
  ]
};
var editablePages = [
  {key:'verein-text',label:'Der Verein – Text',field:'textarea'},
  {key:'jugend-text',label:'Jugend – Text',field:'textarea'},
  {key:'masters-text',label:'Masters – Text',field:'textarea'},
  {key:'kurse-text',label:'Schwimmkurse – Text',field:'textarea'},
  {key:'beitrag-tabelle',label:'Beitragsordnung',field:'beitrag'},
  {key:'termine-liste',label:'Termine',field:'termine'},
  {key:'impressum-text',label:'Impressum – Text',field:'textarea'}
];
