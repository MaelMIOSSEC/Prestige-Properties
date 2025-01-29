let xmlhttp = new XMLHttpRequest();

let nbPage = 0;
let pageSize = 10;
let startIndex = 0;
let endIndex = 0;
let page = 1;

function loadXMLDoc() {
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {   
            showPageLinks();         
            fetchData();
        }
    };
    xmlhttp.open("GET", "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml", true);
    xmlhttp.send();
}

function fetchData() {
    let i;
    let xmlDoc = xmlhttp.responseXML;    
    let table = "<tr><th>ID</th><th>Book</th><th>Authors</th><th></th></tr>";    
    let x = xmlDoc.getElementsByTagName("book");
        
    //Calculer nbPage 
    nbPage = (x.length/pageSize);  

    //Calculer startIndex et endIndex 
    startIndex = (page-1)*pageSize;
    endIndex = startIndex+pageSize;   

    //Mettre à jour la boucle en tenant compte startIndex et endIndex
    for (i = startIndex; i < endIndex; i++){        
        table += "<tr>" 
        + "<td>" 
        + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue 
        + "</td>" 
        + "<td>" 
        + x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue 
        + "</td>" 
        + "<td>" 
        + x[i].getElementsByTagName("author")[0].childNodes[0].nodeValue 
        + "</td>" 
        + "<td>"
        + "<a href='tp1_detail.html?id="
        + x[i].getElementsByTagName("id")[0].childNodes[0].nodeValue
        + "'>Details</a>"            
        + "</td>"
        + "</tr>";
    }

    document.getElementById("data").innerHTML = table;
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
    let x = xmlDoc.getElementsByTagName("book");
    let totalItems = x.length;
    let totalPages = (totalItems/pageSize);
    
    let paginationButtons = " ";
    for(let i = 1; i <= totalPages; i++){
        paginationButtons += "<input type='button' onclick ='loadPage("+i+")' value='"+i+"'></input>";
        //alert(paginationButtons)
    }
    divpl.innerHTML = paginationButtons;
}