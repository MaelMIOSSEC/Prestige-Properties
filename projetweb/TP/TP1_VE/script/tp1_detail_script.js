
let xmlhttp = new XMLHttpRequest();

function loadXMLDocAndDisplayBook(){       
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            displayBookById();
        }
    };

    xmlhttp.open("GET", "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml", true);
    xmlhttp.send();    
}

function displayBookById() {    

    //let bookid;
    //Récupérer bookId  dans la chaîne de requête
    let urlParams = new
    URLSearchParams(window.location.search);
    let bookid = urlParams.get('id');

    let i;        
    let xmlDoc = xmlhttp.responseXML;    
    let x = xmlDoc.getElementsByTagName("book");    
    
    for (i = 0; i < x.length; i++) {        
        if (x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue == bookid){
            //Afficher les information du livre en utilisant les textboxes : txtTitle, txtAuthor, txtYear
            document.getElementById("txtTitle").value = x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
            document.getElementById("txtAuthor").value = x[i].getElementsByTagName("author")[0].childNodes[0].nodeValue;
            document.getElementById("txtYear").value = x[i].getElementsByTagName("published_year")[0].childNodes[0].nodeValue;
        }
    }
} 