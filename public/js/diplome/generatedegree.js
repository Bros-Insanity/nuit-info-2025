const params = new URLSearchParams(window.location.search);

function articleDe(word) {
  const startsWithVowel = /^[aeiouyhâêîôûéèëïüœàù]/i.test(word);
  return startsWithVowel ? "d’" : "de ";
}

function hasParticle(nom) {
  return /^(de|du|des|d’|d')\s?/i.test(nom.trim());
}

function nomAvecParticule(nom) {
  return hasParticle(nom) ? nom : articleDe(nom) + nom;
}

function accordeGenre(genre, base) {
  if (genre === "Femme") return base + "e";
  if (genre === "Non-binaire") return base + "·e";
  return base;
}

const genre = params.get("genre");
const genre1 = params.get("genre1");
const genre2 = params.get("genre2");
const prenom = params.get("prenom");
const nom = params.get("nom");
const parent1 = params.get("parent1");
const parent2 = params.get("parent2");
const residence = nomAvecParticule(params.get("residence"));
const naissanceVille = nomAvecParticule(params.get("naissanceVille"));
const pays = params.get("pays");

const ne = accordeGenre(genre, "né");
const aime = accordeGenre(genre1, "aimé");
const respecte = accordeGenre(genre2, "respecté");
const paysAvecArticle = articleDe(pays) + pays;
const titreComte = genre === "Femme" ? "comtesse" : "comte";
const comteNom = `${prenom} ${hasParticle(nom) ? nom : "de " + nom}, ${titreComte} ${residence}`;
const titreCher = genre === "Femme" ? "Chère" : "Cher";

function articleEtAdjectif(genre, base) {
  if (genre === "Femme") return "de la " + base + "e";
  if (genre === "Non-binaire") return "de la " + base + "·e";
  return "du " + base;
}

const message = `${titreCher} ${prenom} Ier ${hasParticle(nom) ? nom : "de " + nom}, ${titreComte} ${residence}, vassal du roi ${paysAvecArticle},
${ne} des Terres ${naissanceVille} le ${params.get("naissanceDate")},
fruit de l’union de l’${aime} ${parent1} et ${articleEtAdjectif(genre2, "respecté")} ${parent2}.

Par les droits conférés par le Royaume des Informaticiens, moi, Andreas Ier de Mulard,
né sur le comté de Chambray-lès-Tours, te confirme le titre de Chevalier de la RSE,
et la gloire qu’il incarne.`;


document.getElementById("messageRSE").textContent = message;

// Afficher blason SVG
const svgCode = params.get("blasonSvg");
if (svgCode) {
  const decoded = decodeURIComponent(decodeURIComponent(svgCode));
  if (decoded.includes("<svg")) {
    document.getElementById("blasonContainer").innerHTML = decoded;
  }
}

async function convertSvgElementToPng(svgElement, width = 100, height = 100) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

async function genererPDF() {
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // PAGE 1
  const page1 = pdfDoc.addPage();
  page1.setFont(times);
  page1.setFontSize(12);
  const { width, height } = page1.getSize();
  page1.drawText(message, { x: 50, y: height - 80, size: 12, lineHeight: 16 });

  // PAGE 2 (paysage)
  const landscapeWidth = height;
  const landscapeHeight = width;
  const page2 = pdfDoc.addPage([landscapeWidth, landscapeHeight]);
  page2.setFont(times);
  page2.setFontSize(14);

  page2.drawText("Société Chevaleresque des Programmeurs 37", {
    x: landscapeWidth / 2 - 180,
    y: landscapeHeight - 50
  });

  page2.drawText(`Est délivré à ${comteNom}`, {
    x: 100,
    y: landscapeHeight - 120
  });

  page2.drawText("le rang de Chevalier de la RSE et les droits qui y sont liés", {
    x: 100,
    y: landscapeHeight - 150
  });

  page2.drawText(comteNom, {
    x: 50,
    y: 100
  });

  page2.drawText("Andreas Ier de Mulard", {
    x: landscapeWidth - 250,
    y: 100
  });


	const svgElement = document.querySelector("#blasonContainer svg");
	if (svgElement) {
	  try {
		const pngBuffer = await convertSvgElementToPng(svgElement, 100, 100);
		const pngImage = await pdfDoc.embedPng(pngBuffer);
		page2.drawImage(pngImage, { x: 50, y: 130, width: 100, height: 100 });
	  } catch (e) {
		console.error("Erreur génération image blason :", e);
	  }
	}
  // Blason utilisateur (SVG)
  if (svgCode && svgCode.includes("<svg")) {
    try {
      const svgImage = await pdfDoc.embedSvg(decodeURIComponent(svgCode), { width: 100, height: 100 });
      page2.drawImage(svgImage, { x: 50, y: 130, width: 100, height: 100 });
    } catch (e) {
      console.error("Erreur SVG:", e);
    }
  }

  // Logo officiel SCP37 (à droite)
const logoUrl = "https://scp37.com/media/blason.png";

  const imageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const image = await pdfDoc.embedPng(imageBytes);
  page2.drawImage(image, {
    x: landscapeWidth - 150,
    y: 130,
    width: 100,
    height: 100
  });

  // Télécharger le PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "diplome_chevalier.pdf";
  link.click();
}