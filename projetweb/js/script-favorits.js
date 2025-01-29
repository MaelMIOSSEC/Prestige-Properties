let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

function loadXMLDoc() {
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            fetchFavoriteBiens();
        }
    };
    xmlhttp.open("GET", "data/bdd.xml", true);
    xmlhttp.send();
}

function fetchFavoriteBiens() {
    if (localStorage.getItem("favorites") != null) {
        let favs = localStorage.getItem("favorites");
        let myArr = favs.split(",");
        for (let i = 0; i < myArr.length; i++) {
            console.log(myArr[i]);
            sFav.add(myArr[i])
        }
    }

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
                "<td width=150>" +
                BienId +
                "</td>" +
                "<td width = 250>" +
                prix +
                "</td>" +
                "<td width = 250>" +
                localisation +
                "</td>" +
                "<td width = 150>" +
                type_bien +
                "</td>" +
                "<td width = 150>" +
                nbpieces +
                "</td>" +
                "<td width = 150>" +
                surface +
                "</td>" +
                "<td width = 150>" +
                sejour +
                "</td>" +
                "<td width = 150>" +
                description +
                "</td>" +
                "<td><img src=" +
                image +
                "width=150 height=150></td>" +
                "</tr>";
        }
    }
    document.getElementById("tblFavorite").innerHTML = table;
}


