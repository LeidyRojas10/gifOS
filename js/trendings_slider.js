//Este archivo tiene como finalidad mostrar los gif que son tendencias (slider) en Giphy
const trendingsGifs = 'https://api.giphy.com/v1/gifs/trending';
const limitMobile = 'limit=12';
const limitDesktop = 'limit=3';
const offset = 0;
const rating = 'rating=g';

const trendings_url = ( trendingsGifs + '?' + apiKey + '&' + rating );



function getTrendings() {
    let url = trendingsGifs+ "?" + KEY + "&limit=12&rating=g"; // esta es la dirección para obtener de a 3 trendings
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
            if (screen.width > 768) {
                loadTrends(json, 3);
            }
            else {
                loadTrends(json, 12);
            }
        })
        .catch(function (error) { // En caso que alguno de los pasos falle capturo el error para analizar qué ocurrio
            //console.error("Error en la petición" + error.message);
        })
}

function loadTrends(json, limit) {
    console.log(json.data)
    let trend = document.getElementById("slider");
    trend.innerHTML = '';
    for (var position = 0; position < limit; position++) {
        let gif = json.data[position].images.fixed_height.url;
        trend.innerHTML = trend.innerHTML + "<img src='" + gif + "' class='trend_gif'></img>";
    }
}

//Muestran los trendings
getTrendings();