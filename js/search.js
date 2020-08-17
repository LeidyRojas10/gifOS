//Este archivo tiene como finalidad manejar las peticiones de búsqueda de GIF y tendencias

//Esta es la API Key de Giphy developers que me habilita el uso de las apis de Giphy
const KEY = "api_key=yGMJAYeVTaWUz1e4xHnA4K1Yu7oxznmO";

//La constante headers tiene como finalidad definir los formatos de respuesta y envío de datos a través de la Api de Giphy
//que para nuestro caso solo se acepta archivos JSON y envíos del mismo tipo
const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

//Es una constante para definir el número por defecto de Gifs esperados en una consulta
const LIMIT = 12;

//Es la dirección web o Host de las Apis de Giphy
const HOST = "https://api.giphy.com"

//Esta es la ruta o endpoint para obtener los trendings
const TRENDINGS_PATH = "/v1/gifs/trending"

//--------------------- Barra de búsqueda
//Lee el texto actual en la barra de búsqueda y si es vacio no hace nada, de lo contrario carga los gifs
function searchGif() {
    let word = document.getElementById('search').value;
    if (word != undefined || word != "") {
        let gifos = getGifos();
        gifos.search.searchWord = word;
        saveGifos(gifos);
        loadGifs(word, 0);
    }
}


function createUrlForSearching(word, offset) {
    return "https://api.giphy.com/v1/gifs/search?" + KEY + "&q=" + word + "&limit=12" + "&offset=" + offset + "&rating=g&lang=en";
}

// Se hace la consulta a Giphy de los gif con base en la palabra buscada
function loadGifs(word, offset) { // offset de dónde arranca 
    if (word != undefined || word != "") {
        let url = createUrlForSearching(word, offset);
        
        let gifos = getGifos();
        gifos.search.offset = offset;
        saveGifos(gifos);

        let request = { method: 'GET', headers: HEADERS };
        fetch(url, request)
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                else {
                    throw "Error in the request.";
                }
            })
            .then(function (content) {
                showGifs(content)
            })
            .catch(function (error) {
                console.error("Error en la petición" + error.message)
            })
    }
}
//Carga en el html los gif buscados según la palabra
function showGifs(jsonData) {
    let gifContainer = document.getElementById("gif-result");
    let gifos = getGifos();
    let gifContent = "";
    if (gifos.search.offset == 0) {
        gifContainer.innerHTML = '';
    }
    let data = jsonData.data;
    // Se va a iterar utilizando una variable llamada posición que arranca en 0 y que incrementará por cada iteración en 1, 
    // hasta que la posición deje de ser menor al total de elementos en el arreglo llamado Data.
    for (var position = 0; position < data.length; position++) {
        var gifUrl = data[position].images.fixed_height.url;
        gifContent += '<div class="gif"><img src="' + gifUrl + '"></img></div>';
    }
    gifContainer.innerHTML += gifContent;

    document.getElementById("results_title").innerHTML=gifos.search.searchWord;
    if(window.innerWidth >= 768){
        document.getElementById("gif-result").style="padding-top:59px";
        document.getElementById("results_title").style="padding-top:95px";
    }
    else{
        document.getElementById("gif-result").style="padding-top:38px";
        document.getElementById("results_title").style="padding-top:79px";
    }
 
    document.getElementById("more_results").style.display="block";

}

//Botón Ver más 

function moreResults (){
    let gifos = getGifos();
    gifos.search.offset =  gifos.search.offset + 12;
    saveGifos(gifos);
    loadGifs(gifos.search.searchWord,gifos.search.offset);
}
