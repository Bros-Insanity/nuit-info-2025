
    const params = new URLSearchParams(window.location.search);

    function articleDe(word) {
      return /^[aeiouyhâêîôûéèëïüœàù]/i.test(word) ? "d’" : "de ";
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

    const prenom = params.get("prenom") || "";
    const nom = params.get("nom") || "";
    const residence = nomAvecParticule(params.get("residence") || "");
    const naissanceVille = nomAvecParticule(params.get("naissanceVille") || "");
    const parent1 = params.get("parent1") || "";
    const parent2 = params.get("parent2") || "";
    const genre = params.get("genre") || "Homme";
    const genre1 = params.get("genre1") || "Homme";
    const genre2 = params.get("genre2") || "Homme";
    const sujet = params.get("sujet") || "";
    const message = params.get("message") || "";

    const titreCher = genre === "Femme" ? "Chère" : "Cher";
    const titreComte = genre === "Femme" ? "comtesse" : "comte";
    const titreNe = accordeGenre(genre, "né");
    const aime = accordeGenre(genre1, "aimé");
    const respecte = accordeGenre(genre2, "respecté");
    const respecteArticle = genre2 === "Femme" ? "de la" : "du";

    const confirmation = `
      <p>${titreCher} ${prenom} Ier ${hasParticle(nom) ? nom : "de " + nom}, ${titreComte} ${residence},</p>
      <p>${titreNe} des Terres ${naissanceVille},</p>
      <p>et enfant de l’${aime} ${parent1} et ${respecteArticle} ${respecte} ${parent2}.</p>
      <p>Par les droits conférés par le Royaume des Informaticiens, moi, Andreas Ier de Mulard,</p>
      <p>né sur le comté de Chambray-lès-Tours, te remercie pour cette requête,</p>
      <p>et te prie de croire qu’en les plus brefs délais, nous y répondrons.</p>
      <hr>
      <h3>📌 Sujet :</h3>
      <p>${sujet}</p>
      <h3>💬 Message :</h3>
      <p>${message}</p>
    `;

    document.getElementById("confirmationMessage").innerHTML = confirmation;
