
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
const wordGrid = document.getElementById("wordGrid");
const stickyGrid = document.getElementById("grid");
const closeBtn = document.getElementById("closePicker");
let currentField = null;

function capitalizeSmart(text){
  return text
    .toLowerCase()
    .replace(/(^|[\s-])([\S])/g, (m,p1,p2) => p1 + p2.toUpperCase());
}

function renderStickyGrid() {
  stickyGrid.innerHTML = "";
  for (let key in wordPool) {
    const words = wordPool[key];
    const word = words[Math.floor(Math.random() * words.length)];
    const btn = document.createElement("button");
	btn.type = "button";
    btn.textContent = word;
    btn.onclick = () => {
      if (!currentField) return;
      const char = key;
      currentField.value += (currentField.id === "email") ? char.toLowerCase() : key;
      currentField.value = capitalizeSmart(currentField.value);
      btn.textContent = words[Math.floor(Math.random() * words.length)];
    };
    stickyGrid.appendChild(btn);
  }
}
function renderPopupGrid() {
  wordGrid.innerHTML = "";
  for (let key in wordPool) {
    const words = wordPool[key];
    const word = words[Math.floor(Math.random() * words.length)];
    const btn = document.createElement("button");
    btn.type = "button"; // 👈 Empêche le submit
    btn.textContent = word;
    btn.onclick = () => {
      if (!currentField) return;
      const char = key;
      currentField.value += (currentField.id === "email") ? char.toLowerCase() : key;
      currentField.value = capitalizeSmart(currentField.value);
      btn.textContent = words[Math.floor(Math.random() * words.length)];
    };
    wordGrid.appendChild(btn);
  }
}

function openPicker(fieldId){
  currentField = document.getElementById(fieldId);
  renderPopupGrid();
  picker.style.display = "block";
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

window.addEventListener("DOMContentLoaded", () => {
  //renderStickyGrid();
});
