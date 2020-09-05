//Este archivo tiene como finalidad manejar las peticiones de búsqueda de GIF y tendencias

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

//Listener para el botón buscar
document.getElementById("searchbox_search_button").addEventListener("click", function(){
    searchGif();
  });


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

    // Cuando la búsqueda no arroja resultados muestre la imagen  "Intenta con otra búsqueda."
    let data = jsonData.data;
    if (data.length == 0) {
        document.getElementById("no_results").style.display = "flex";
        document.getElementById("more_results").style.display = "none";
        document.getElementById("gif-result").style = "padding-top:0px";
    }
    // Cuando la búsqueda sí arroja resultados
    else {
        // Se va a iterar utilizando una variable llamada posición que arranca en 0 y que incrementará por cada iteración en 1, 
        // hasta que la posición deje de ser menor al total de elementos en el arreglo llamado Data.
        for (var position = 0; position < data.length; position++) {
            var gifUrl = data[position].images.fixed_height.url;
            gifContent += '<div class="gif"><img src="' + gifUrl + '"></img></div>';
        }
        gifContainer.innerHTML += gifContent;
        document.getElementById("more_results").style.display = "block";

        if (window.innerWidth >= 768) {
            //configuración para desktop
            document.getElementById("gif-result").style = "padding-top:59px";
        }
        else {
            //configuración para mobile
            document.getElementById("gif-result").style = "padding-top:38px";
        }
        document.getElementById("no_results").style.display = "none";
    }

    if (window.innerWidth >= 768) {
        //configuración para desktop
        document.getElementById("results_title").style = "padding-top:83.9px";
        document.getElementById("trendings_paragraph").style.marginBottom = "74px";
    }
    else {
        //configuración para mobile
        document.getElementById("results_title").style = "padding-top:43px";
        document.getElementById("trendings_paragraph").style.marginBottom = "35px";
    }
    document.getElementById("results_title").innerHTML = gifos.search.searchWord;

    //configuración de visibilidad al cargar búsquedas
    document.getElementById("results_bar").style.display = "block";

}

//Botón Ver más 

function moreResults() {
    let gifos = getGifos();
    gifos.search.offset = gifos.search.offset + 12;
    saveGifos(gifos);
    loadGifs(gifos.search.searchWord, gifos.search.offset);
}

//Listener para el botón "ver más"
document.getElementById("more_results").addEventListener("click", function(){
    moreResults();
  });