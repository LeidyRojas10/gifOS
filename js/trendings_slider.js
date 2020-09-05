//Este archivo tiene como finalidad mostrar los gif que son tendencias (slider) en Giphy
const trendingsGifs = 'https://api.giphy.com/v1/gifs/trending';
const limitMobile = 12;
const limitDesktop = 3;
const offset = 0;
const rating = 'rating=g';

function getTrendings(limit) {
    let gifosData = getGifos();
    let url = trendingsGifs + "?" + KEY + "&limit=" + limit + "&rating=g&offset=" + gifosData.trendingOffset; // esta es la dirección para obtener de a 3 trendings
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
            loadTrends(json, limit);
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

//Acción de los botones del slider Trending GIFOS 

//Función para actualizar el offset para la carga de los trending a la izquierda
function moreTrendingsLeft() {
    let gifosData = getGifos();
    if (gifosData.trendingOffset >= 3) {
        gifosData.trendingOffset = gifosData.trendingOffset - 3;
        saveGifos(gifosData);
        getTrendings(limitDesktop);
    }
    console.log("presione_izq. offset actual:" + gifosData.trendingOffset);
}

//Listener para el botón "slider button left"
document.getElementById("slider_button_left").addEventListener("click", function () {
    moreTrendingsLeft();
});


//Función para actualizar el offset para la carga de los trending a la derecha
function moreTrendingsRight() {
    let gifosData = getGifos();
    gifosData.trendingOffset = gifosData.trendingOffset + 3;
    saveGifos(gifosData);
    console.log("presione_derecha. offset actual:" + gifosData.trendingOffset);
    getTrendings(limitDesktop);
}

//Listener para el botón "slider button right"
document.getElementById("slider_button_right").addEventListener("click", function () {
    moreTrendingsRight();
});



//Event para que los trending Gifos se recarguen de acuerdo a la resolución de la pantalla en el Slider
function displayTrendingGifs() {
    const currentWidth = document.documentElement.clientWidth;
    let previousWidth = sessionStorage.getItem("Gifos_Width");
    if (previousWidth) {
        if (currentWidth >= 768 && parseInt(previousWidth) < 768) {
            getTrendings(limitDesktop);
        }
        if (currentWidth <= 768 && parseInt(previousWidth) > 768) {
            getTrendings(limitMobile);
        }
    }
    else {
        if (currentWidth >= 768) {
            getTrendings(limitDesktop);
        }
        else {
            getTrendings(limitMobile);
        }
    }
    sessionStorage.setItem("Gifos_Width", currentWidth.toString());
}

// Anexar al evento el listener de la función del cambio de resolución
window.addEventListener("resize", displayTrendingGifs);

//Limpiar sessionStorage
sessionStorage.clear();

//Muestran los trendings
displayTrendingGifs();