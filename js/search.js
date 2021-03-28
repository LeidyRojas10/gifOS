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
document.getElementById("searchbox_search_button").addEventListener("click", function () {
    searchGif();
});

//Función para obtener las sugerencias del autocompletado
function getSuggestions() {
    let word = document.getElementById('search').value;
    let autocompleteUrl = "https://api.giphy.com/v1/gifs/search/tags?api_key=yGMJAYeVTaWUz1e4xHnA4K1Yu7oxznmO&q=" + word;
    // Para efectos de esta función debo solicitar información por los cual es un GET y espero un JSON como respuesta
    let request = {
        method: 'GET',
        headers: HEADERS
    }
    //Ahora procedo a hacer la consulta a la Api de Giphy usando la url que cree y la petición
    fetch(autocompleteUrl, request)
        .then(result => { //Paso 1: si la petición fue correcta procedo a verificar que haya sido un http-200, de lo contrario error
            if (result.status == 200) {
                return result.json();
            }
            else {
                throw "algo salio mal";
            }
        })
        .then(response => { //Paso 2: dado que fue un http-200 obtengo el json de Giphy con las sugerencias para autocompletar la 
            //búsqueda
            showSuggestions(response.data);
        })
        .catch(function (error) { // En caso que alguno de los pasos falle capturo el error para analizar qué ocurrio
            //console.error("Error en la petición" + error.message);
        })
}

//Función para mostrar las sugerencias del autocompletado en la barra de búsqueda
function showSuggestions(suggestions) {
    document.getElementById("search_options").innerHTML = "";
    let ul = document.getElementById("search_options");

    //Para una posición que arranca en 0, mientras que esa posición sea menor a 5 la voy a incrementar en 1 cada vez q se repita
    for (let position = 0; position < 5; position++) {
        let li = document.createElement("li");
        //Variable botón para el autocompletado
        let button = document.createElement("button");
        button.innerHTML = '<img src="/assets/icon-search.svg"> ' + suggestions[position].name;
        //button.addEventListener('click',completeSearch(suggestions[position].name));
        li.appendChild(button);
        ul.appendChild(li);
    }
}

//Función para completar la búsqueda con base a una sugerencia y realice la acción de búsqueda
function completeSearch(word) {
    console.log(word);
    document.getElementById('search').value = word;
    searchGif();
}

document.getElementById("search").addEventListener('keyup', function (event) {
    if (event.keyCode == '13') {
        searchGif();
    }
    else {
        getSuggestions();
    }

    console.log(event.code);
});

//Listener para Focus y Blur para el autocompletar la búsqueda
const searchInput = document.getElementById("search");

document.getElementById("search").addEventListener('focus', (event) => {
    if (window.innerWidth >= 768) {
        document.getElementById("search_line").style.display = "block";
        document.getElementById("search_options").style.display = "block";
        document.getElementById("search_box").style.position = "absolute";
    }
});

document.getElementById("search").addEventListener('blur', (event) => {
    if (window.innerWidth >= 768) {
        document.getElementById("search_line").style.display = "none";
        document.getElementById("search_options").style.display = "none";
        document.getElementById("search_box").style.position = "relative";
    }
});


//Limpiar o cancelar búsqueda
function clearSearch() {
    document.getElementById("results_title").innerHTML = "";
    document.getElementById("results_title").style = "padding-top:0px";
    document.getElementById("results_bar").style.display = "none";
    document.getElementById("no_results").style.display = "none";
    document.getElementById("more_results").style.display = "none";
    document.getElementById("gif-result").style = "padding-top:0px";
    document.getElementById("gif-result").innerHTML = "";
    document.getElementById("search").value = "";
    document.getElementById("main_title").style.display = "block";
    document.getElementById("main_image").style.display = "block";
    if (window.innerWidth >= 768) {
        //configuración para desktop
        document.getElementById("trendings_paragraph").style.marginBottom = "95px";
    }
    else {
        //configuración para mobile
        document.getElementById("trendings_paragraph").style.marginBottom = "45px";
    }

    console.log("Se borró la búsqueda");
}

//Listener para el botón limpiar o cancelar búsqueda
document.getElementById("searchbox_cancel_button").addEventListener("click", clearSearch);


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
            gifContainer.appendChild(generateGifWithOverlay(data[position],false));
        }
        document.getElementById("more_results").style.display = "block";

        if (window.innerWidth >= 768) {
            //configuración para desktop
            document.getElementById("gif-result").style = "padding-top:59px";
        }
        else {
            //configuración para mobile
            document.getElementById("gif-result").style = "padding-top:38px";
            document.getElementById("main_title").style.display = "none";
            document.getElementById("main_image").style.display = "none";
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
document.getElementById("more_results").addEventListener("click", function () {
    moreResults();
});

// Anexar al evento el listener de la función del cambio de resolución de mobile a desktop aparezca la ilustración sobre la
//barra de búsqueda
window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
        document.getElementById("main_image").style.display = "block";
    }
});