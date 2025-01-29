let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

let nbPage = 0;
let pageSize = 6;
let startIndex = 0;
let endIndex = 0;
let page = 1;
let action = 'add';

function loadXMLDoc() {
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      initSetFavoriteBiens();
      fetchFavoriteBiens();
      showPageLinks();
      fetchData();
    }
  };
  xmlhttp.open("GET", "../data/bdd.xml", true);
  xmlhttp.send();
}

function fetchData() {
  let i;
  let xmlDoc = xmlhttp.responseXML;
  let table =
    "<tr><th>ID</th><th>Prix</th><th>Localisation</th><th>Type de Bien</th><th>Nombre de Pieces</th><th>Surface</th><th>Sejour</th><th>Description</th><th>image</th><th></th><th></th><th></th></tr>";
  let x = xmlDoc.getElementsByTagName("bien");
  //Calculer nbPage
  nbPage = x.length / pageSize;
  //Calculer startIndex et endIndex
  startIndex = (page - 1) * pageSize;
  endIndex = Math.min(startIndex + pageSize, x.length);
  for (i = startIndex; i < endIndex; i++) {
    table +=
      "<tr><td width=50>" +
      x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue +
      "</td><td width=120>" +
      x[i].getElementsByTagName("prix")[0].childNodes[0].nodeValue +
      "</td><td width=120>" +
      x[i].getElementsByTagName("localisation")[0].childNodes[0].nodeValue +
      "</td><td width=120>" +
      x[i].getElementsByTagName("type_bien")[0].childNodes[0].nodeValue +
      "</td><td width=120>" +
      x[i].getElementsByTagName("nbpieces")[0].childNodes[0].nodeValue +
      "</td><td width=120>" +
      x[i].getElementsByTagName("surface")[0].childNodes[0].nodeValue +
      "</td><td width=120>" +
      x[i].getElementsByTagName("sejour")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue +
      "</td><td width=200><img src=" +
      x[i].getElementsByTagName("image")[0].childNodes[0].nodeValue +
      " width=150 height=150></td>" +
      '<td><button type="button" class="btn btn-light" id="btnEdit" onclick="editBien(' +
      x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue +
      ')">' +
      "Edit</button></td>" +
      '<td><button type="button" class="btn btn-secondary" onclick="deleteBien(' +
      x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue +
      ')">' +
      "Delete</button></td>" +
      "</td><td>";
    if (sFav.has(x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue)) {
      table +=
        "<input type='checkbox' checked onclick='setFavorite(event)' value='" +
        x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue +
        "'>" +
        "</td>" +
        "</tr>";
    } else {
      table +=
        "<input type='checkbox' onclick='setFavorite(event)' value='" +
        x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue +
        "'>" +
        "</td>" +
        "</tr>";
    }
  }
  document.getElementById("data").innerHTML = table;
  showPageLinks();
}

function loadPage(pageNumber) {
  //Mettre à jour la valeur de page en fonction de pageNumber
  page = pageNumber;

  //Appeler la fonction fetchData
  fetchData();
}

function showPageLinks() {
  let divpl = document.getElementById("pageLinks");
  divpl.style.display = "block";
  let xmlDoc = xmlhttp.responseXML;
  let x = xmlDoc.getElementsByTagName("bien");
  let totalItems = x.length;
  let totalPages = Math.ceil(totalItems / pageSize);

  let paginationButtons = " ";
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons +=
      "<input type='button' class='btn btn-primary' onclick ='loadPage(" +
      i +
      ")' value='" +
      i +
      "'></input>";
  }
  divpl.innerHTML = paginationButtons;
}

