//Este archivo tiene como finalidad anejar las peticiones de búsqueda de GIF y tendencias

//Esta es la API Key de Giphy developers que me habilita el uso de las apis de Giphy
const KEY = "api_key=";

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

// 
const WORD_LOCAL = "gifos-current";

function getTrendings() {
    let url = HOST + TRENDINGS_PATH + "?" + KEY + "&limit=12&rating=g"; // esta es la dirección para obtener de a 3 trendings
    // Request es un objeto que describe que tipo de operación requiero y qué condiciones debe cumplir para que sea exitoso
    // Para efectos de esta función debo solicitar información por los cual es un GET y espero un JSON como respuesta
    let request = {
        method: 'GET',
        headers: HEADERS
    }
    //Ahora procedo a hacer la consulta a la Api de Giphy usando la url que cree y la petición
    fetch(url, request)
        .then(result => { //Paso 1: si la petición fue correcta procedo a verificar que haya sido un http-200, de lo contrario error
            if (result.status == 200) {
                return result.json();
            }
            else {
                throw "algo salio mal";
            }
        })
        .then(json => { //Paso 2: dado que fue un http-200 obtengo el json de Giphy con los trends
            if(screen.width > 768){
                loadTrends(json,3);
            }
            else{
                loadTrends(json,12);
            }
        })
        .catch(function (error) { // En caso que alguno de los pasos falle capturo el error para analizar qué ocurrio
            //console.error("Error en la petición" + error.message);
        })
}

function loadTrends(json,limit){
    console.log(json.data)
            let trend = document.getElementById("slider");
            trend.innerHTML = '';
            for (var position = 0; position < limit; position++) {
                let gif = json.data[position].images.fixed_height.url;
                trend.innerHTML = trend.innerHTML + "<img src='" + gif + "' class='trend_gif'></img>";
            }
}








//--------------------- Barra de búsqueda
//Lee el texto actual en la barra de búsqueda y si es vació no hace nada, de lo contrario carga los gifs
function searchGif(){
    let word = document.getElementById('search').value;
    if(word != undefined || word != ""){
        setCurrent(word,0)
        loadGifs(word,0);
    }
}

// Se hace la consulta a Giphy de los gif con base en la palabra buscada
function loadGifs(word,offset){ // offset de dónde arranca 
    if(word != undefined || word != ""){
        let url = getRequestURL(word,offset);
        setCurrent(word,offset)
        let request = { method:'GET', headers: HEADERS};
        fetch(url,request)
        .then(response => {
            if(response.status==200){
                return response.json();
            }
            else{
                throw "Error in the request.";
            }
        })
        .then(function(content){
            loadGif(content)
        })
        .catch(function(error){
            console.error("Error en la petición"+error.message)
        })
    }
}
//Carga en el html los gif buscados segú la palabra
function loadGif(jsonData){
    let gifContainer = document.getElementById("gif-container");
    let current = getCurrent();
    let gifContent="";
    if(current.offset==0){
        gifContainer.innerHTML='';
    }
    let data = jsonData.data;
    for(var j =0;j<data.length;j++){
        var gif = data[j].images.fixed_height.url;
        gifContent+='<div class="gif"><img src="'+gif+'"></img></div>';
    }
    gifContainer.innerHTML+=gifContent;
}

function getRequestURL(word,offset,limit){
    return "https://api.giphy.com/v1/gifs/search?"+KEY+"&q="+word+"&limit="+(limit==undefined || limit <=0 ? LIMIT:limit)+"&offset="+offset+"&rating=g&lang=en";
}

function getCurrent(){
    let jsonStr = localStorage.getItem(WORD_LOCAL);
    return JSON.parse(jsonStr);
}

function setCurrent(currentWord,currentOffset){
    let gifos_current = {word: currentWord, offset: currentOffset};
    let jsonValue = JSON.stringify(gifos_current);
    localStorage.setItem(WORD_LOCAL,jsonValue)
}



//Muestran los trendings
getTrendings();