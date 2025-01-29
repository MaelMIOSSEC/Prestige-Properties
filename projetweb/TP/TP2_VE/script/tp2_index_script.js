let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

function loadXMLDoc() {
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      initSetFavoriteBooks();
      fetchFavoriteBooks()
      fetchData();
    }
  };
  xmlhttp.open(
    "GET",
    "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml",
    true
  );
  xmlhttp.send();
}

function fetchData() {
  let i;
  let xmlDoc = xmlhttp.responseXML;
  let table = "<tr><th>ID</th><th>Book</th><th>Authors</th><th></th></tr>";
  let x = xmlDoc.getElementsByTagName("book");

  for (i = 0; i < x.length; i++) {
    table +=
      "<tr>" +
      "<td>" +
      x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
      "</td>" +
      "<td>" +
      x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
      "</td>" +
      "<td>" +
      x[i].getElementsByTagName("author")[0].childNodes[0].nodeValue +
      "</td>" +
      "<td>";
    if (sFav.has(x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue)) {
      table +=
        "<input type='checkbox' checked onclick='setFavorite(event)' value='" +
        x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
        "'>" +
        "</td>" +
        "</tr>";
    } else {
      table +=
        "<input type='checkbox' onclick='setFavorite(event)' value='" +
        x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue +
        "'>" +
        "</td>" +
        "</tr>";
    }
  }

  document.getElementById("data").innerHTML = table;
}

//Etape 1
function setFavorite(ev) {
  if (ev.currentTarget.checked) {
    sFav.add(ev.currentTarget.value);
    console.log(sFav);
    console.log("Checked - id :" + ev.currentTarget.value);
  } else {
    sFav.delete(ev.currentTarget.value);
    console.log(sFav);
    console.log("Unchecked - id :" + ev.currentTarget.value);
  }
  fetchFavoriteBooks();
  let fchaine = Array.from(sFav).join(",");
  localStorage.setItem("favorites", fchaine);
}

//Etape 2
function fetchFavoriteBooks() {
  let xmlDoc = xmlhttp.responseXML;
  let table = "<tr><th>ID</th><th>Book</th><th>Authors</th></tr>";
  let x = xmlDoc.getElementsByTagName("book");

  for (let i = 0; i < x.length; i++) {
    console.log("ok")
    const BookId = x[i].getElementsByTagName("id")[0].textContent;
    const BookTitle = x[i].getElementsByTagName("title")[0].textContent;
    const BookAuthor = x[i].getElementsByTagName("author")[0].textContent;

    if (sFav.has(BookId)) {
      table += "<tr>" +
        "<td>" +
        BookId +
        "</td>" +
        "<td>" +
        BookTitle +
        "</td>" +
        "<td>" +
        BookAuthor +
        "</td>" +
        "</tr>";

    }
  }
  document.getElementById("tblFavorite").innerHTML = table;
}

//Etape 3
function initSetFavoriteBooks() {
  if (localStorage.getItem("favorites") != null) {
    let favs = localStorage.getItem("favorites");
    let myArr = favs.split(",");
    for (let i = 0; i < myArr.length; i++) {
      console.log(myArr[i]);
      sFav.add(myArr[i]);

    }
  }
}
