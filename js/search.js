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

function getTrendings() {
    let url = HOST + TRENDINGS_PATH + "?" + KEY + "&limit=3&rating=g"; // esta es la dirección para obtener de a 3 trendings
    // Request es un objeto que describe que tipo de operación requiero y qué condiciones debe cumplir para que sea exitoso
    // Para efectos de esta función debo solicitar información por los cual es un GET y espero un JSON como respuesta
    let request = {
        method:'GET',
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
            console.log(json.data)
            let trend=document.getElementById("trends_gif");
            trend.innerHTML='';
            for(var position=0; position<3; position++){
                let gif=json.data[position].images.fixed_height.url;
                trend.innerHTML=trend.innerHTML + "<img src='"+ gif + "' class='trend_gif'></img>";
            }
        })
        .catch(function (error) { // En caso que alguno de los pasos falle capturo el error para analizar qué ocurrio
            console.error("Error en la petición" + error.message)
        })
}

getTrendings();