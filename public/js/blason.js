
    const tinctures = ['argent', 'or', 'gules', 'azure', 'vert', 'sable', 'purpure'];
    const tinctureColors = {
      argent: '#f8f8f8',
      or: '#ffd700',
      gules: '#e60026',
      azure: '#0033a0',
      vert: '#228b22',
      sable: '#000000',
      purpure: '#660099'
    };
    const divisions = ['per pale', 'per fess', 'plain'];
    const charges = ['circle', 'cross', 'star', 'diamond'];

    function generateBlazon() {
      const field = divisions[Math.floor(Math.random() * divisions.length)];
      let t1 = tinctures[Math.floor(Math.random() * tinctures.length)];
      let t2 = tinctures[Math.floor(Math.random() * tinctures.length)];
      while (t1 === t2) t2 = tinctures[Math.floor(Math.random() * tinctures.length)];
      const charge = charges[Math.floor(Math.random() * charges.length)];
      return { field, t1, t2, charge };
    }

    function drawBlazon(blazon) {
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 200 250");

      // fond
      if (blazon.field === 'plain') {
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("width", "200");
        rect.setAttribute("height", "250");
        rect.setAttribute("fill", tinctureColors[blazon.t1]);
        svg.appendChild(rect);
      } else if (blazon.field === 'per pale') {
        const left = document.createElementNS(svgNS, "rect");
        left.setAttribute("x", "0");
        left.setAttribute("y", "0");
        left.setAttribute("width", "100");
        left.setAttribute("height", "250");
        left.setAttribute("fill", tinctureColors[blazon.t1]);
        svg.appendChild(left);

        const right = document.createElementNS(svgNS, "rect");
        right.setAttribute("x", "100");
        right.setAttribute("y", "0");
        right.setAttribute("width", "100");
        right.setAttribute("height", "250");
        right.setAttribute("fill", tinctureColors[blazon.t2]);
        svg.appendChild(right);
      } else if (blazon.field === 'per fess') {
        const top = document.createElementNS(svgNS, "rect");
        top.setAttribute("x", "0");
        top.setAttribute("y", "0");
        top.setAttribute("width", "200");
        top.setAttribute("height", "125");
        top.setAttribute("fill", tinctureColors[blazon.t1]);
        svg.appendChild(top);

        const bottom = document.createElementNS(svgNS, "rect");
        bottom.setAttribute("x", "0");
        bottom.setAttribute("y", "125");
        bottom.setAttribute("width", "200");
        bottom.setAttribute("height", "125");
        bottom.setAttribute("fill", tinctureColors[blazon.t2]);
        svg.appendChild(bottom);
      }

      // charge
      const shape = document.createElementNS(svgNS, "path");
      shape.setAttribute("fill", "#fff");

      switch (blazon.charge) {
        case 'circle':
          shape.setAttribute("d", "M 100 125 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0");
          break;
        case 'cross':
          shape.setAttribute("d", "M90 90 H110 V110 H130 V130 H110 V150 H90 V130 H70 V110 H90 Z");
          break;
        case 'star':
          shape.setAttribute("d", "M100,75 L110,110 L145,110 L115,130 L125,165 L100,145 L75,165 L85,130 L55,110 L90,110 Z");
          break;
        case 'diamond':
          shape.setAttribute("d", "M100,80 L130,125 L100,170 L70,125 Z");
          break;
      }

      svg.appendChild(shape);

      const container = document.getElementById("blason");
      container.innerHTML = "";
      container.appendChild(svg);

		const traductionField = {
		  'plain': 'plein',
		  'per pale': 'coupé verticalement',
		  'per fess': 'coupé horizontalement'
		};
		const traductionTinctures = {
		  argent: 'argent', or: 'or', gules: 'gueules', azure: 'azur',
		  vert: 'sinople', sable: 'sable', purpure: 'pourpre'
		};
		const traductionCharges = {
		  circle: 'rond', cross: 'croix', star: 'étoile', diamond: 'losange'
		};

		document.getElementById("blasonDesc").textContent =
		  `Champ : ${traductionField[blazon.field]}, Émaux : ${traductionTinctures[blazon.t1]} & ${traductionTinctures[blazon.t2]}, Figure : ${traductionCharges[blazon.charge]}`;

    }

    document.getElementById("generate").onclick = () => {
      const b = generateBlazon();
      drawBlazon(b);
    };

    // generate at load
    window.onload = () => {
      const b = generateBlazon();
      drawBlazon(b);
    };
