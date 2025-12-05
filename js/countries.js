// Pays
const provinces = [
  "Achaea",
  "Aegyptus",
  "Aegyptus Herculia",
  "Aegyptus Iovia",
  "Aemilia",
  "Africa Nova",
  "Africa Proconsularis",
  "Alpes Cottiae",
  "Alpes Graiae et Poeninae",
  "Alpes Maritimae",
  "Alpes Poeninae",
  "Alpes Poeninae et Graiae",
  "Apulia et Calabria",
  "Aquitania I",
  "Aquitania II",
  "Aquitania III Novempopulana",
  "Arabia",
  "Arabia Petraea",
  "Arcadia Aegypti",
  "Armenia",
  "Armenia Minor",
  "Asia",
  "Assyria",
  "Asturia",
  "Augustamnica",
  "Baetica",
  "Balearica",
  "Belgica I",
  "Belgica II",
  "Bithynia et Pontus",
  "Britannia",
  "Britannia Inferior",
  "Britannia Secunda",
  "Britannia Superior",
  "Byzacena",
  "Caledonia",
  "Campania",
  "Cappadocia",
  "Cilicia",
  "Cilicia Prima",
  "Cilicia Secunda",
  "Civitas Trinovantum",
  "Corsica",
  "Corsica et Sardinia",
  "Creta",
  "Creta et Cyrenaica",
  "Cyprus",
  "Cyrenaica",
  "Dacia",
  "Dacia Mediterranea",
  "Dacia Ripensis",
  "Dalmatia",
  "Dardania",
  "Epirus",
  "Epirus nova",
  "Epirus Nova",
  "Epirus vetus",
  "Epirus Vetus",
  "Europa",
  "Flaminia et Picenum",
  "Flavia Caesariensis",
  "Galatia",
  "Gallaecia",
  "Gallia Aquitania",
  "Gallia Belgica",
  "Gallia Cisalpina",
  "Gallia Lugdunensis",
  "Gallia Narbonensis",
  "Germania Inferior",
  "Germania Superior",
  "Haemimontus",
  "Hispania Citerior",
  "Hispania Tarraconensis",
  "Hispania Ulterior",
  "Hispaniae",
  "Honorias",
  "Illyricum",
  "Isauria",
  "Italia Annonaria",
  "Italia Suburbicaria",
  "Iudaea",
  "Judaea",
  "Liguria",
  "Lucania et Bruttii",
  "Lugdunensis I",
  "Lugdunensis II",
  "Lugdunensis III",
  "Lugdunensis IV Senonia",
  "Lusitania",
  "Lycia et Pamphylia",
  "Macedonia",
  "Macedonia Prima",
  "Macedonia Salutaris",
  "Mauretania Caesariensis",
  "Mauretania Sitifensis",
  "Mauretania Tingitana",
  "Maxima Caesariensis",
  "Maxima Sequanorum",
  "Mesopotamia",
  "Moesia Inferior",
  "Moesia Prima",
  "Moesia Secunda",
  "Moesia Superior",
  "Narbonensis I",
  "Narbonensis II",
  "Noricum",
  "Noricum Mediterraneum",
  "Noricum Ripense",
  "Numidia",
  "Osroene",
  "Palestina I",
  "Palestina II",
  "Palestina Salutaris",
  "Pannonia",
  "Pannonia Prima",
  "Pannonia Savia",
  "Pannonia Valeria",
  "Phoenice",
  "Phoenice Libanensis",
  "Picenum Suburbicarium",
  "Pisidia",
  "Pontus Cappadocianus",
  "Pontus Galaticus",
  "Pontus Polemoniacus",
  "Praevalitana",
  "Raetia",
  "Raetia Prima",
  "Raetia Secunda",
  "Rhodope",
  "Samnium",
  "Sardinia",
  "Savia",
  "Scythia Minor",
  "Sicilia",
  "Syria",
  "Syria Coele",
  "Syria Palaestina",
  "Syria Prima",
  "Syria Secunda",
  "Thebais",
  "Thracia",
  "Tripolitania",
  "Tuscia et Umbria",
  "Valentia",
  "Valeria",
  "Venetia et Histria",
  "Viennensis",
  'Africa', 'Galliarum', 'Illyricum', 'Italia', 'Orientis',
  'Aegypti', 'Africa', 'Asiana', 'Britanniarum', 'Dacia', 'Galliae', 'Hispaniae', 'Italia', 'Macedonia', 'Oriens', 'Pontica', 'Thracia',
 'Carthage', 'Ravenna',
 'Anatolikon', 'Armeniakon', 'Kibyrrhaioton', 'Opsikion', 'Thrakesion',
 'Boukellarion', 'Cherson', 'Hellas', 'Macedonia', 'Optimaton', 'Peloponnesos', 'Sicilia', 'Strymon',
 'Cappadocia', 'Chaldia', 'Koloneia', 'Lykandos', 'Mesopotamia', 'Samos', 'Sebasteia', 'Vaspurakan',
   "Arabia Nova",
  "Germania Magna",
  "Dacia Aureliana",
  "Regnum Bosporanum",
  "Regnum Nabataeorum",
  "Regnum Commagenum",
  "Regnum Emesenorum",
  "Regnum Iudaeae",
  "Regnum Thraciae",
  "Regnum Mauretaniae",
  "Lazicum",
  "Abasgia",
  "Regnum Armeniae Bagratidarum",
  "Regnum Taronis",
  "Neapolis",
  "Venetia",
  "Servia",
  "Bulgaria",
  "Principatus Antiochiae"
];
const countries = [
  {
    "flag": "🇦🇫",
    "name": "Afghanistan"
  },
  {
    "flag": "🇿🇦",
    "name": "Afrique du Sud"
  },
  {
    "flag": "🇦🇱",
    "name": "Albanie"
  },
  {
    "flag": "🇩🇿",
    "name": "Algérie"
  },
  {
    "flag": "🇩🇪",
    "name": "Allemagne"
  },
  {
    "flag": "🇦🇩",
    "name": "Andorre"
  },
  {
    "flag": "🇦🇴",
    "name": "Angola"
  },
  {
    "flag": "🇦🇮",
    "name": "Anguilla"
  },
  {
    "flag": "🇦🇶",
    "name": "Antarctique"
  },
  {
    "flag": "🇦🇬",
    "name": "Antigua-et-Barbuda"
  },
  {
    "flag": "🇸🇦",
    "name": "Arabie saoudite"
  },
  {
    "flag": "🇦🇷",
    "name": "Argentine"
  },
  {
    "flag": "🇦🇲",
    "name": "Arménie"
  },
  {
    "flag": "🇦🇼",
    "name": "Aruba"
  },
  {
    "flag": "🇦🇺",
    "name": "Australie"
  },
  {
    "flag": "🇦🇹",
    "name": "Autriche"
  },
  {
    "flag": "🇦🇿",
    "name": "Azerbaïdjan"
  },
  {
    "flag": "🇧🇸",
    "name": "Bahamas"
  },
  {
    "flag": "🇧🇭",
    "name": "Bahreïn"
  },
  {
    "flag": "🇧🇩",
    "name": "Bangladesh"
  },
  {
    "flag": "🇧🇧",
    "name": "Barbade"
  },
  {
    "flag": "🇧🇪",
    "name": "Belgique"
  },
  {
    "flag": "🇧🇿",
    "name": "Belize"
  },
  {
    "flag": "🇧🇲",
    "name": "Bermudes"
  },
  {
    "flag": "🇧🇹",
    "name": "Bhoutan"
  },
  {
    "flag": "🇧🇾",
    "name": "Biélorussie"
  },
  {
    "flag": "🇧🇴",
    "name": "Bolivie"
  },
  {
    "flag": "🇧🇦",
    "name": "Bosnie-Herzégovine"
  },
  {
    "flag": "🇧🇼",
    "name": "Botswana"
  },
  {
    "flag": "🇧🇳",
    "name": "Brunei"
  },
  {
    "flag": "🇧🇷",
    "name": "Brésil"
  },
  {
    "flag": "🇧🇬",
    "name": "Bulgarie"
  },
  {
    "flag": "🇧🇫",
    "name": "Burkina Faso"
  },
  {
    "flag": "🇧🇮",
    "name": "Burundi"
  },
  {
    "flag": "🇧🇯",
    "name": "Bénin"
  },
  {
    "flag": "🇰🇭",
    "name": "Cambodge"
  },
  {
    "flag": "🇨🇲",
    "name": "Cameroun"
  },
  {
    "flag": "🇨🇦",
    "name": "Canada"
  },
  {
    "flag": "🇨🇻",
    "name": "Cap-Vert"
  },
  {
    "flag": "🇨🇱",
    "name": "Chili"
  },
  {
    "flag": "🇨🇳",
    "name": "Chine"
  },
  {
    "flag": "🇨🇾",
    "name": "Chypre"
  },
  {
    "flag": "🇨🇴",
    "name": "Colombie"
  },
  {
    "flag": "🇰🇲",
    "name": "Comores"
  },
  {
    "flag": "🇨🇬",
    "name": "Congo-Brazzaville"
  },
  {
    "flag": "🇨🇩",
    "name": "Congo-Kinshasa"
  },
  {
    "flag": "🇰🇵",
    "name": "Corée du Nord"
  },
  {
    "flag": "🇰🇷",
    "name": "Corée du Sud"
  },
  {
    "flag": "🇨🇷",
    "name": "Costa Rica"
  },
  {
    "flag": "🇭🇷",
    "name": "Croatie"
  },
  {
    "flag": "🇨🇺",
    "name": "Cuba"
  },
  {
    "flag": "🇨🇼",
    "name": "Curaçao"
  },
  {
    "flag": "🇨🇮",
    "name": "Côte d’Ivoire"
  },
  {
    "flag": "🇩🇰",
    "name": "Danemark"
  },
  {
    "flag": "🇩🇯",
    "name": "Djibouti"
  },
  {
    "flag": "🇩🇲",
    "name": "Dominique"
  },
  {
    "flag": "🇪🇸",
    "name": "Espagne"
  },
  {
    "flag": "🇪🇪",
    "name": "Estonie"
  },
  {
    "flag": "🇸🇿",
    "name": "Eswatini"
  },
  {
    "flag": "🇫🇯",
    "name": "Fidji"
  },
  {
    "flag": "🇫🇮",
    "name": "Finlande"
  },
  {
    "flag": "🇫🇷",
    "name": "France"
  },
  {
    "flag": "🇬🇦",
    "name": "Gabon"
  },
  {
    "flag": "🇬🇲",
    "name": "Gambie"
  },
  {
    "flag": "🇬🇭",
    "name": "Ghana"
  },
  {
    "flag": "🇬🇮",
    "name": "Gibraltar"
  },
  {
    "flag": "🇬🇩",
    "name": "Grenade"
  },
  {
    "flag": "🇬🇱",
    "name": "Groenland"
  },
  {
    "flag": "🇬🇷",
    "name": "Grèce"
  },
  {
    "flag": "🇬🇵",
    "name": "Guadeloupe"
  },
  {
    "flag": "🇬🇺",
    "name": "Guam"
  },
  {
    "flag": "🇬🇹",
    "name": "Guatemala"
  },
  {
    "flag": "🇬🇬",
    "name": "Guernesey"
  },
  {
    "flag": "🇬🇳",
    "name": "Guinée"
  },
  {
    "flag": "🇬🇶",
    "name": "Guinée équatoriale"
  },
  {
    "flag": "🇬🇼",
    "name": "Guinée-Bissau"
  },
  {
    "flag": "🇬🇾",
    "name": "Guyana"
  },
  {
    "flag": "🇬🇫",
    "name": "Guyane française"
  },
  {
    "flag": "🇬🇪",
    "name": "Géorgie"
  },
  {
    "flag": "🇬🇸",
    "name": "Géorgie du Sud-et-les Îles Sandwich du Sud"
  },
  {
    "flag": "🇭🇹",
    "name": "Haïti"
  },
  {
    "flag": "🇭🇳",
    "name": "Honduras"
  },
  {
    "flag": "🇭🇺",
    "name": "Hongrie"
  },
  {
    "flag": "🇮🇳",
    "name": "Inde"
  },
  {
    "flag": "🇮🇩",
    "name": "Indonésie"
  },
  {
    "flag": "🇮🇶",
    "name": "Irak"
  },
  {
    "flag": "🇮🇷",
    "name": "Iran"
  },
  {
    "flag": "🇮🇪",
    "name": "Irlande"
  },
  {
    "flag": "🇮🇸",
    "name": "Islande"
  },
  {
    "flag": "🇮🇱",
    "name": "Israël"
  },
  {
    "flag": "🇮🇹",
    "name": "Italie"
  },
  {
    "flag": "🇯🇲",
    "name": "Jamaïque"
  },
  {
    "flag": "🇯🇵",
    "name": "Japon"
  },
  {
    "flag": "🇯🇪",
    "name": "Jersey"
  },
  {
    "flag": "🇯🇴",
    "name": "Jordanie"
  },
  {
    "flag": "🇰🇿",
    "name": "Kazakhstan"
  },
  {
    "flag": "🇰🇪",
    "name": "Kenya"
  },
  {
    "flag": "🇰🇬",
    "name": "Kirghizstan"
  },
  {
    "flag": "🇰🇮",
    "name": "Kiribati"
  },
  {
    "flag": "🇰🇼",
    "name": "Koweït"
  },
  {
    "flag": "🇷🇪",
    "name": "La Réunion"
  },
  {
    "flag": "🇱🇦",
    "name": "Laos"
  },
  {
    "flag": "🇱🇸",
    "name": "Lesotho"
  },
  {
    "flag": "🇱🇻",
    "name": "Lettonie"
  },
  {
    "flag": "🇱🇧",
    "name": "Liban"
  },
  {
    "flag": "🇱🇷",
    "name": "Liberia"
  },
  {
    "flag": "🇱🇾",
    "name": "Libye"
  },
  {
    "flag": "🇱🇮",
    "name": "Liechtenstein"
  },
  {
    "flag": "🇱🇹",
    "name": "Lituanie"
  },
  {
    "flag": "🇱🇺",
    "name": "Luxembourg"
  },
  {
    "flag": "🇲🇰",
    "name": "Macédoine du Nord"
  },
  {
    "flag": "🇲🇬",
    "name": "Madagascar"
  },
  {
    "flag": "🇲🇾",
    "name": "Malaisie"
  },
  {
    "flag": "🇲🇼",
    "name": "Malawi"
  },
  {
    "flag": "🇲🇻",
    "name": "Maldives"
  },
  {
    "flag": "🇲🇱",
    "name": "Mali"
  },
  {
    "flag": "🇲🇹",
    "name": "Malte"
  },
  {
    "flag": "🇲🇦",
    "name": "Maroc"
  },
  {
    "flag": "🇲🇶",
    "name": "Martinique"
  },
  {
    "flag": "🇲🇺",
    "name": "Maurice"
  },
  {
    "flag": "🇲🇷",
    "name": "Mauritanie"
  },
  {
    "flag": "🇾🇹",
    "name": "Mayotte"
  },
  {
    "flag": "🇲🇽",
    "name": "Mexique"
  },
  {
    "flag": "🇫🇲",
    "name": "Micronésie"
  },
  {
    "flag": "🇲🇩",
    "name": "Moldavie"
  },
  {
    "flag": "🇲🇨",
    "name": "Monaco"
  },
  {
    "flag": "🇲🇳",
    "name": "Mongolie"
  },
  {
    "flag": "🇲🇸",
    "name": "Montserrat"
  },
  {
    "flag": "🇲🇪",
    "name": "Monténégro"
  },
  {
    "flag": "🇲🇿",
    "name": "Mozambique"
  },
  {
    "flag": "🇲🇲",
    "name": "Myanmar (Birmanie)"
  },
  {
    "flag": "🇳🇦",
    "name": "Namibie"
  },
  {
    "flag": "🇳🇷",
    "name": "Nauru"
  },
  {
    "flag": "🇳🇮",
    "name": "Nicaragua"
  },
  {
    "flag": "🇳🇪",
    "name": "Niger"
  },
  {
    "flag": "🇳🇬",
    "name": "Nigeria"
  },
  {
    "flag": "🇳🇺",
    "name": "Niue"
  },
  {
    "flag": "🇳🇴",
    "name": "Norvège"
  },
  {
    "flag": "🇳🇨",
    "name": "Nouvelle-Calédonie"
  },
  {
    "flag": "🇳🇿",
    "name": "Nouvelle-Zélande"
  },
  {
    "flag": "🇳🇵",
    "name": "Népal"
  },
  {
    "flag": "🇴🇲",
    "name": "Oman"
  },
  {
    "flag": "🇺🇬",
    "name": "Ouganda"
  },
  {
    "flag": "🇺🇿",
    "name": "Ouzbékistan"
  },
  {
    "flag": "🇵🇰",
    "name": "Pakistan"
  },
  {
    "flag": "🇵🇼",
    "name": "Palaos"
  },
  {
    "flag": "🇵🇦",
    "name": "Panama"
  },
  {
    "flag": "🇵🇬",
    "name": "Papouasie-Nouvelle-Guinée"
  },
  {
    "flag": "🇵🇾",
    "name": "Paraguay"
  },
  {
    "flag": "🇳🇱",
    "name": "Pays-Bas"
  },
  {
    "flag": "🇧🇶",
    "name": "Pays-Bas caribéens"
  },
  {
    "flag": "🇵🇭",
    "name": "Philippines"
  },
  {
    "flag": "🇵🇱",
    "name": "Pologne"
  },
  {
    "flag": "🇵🇫",
    "name": "Polynésie française"
  },
  {
    "flag": "🇵🇷",
    "name": "Porto Rico"
  },
  {
    "flag": "🇵🇹",
    "name": "Portugal"
  },
  {
    "flag": "🇵🇪",
    "name": "Pérou"
  },
  {
    "flag": "🇶🇦",
    "name": "Qatar"
  },
  {
    "flag": "🇭🇰",
    "name": "Hong Kong"
  },
  {
    "flag": "🇲🇴",
    "name": "Macao"
  },
  {
    "flag": "🇷🇴",
    "name": "Roumanie"
  },
  {
    "flag": "🇬🇧",
    "name": "Royaume-Uni"
  },
  {
    "flag": "🇷🇺",
    "name": "Russie"
  },
  {
    "flag": "🇷🇼",
    "name": "Rwanda"
  },
  {
    "flag": "🇨🇫",
    "name": "République centrafricaine"
  },
  {
    "flag": "🇩🇴",
    "name": "République dominicaine"
  },
  {
    "flag": "🇪🇭",
    "name": "Sahara occidental"
  },
  {
    "flag": "🇧🇱",
    "name": "Saint-Barthélemy"
  },
  {
    "flag": "🇰🇳",
    "name": "Saint-Christophe-et-Niévès"
  },
  {
    "flag": "🇸🇲",
    "name": "Saint-Marin"
  },
  {
    "flag": "🇲🇫",
    "name": "Saint-Martin"
  },
  {
    "flag": "🇸🇽",
    "name": "Saint-Martin (partie néerlandaise)"
  },
  {
    "flag": "🇵🇲",
    "name": "Saint-Pierre-et-Miquelon"
  },
  {
    "flag": "🇻🇨",
    "name": "Saint-Vincent-et-les Grenadines"
  },
  {
    "flag": "🇸🇭",
    "name": "Sainte-Hélène"
  },
  {
    "flag": "🇱🇨",
    "name": "Sainte-Lucie"
  },
  {
    "flag": "🇸🇻",
    "name": "Salvador"
  },
  {
    "flag": "🇼🇸",
    "name": "Samoa"
  },
  {
    "flag": "🇦🇸",
    "name": "Samoa américaines"
  },
  {
    "flag": "🇸🇹",
    "name": "Sao Tomé-et-Principe"
  },
  {
    "flag": "🇷🇸",
    "name": "Serbie"
  },
  {
    "flag": "🇸🇨",
    "name": "Seychelles"
  },
  {
    "flag": "🇸🇱",
    "name": "Sierra Leone"
  },
  {
    "flag": "🇸🇬",
    "name": "Singapour"
  },
  {
    "flag": "🇸🇰",
    "name": "Slovaquie"
  },
  {
    "flag": "🇸🇮",
    "name": "Slovénie"
  },
  {
    "flag": "🇸🇴",
    "name": "Somalie"
  },
  {
    "flag": "🇸🇩",
    "name": "Soudan"
  },
  {
    "flag": "🇸🇸",
    "name": "Soudan du Sud"
  },
  {
    "flag": "🇱🇰",
    "name": "Sri Lanka"
  },
  {
    "flag": "🇨🇭",
    "name": "Suisse"
  },
  {
    "flag": "🇸🇷",
    "name": "Suriname"
  },
  {
    "flag": "🇸🇪",
    "name": "Suède"
  },
  {
    "flag": "🇸🇯",
    "name": "Svalbard et Jan Mayen"
  },
  {
    "flag": "🇸🇾",
    "name": "Syrie"
  },
  {
    "flag": "🇸🇳",
    "name": "Sénégal"
  },
  {
    "flag": "🇹🇯",
    "name": "Tadjikistan"
  },
  {
    "flag": "🇹🇿",
    "name": "Tanzanie"
  },
  {
    "flag": "🇹🇼",
    "name": "Taïwan"
  },
  {
    "flag": "🇹🇩",
    "name": "Tchad"
  },
  {
    "flag": "🇨🇿",
    "name": "Tchéquie"
  },
  {
    "flag": "🇹🇫",
    "name": "Terres australes françaises"
  },
  {
    "flag": "🇮🇴",
    "name": "Territoire britannique de l’océan Indien"
  },
  {
    "flag": "🇵🇸",
    "name": "Palestine"
  },
  {
    "flag": "🇹🇭",
    "name": "Thaïlande"
  },
  {
    "flag": "🇹🇱",
    "name": "Timor oriental"
  },
  {
    "flag": "🇹🇬",
    "name": "Togo"
  },
  {
    "flag": "🇹🇰",
    "name": "Tokelau"
  },
  {
    "flag": "🇹🇴",
    "name": "Tonga"
  },
  {
    "flag": "🇹🇹",
    "name": "Trinité-et-Tobago"
  },
  {
    "flag": "🇹🇳",
    "name": "Tunisie"
  },
  {
    "flag": "🇹🇲",
    "name": "Turkménistan"
  },
  {
    "flag": "🇹🇷",
    "name": "Turquie"
  },
  {
    "flag": "🇹🇻",
    "name": "Tuvalu"
  },
  {
    "flag": "🇺🇦",
    "name": "Ukraine"
  },
  {
    "flag": "🇺🇾",
    "name": "Uruguay"
  },
  {
    "flag": "🇻🇺",
    "name": "Vanuatu"
  },
  {
    "flag": "🇻🇪",
    "name": "Venezuela"
  },
  {
    "flag": "🇻🇳",
    "name": "Viêt Nam"
  },
  {
    "flag": "🇼🇫",
    "name": "Wallis-et-Futuna"
  },
  {
    "flag": "🇾🇪",
    "name": "Yémen"
  },
  {
    "flag": "🇿🇲",
    "name": "Zambie"
  },
  {
    "flag": "🇿🇼",
    "name": "Zimbabwe"
  },
  {
    "flag": "🇪🇬",
    "name": "Égypte"
  },
  {
    "flag": "🇦🇪",
    "name": "Émirats arabes unis"
  },
  {
    "flag": "🇪🇨",
    "name": "Équateur"
  },
  {
    "flag": "🇪🇷",
    "name": "Érythrée"
  },
  {
    "flag": "🇻🇦",
    "name": "État de la Cité du Vatican"
  },
  {
    "flag": "🇺🇸",
    "name": "États-Unis"
  },
  {
    "flag": "🇪🇹",
    "name": "Éthiopie"
  },
  {
    "flag": "🇧🇻",
    "name": "Île Bouvet"
  },
  {
    "flag": "🇨🇽",
    "name": "Île Christmas"
  },
  {
    "flag": "🇳🇫",
    "name": "Île Norfolk"
  },
  {
    "flag": "🇮🇲",
    "name": "Île de Man"
  },
  {
    "flag": "🇰🇾",
    "name": "Îles Caïmans"
  },
  {
    "flag": "🇨🇨",
    "name": "Îles Cocos"
  },
  {
    "flag": "🇨🇰",
    "name": "Îles Cook"
  },
  {
    "flag": "🇫🇴",
    "name": "Îles Féroé"
  },
  {
    "flag": "🇭🇲",
    "name": "Îles Heard-et-MacDonald"
  },
  {
    "flag": "🇫🇰",
    "name": "Îles Malouines"
  },
  {
    "flag": "🇲🇵",
    "name": "Îles Mariannes du Nord"
  },
  {
    "flag": "🇲🇭",
    "name": "Îles Marshall"
  },
  {
    "flag": "🇵🇳",
    "name": "Îles Pitcairn"
  },
  {
    "flag": "🇸🇧",
    "name": "Îles Salomon"
  },
  {
    "flag": "🇹🇨",
    "name": "Îles Turques-et-Caïques"
  },
  {
    "flag": "🇻🇬",
    "name": "Îles Vierges britanniques"
  },
  {
    "flag": "🇻🇮",
    "name": "Îles Vierges des États-Unis"
  },
  {
    "flag": "🇺🇲",
    "name": "Îles mineures éloignées des États-Unis"
  },
  {
    "flag": "🇦🇽",
    "name": "Îles Åland"
  }
];