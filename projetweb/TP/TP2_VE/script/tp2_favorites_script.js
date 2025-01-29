let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

function loadXMLDoc() {    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {   
            fetchFavoriteBooks();         
        }
    };
    xmlhttp.open("GET", "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml", true);
    xmlhttp.send();
}

function fetchFavoriteBooks(){    
    if (localStorage.getItem("favorites") != null){
        let favs = localStorage.getItem("favorites");
        let myArr = favs.split(",");
        for (let i = 0; i < myArr.length; i++) {
            console.log(myArr[i]);
            sFav.add(myArr[i]);
        }  
    }
    
    let xmlDoc = xmlhttp.responseXML;    
    let table = "<tr><th>ID</th><th>Book</th><th>Authors</th></tr>";    
    let x = xmlDoc.getElementsByTagName("book");

    for (let i = 0; i < x.length; i++ ){
        const BookId = x[i].getElementsByTagName("id")[0].textContent;
        const BookTitle = x[i].getElementsByTagName("title")[0].textContent;
        const BookAuthor = x[i].getElementsByTagName("author")[0].textContent;

        if (sFav.has(BookId)){
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


