function redirectToMessage(event) {
  event.preventDefault(); // empêche l'envoi normal du formulaire

  // sérialiser le blason SVG
  const svg = document.querySelector("#blason svg");
  let svgEncoded = "";
  if (svg) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    svgEncoded = encodeURIComponent(svgString);
  }
    const genre = document.querySelector("input[name='genrePers']:checked")?.value || "";
  const genre1 = document.querySelector("input[name='genreP1']:checked")?.value || "";
  const genre2 = document.querySelector("input[name='genreP2']:checked")?.value || "";


  // récupérer les champs
const data = {
  prenom: document.getElementById("prenom").value,
  nom: document.getElementById("nom").value,
  residence: document.getElementById("villeR").value,
  pays: document.getElementById("pays").value,
  naissanceVille: document.getElementById("villeN").value,
  naissanceDate: document.getElementById("repDay").value + " " +
                  document.getElementById("repMonth").value + " an " +
                  document.getElementById("repYear").value,
  parent1: document.getElementById("parent1").value,
  parent2: document.getElementById("parent2").value,
    genre: genre,
    genre1: genre1,
    genre2: genre2,
  blasonSvg: svgEncoded,
    sujet: document.getElementById("sujet").value,
  message: document.getElementById("message").value
};


  // Envoyer l'email
  const emailBody = `Prénom: ${data.prenom}\nNom: ${data.nom}\nEmail: ${data.email}\nSujet: ${data.sujet}\nMessage: ${data.message}`;
  window.location.href = `mailto:andreasmulard@gmail.com?subject=${encodeURIComponent(data.sujet || 'Formulaire de contact')}&body=${encodeURIComponent(emailBody)}`;
  
  // convertir en query string et rediriger
  const query = new URLSearchParams(data).toString();
  setTimeout(() => window.location.href = `message.html?${query}`, 100);
}