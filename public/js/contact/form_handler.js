const wordPool = {
  A:["Ananas","Astéroïde"], B:["Banane","Bateau"], C:["Cactus","Crabe"],
  D:["Dauphin","Dragon"], E:["Escargot","Éléphant"], F:["Fraise","Fusée"],
  G:["Galet","Guitare"], H:["Hibou","Hache"], I:["Igloo","Iris"],
  J:["Jasmin","Jungle"], K:["Koala","Kiwi"], L:["Lama","Lune"],
  M:["Mangue","Montagne"], N:["Navet","Nuage"], O:["Orange","Océan"],
  P:["Pomme","Panda"], Q:["Quiche","Quartz"], R:["Robot","Rivière"],
  S:["Soleil","Salade"], T:["Tulipe","Tigre"], U:["Uniforme","Urne"],
  V:["Vache","Vélo"], W:["Wifi","Wasabi"], X:["Xylophone","Xénon"],
  Y:["Yaourt","Yéti"], Z:["Zèbre","Zéro"],
  "@": ["@"], ".": ["."], "-": ["-"],"'": ["'"],
  "é": ["é"], "è": ["è"], "ê": ["ê"], "ë": ["ë"],
  "à": ["à"], "â": ["â"], "ä": ["ä"], "ô": ["ô"], "ö": ["ö"],
  "î": ["î"], "ï": ["ï"], "ù": ["ù"], "û": ["û"], "ç": ["ç"]
};

const picker = document.getElementById("wordPicker");
const grid = document.getElementById("wordGrid");
const closeBtn = document.getElementById("closePicker");
let currentField = null;

function capitalizeSmart(text){
  return text
    .toLowerCase()
    .replace(/(^|\s|-)(\S)/g, (m,p1,p2) => p1 + p2.toUpperCase());
}

function openPicker(fieldId){
  currentField = document.getElementById(fieldId);
  renderGrid();
  picker.style.display = "block";
}

function renderGrid(){
  grid.innerHTML = "";
  for (let key in wordPool){
    const words = wordPool[key];
    const word = words[Math.floor(Math.random() * words.length)];
    const btn = document.createElement("button");
    btn.textContent = word;
	btn.onclick = () => {
	  if (!currentField) return;
	  const char = key; // Le caractère-clé
	  if (currentField.id === "email") {
		currentField.value += char.toLowerCase();
	  } else {
		currentField.value += char.length === 1 ? char : key;
		currentField.value = capitalizeSmart(currentField.value);
	  }
	};
    grid.appendChild(btn);
  }
}

closeBtn.onclick = () => {
  picker.style.display = "none";
  currentField = null;
};

document.querySelectorAll("[data-compose]").forEach(btn=>{
  btn.onclick = () => openPicker(btn.dataset.compose);
});

document.querySelectorAll("[data-clear]").forEach(btn=>{
  btn.onclick = () => {
    const field = document.getElementById(btn.dataset.clear);
    if (field) field.value = "";
  };
});

const paysSelect = document.getElementById("pays");

function updateCountries(){
  const isRoman = document.querySelector("input[name='empire']:checked").value === "oui";
  paysSelect.innerHTML = "";
  if (isRoman){
    provinces.forEach(p=>{
      const opt = document.createElement("option");
      opt.textContent = p;
      paysSelect.appendChild(opt);
    });
  } else {
    countries.forEach(c=>{
      const opt = document.createElement("option");
      opt.textContent = c.flag;
      opt.title = c.name;
	  opt.value = c.name;
      paysSelect.appendChild(opt);
    });
  }
}
document.querySelectorAll("input[name='empire']").forEach(r=>r.onchange=updateCountries);
updateCountries();

// Date
const repMonth = document.getElementById("repMonth");
const repDay = document.getElementById("repDay");
function updateDays(){
  const m = repMonth.value;
  const max = m === "Sans-culottides" ? 5 : 30;
  repDay.innerHTML = "";
  for (let i=1;i<=max;i++){
    const opt = document.createElement("option");
    opt.textContent = i;
    repDay.appendChild(opt);
  }
}
repMonth.onchange = updateDays;
updateDays();