function deleteBien(id) {
  let xmlDoc = xmlhttp.responseXML;
  let biens = xmlDoc.getElementsByTagName("bien");
  let bien;

  for (i = 0; i < biens.length; i++) {
    if (biens[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue == id) {
      bien = biens[i];
    }
  }

  xmlDoc.documentElement.removeChild(bien);
  fetchData();
}

function Search() {
  let PrixRecherche = parseFloat(document.getElementById("priceInput").value);
  let IdRecherche = parseFloat(document.getElementById("referenceInput").value);
  let xmlDoc = xmlhttp.responseXML;
  let biens = xmlDoc.getElementsByTagName("bien");

  // Créez une liste des biens à supprimer
  let biensASupprimer = [];

  for (let i = 0; i < biens.length; i++) {
    let bien = biens[i];
    let bienId = parseFloat(bien.querySelector("ID").textContent);
    let bienPrix = parseFloat(bien.querySelector("prix").textContent);
    if (bienId !== IdRecherche && bienPrix !== PrixRecherche) {
      // Ajoutez le bien à la liste des biens à supprimer
      biensASupprimer.push(bien);
    }
  }
  // Supprimez les biens de la liste
  for (let i = 0; i < biensASupprimer.length; i++) {
    xmlDoc.documentElement.removeChild(biensASupprimer[i]);
  }
  // Mettez à jour l'affichage
  fetchData();
}

function filter() {
  let Ascendant = document.getElementById("sortAsc").checked;
  let Descendant = document.getElementById("sortDesc").checked;
  let PrixMinimum = document.getElementById("PrixMinimum").value;
  PrixMinimum = parseFloat(PrixMinimum.replace(' ', ''));
  let PrixMaximum = document.getElementById("PrixMaximum").value;
  PrixMaximum = parseFloat(PrixMaximum.replace(' ', ''));
  let Quartier = document.getElementById("Quartier").value;
  let xmlDoc = xmlhttp.responseXML;
  let biens = xmlDoc.getElementsByTagName("bien");

  // Créez une liste des biens à supprimer
  let biensASupprimer = [];
  let biensFiltrer = [];

  for (let i = 0; i < biens.length; i++) {
    let bien = biens[i];
    let bienPrix = bien.querySelector("prix").textContent;
    bienPrix = parseFloat(bienPrix.replace(' ', ''));
    let bienQuartier = bien.querySelector("localisation").textContent;
    let bienType = bien.querySelector("type_bien").textContent;

    // Vérifiez si la case à cocher correspondant au type de bien est cochée
    let maisonCheckbox = document.getElementById("maisonCheckbox");
    let appartementCheckbox = document.getElementById("appartementCheckbox");
    let villaCheckbox = document.getElementById("villaCheckbox");
    let penthouseCheckbox = document.getElementById("penthouseCheckbox");
    let chaletCheckbox = document.getElementById("chaletCheckbox");

    if (
      !((maisonCheckbox.checked && bienType !== "Maison") ||
        (appartementCheckbox.checked && bienType !== "Appartement") ||
        (villaCheckbox.checked && bienType !== "Villa") ||
        (penthouseCheckbox.checked && bienType !== "Penthouse") ||
        (chaletCheckbox.checked && bienType !== "Chalet") ||
        bienPrix < PrixMinimum ||
        bienPrix > PrixMaximum ||
        (Quartier !== "" && bienQuartier !== Quartier))
    ) {
      biensFiltrer.push(bien);
    } else {
      biensASupprimer.push(bien);
    }
  }

  // Triez tous les biens en fonction de l'option de tri sélectionnée
  if (Ascendant) {
    Array.from(biensFiltrer)
      .sort(function (a, b) {
        return (
          parseFloat(a.querySelector("prix").textContent) -
          parseFloat(b.querySelector("prix").textContent)
        );
      })
      .forEach(function (bien) {
        // Ajoutez chaque bien trié au document XML
        xmlDoc.documentElement.appendChild(bien);
      });
  } else if (Descendant) {
    Array.from(biensFiltrer)
      .sort(function (a, b) {
        return (
          parseFloat(b.querySelector("prix").textContent) -
          parseFloat(a.querySelector("prix").textContent)
        );
      })
      .forEach(function (bien) {
        // Ajoutez chaque bien trié au document XML
        xmlDoc.documentElement.appendChild(bien);
      });
  }

  for (let i = 0; i < biensASupprimer.length; i++) {
    xmlDoc.documentElement.removeChild(biensASupprimer[i]);
  }

  // Mettez à jour l'affichage
  fetchData();
}

function editBien(id) {
  action = "edit";
  let tblBien = document.getElementById("tblBien");
  let txtPrix = document.getElementById("txtPrix");
  let txtLocalisation = document.getElementById("txtLocalisation");
  let txtTypeBien = document.getElementById("txtTypeBien");
  let txtNbPieces = document.getElementById("txtNbPieces");
  let txtSurface = document.getElementById("txtSurface");
  let txtSejour = document.getElementById("txtSejour");
  let txtDescription = document.getElementById("txtDescription");
  let txtImage = document.getElementById("txtImage");
  let hId = document.getElementById("hId");

  let xmlDoc = xmlhttp.responseXML;
  let biens = xmlDoc.getElementsByTagName("bien");
  let bien;

  for (i = 0; i < biens.length; i++) {
    if (biens[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue == id) {
      bien = biens[i];
    }
  }

  tblBien.style.display = "block";
  hId.value = bien.getElementsByTagName("ID")[0].childNodes[0].nodeValue;
  txtPrix.value = bien.getElementsByTagName("prix")[0].childNodes[0].nodeValue;
  txtLocalisation.value =
    bien.getElementsByTagName("localisation")[0].childNodes[0].nodeValue;
  txtTypeBien.value =
    bien.getElementsByTagName("type_bien")[0].childNodes[0].nodeValue;
  txtNbPieces.value =
    bien.getElementsByTagName("nbpieces")[0].childNodes[0].nodeValue;
  txtSurface.value =
    bien.getElementsByTagName("surface")[0].childNodes[0].nodeValue;
  txtSejour.value =
    bien.getElementsByTagName("sejour")[0].childNodes[0].nodeValue;
  txtDescription.value =
    bien.getElementsByTagName("description")[0].childNodes[0].nodeValue;
  txtImage.value =
    bien.getElementsByTagName("image")[0].childNodes[0].nodeValue;
}

function updateBien() {
  console.log('updateBien');
  let xmlDoc = xmlhttp.responseXML;
  let id = document.getElementById("hId").value;
  let biens = xmlDoc.getElementsByTagName("bien");
  let bien;

  for (i = 0; i < biens.length; i++) {
    if (biens[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue == id) {
      bien = biens[i];
    }
  }

  let txtPrix = document.getElementById("txtPrix");
  let txtLocalisation = document.getElementById("txtLocalisation");
  let txtTypeBien = document.getElementById("txtTypeBien");
  let txtNbPieces = document.getElementById("txtNbPieces");
  let txtSurface = document.getElementById("txtSurface");
  let txtSejour = document.getElementById("txtSejour");
  let txtDescription = document.getElementById("txtDescription");
  let txtImage = document.getElementById("txtImage");

  bien.getElementsByTagName("prix")[0].childNodes[0].nodeValue = txtPrix.value;
  bien.getElementsByTagName("localisation")[0].childNodes[0].nodeValue =
    txtLocalisation.value;
  bien.getElementsByTagName("type_bien")[0].childNodes[0].nodeValue =
    txtTypeBien.value;
  bien.getElementsByTagName("nbpieces")[0].childNodes[0].nodeValue =
    txtNbPieces.value;
  bien.getElementsByTagName("surface")[0].childNodes[0].nodeValue =
    txtSurface.value;
  bien.getElementsByTagName("sejour")[0].childNodes[0].nodeValue =
    txtSejour.value;
  bien.getElementsByTagName("description")[0].childNodes[0].nodeValue =
    txtDescription.value;
  bien.getElementsByTagName("image")[0].childNodes[0].nodeValue =
    txtImage.value;

  fetchData();
}

function cancelBienForm() {
  let tblBien = document.getElementById("tblBien");
  tblBien.style.display = "none";
}

function showAddForm() {
  action = "add";
  let tblBien = document.getElementById("tblBien");
  let txtPrix = document.getElementById("txtPrix");
  let txtLocalisation = document.getElementById("txtLocalisation");
  let txtTypeBien = document.getElementById("txtTypeBien");
  let txtNbPieces = document.getElementById("txtNbPieces");
  let txtSurface = document.getElementById("txtSurface");
  let txtSejour = document.getElementById("txtSejour");
  let txtDescription = document.getElementById("txtDescription");
  let txtImage = document.getElementById("txtImage");
  let hId = document.getElementById("hId");

  // Effacez le contenu des champs du formulaire pour le nouvel ajout
  hId.value = "";
  txtPrix.value = "";
  txtLocalisation.value = "";
  txtTypeBien.value = ""; // Réinitialisez la valeur par défaut
  txtNbPieces.value = "";
  txtSurface.value = "";
  txtSejour.value = "";
  txtDescription.value = "";
  txtImage.value = "";
  console.log(btnUpdate);

  tblBien.style.display = "block";
}

function Submit() {
  if (action === "add") {
    addBien();
  } else if (action === "edit") {
    updateBien();
  }
}

function addBien() {
  let xmlDoc = xmlhttp.responseXML;
  let Biens = xmlDoc.getElementsByTagName("bien");

  let txtPrix = document.getElementById("txtPrix");
  let txtLocalisation = document.getElementById("txtLocalisation");
  let txtTypeBien = document.getElementById("txtTypeBien");
  let txtNbPieces = document.getElementById("txtNbPieces");
  let txtSurface = document.getElementById("txtSurface");
  let txtSejour = document.getElementById("txtSejour");
  let txtDescription = document.getElementById("txtDescription");
  let txtImage = document.getElementById("txtImage");

  let Bien = xmlDoc.createElement("bien");
  let id = xmlDoc.createElement("ID");
  let prix = xmlDoc.createElement("prix");
  let localisation = xmlDoc.createElement("localisation");
  let type_bien = xmlDoc.createElement("type_bien");
  let nbpieces = xmlDoc.createElement("nbpieces");
  let surface = xmlDoc.createElement("surface");
  let sejour = xmlDoc.createElement("sejour");
  let description = xmlDoc.createElement("description");
  let image = xmlDoc.createElement("image");

  let prix_value = txtPrix.value;
  let localisation_value = txtLocalisation.value;
  let type_bien_value = txtTypeBien.value;
  let nbpieces_value = txtNbPieces.value;
  let surface_value = txtSurface.value;
  let sejour_value = txtSejour.value;
  let description_value = txtDescription.value;
  let image_value = txtImage.value;

  let id_Text = xmlDoc.createTextNode(Biens.length + 1);
  id.appendChild(id_Text);
  let prix_Text = xmlDoc.createTextNode(prix_value);
  prix.appendChild(prix_Text);
  let localisation_Text = xmlDoc.createTextNode(localisation_value);
  localisation.appendChild(localisation_Text);
  let type_bien_Text = xmlDoc.createTextNode(type_bien_value);
  type_bien.appendChild(type_bien_Text);
  let nbpieces_Text = xmlDoc.createTextNode(nbpieces_value);
  nbpieces.appendChild(nbpieces_Text);
  let surface_Text = xmlDoc.createTextNode(surface_value);
  surface.appendChild(surface_Text);
  let sejour_Text = xmlDoc.createTextNode(sejour_value);
  sejour.appendChild(sejour_Text);
  let description_Text = xmlDoc.createTextNode(description_value);
  description.appendChild(description_Text);
  let image_Text = xmlDoc.createTextNode(image_value);
  image.appendChild(image_Text);

  Bien.appendChild(id);
  Bien.appendChild(prix);
  Bien.appendChild(localisation);
  Bien.appendChild(type_bien);
  Bien.appendChild(nbpieces);
  Bien.appendChild(surface);
  Bien.appendChild(sejour);
  Bien.appendChild(description);
  Bien.appendChild(image);

  let library = xmlDoc.getElementsByTagName("bdd")[0];
  library.appendChild(Bien);

  fetchData();
}

function setFavorite(ev) {
  if (ev.currentTarget.checked) {
    sFav.add(ev.currentTarget.value);
    console.log(sFav);
    console.log("Checked - ID :" + ev.currentTarget.value);
  } else {
    sFav.delete(ev.currentTarget.value);
    console.log(sFav);
    console.log("Unchecked - ID :" + ev.currentTarget.value);
  }
  fetchFavoriteBiens();
  let fchaine = Array.from(sFav).join(",");
  localStorage.setItem("favorites", fchaine);
}

function fetchFavoriteBiens() { //fonctionne
  let i;
  let xmlDoc = xmlhttp.responseXML;
  let table = "<tr><th>ID</th><th>Prix</th><th>Localisation</th><th>Type de Bien</th><th>Nombre de Pieces</th><th>Surface</th><th>Sejour</th><th>Description</th><th>image</th></tr>";
  let x = xmlDoc.getElementsByTagName("bien");

  for (i = 0; i < x.length; i++) {
    const BienId = x[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
    const prix = x[i].getElementsByTagName("prix")[0].childNodes[0].nodeValue;
    const localisation = x[i].getElementsByTagName("localisation")[0].childNodes[0].nodeValue;
    const type_bien = x[i].getElementsByTagName("type_bien")[0].childNodes[0].nodeValue;
    const nbpieces = x[i].getElementsByTagName("nbpieces")[0].childNodes[0].nodeValue;
    const surface = x[i].getElementsByTagName("surface")[0].childNodes[0].nodeValue;
    const sejour = x[i].getElementsByTagName("sejour")[0].childNodes[0].nodeValue;
    const description = x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
    const image = x[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;

    if (sFav.has(BienId)) {
      table += "<tr>" +
        "<td width = 120>" +
        BienId +
        "</td>" +
        "<td width = 120>" +
        prix +
        "</td>" +
        "<td width = 120>" +
        localisation +
        "</td>" +
        "<td width = 120>" +
        type_bien +
        "</td>" +
        "<td width = 120>" +
        nbpieces +
        "</td>" +
        "<td width = 120>" +
        surface +
        "</td>" +
        "<td width = 120>" +
        sejour +
        "</td>" +
        "<td>" +
        description +
        "</td>" +
        "<td><img src=" +
        image +
        " width=150 height=150></td>" +
        "</tr>";
    }
  }
  document.getElementById("tblFavorite").innerHTML = table;
}

function initSetFavoriteBiens() {
  if (localStorage.getItem("favorites") != null) {
    let favs = localStorage.getItem("favorites");
    let myArr = favs.split(",");
    for (let i = 0; i < myArr.length; i++) {
      console.log(myArr[i]);
      sFav.add(myArr[i]);
    }
  }
}