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
        console.log(json.data[position]);
        let gif = json.data[position].images.fixed_height.url;
        let gif_div = generateGifWithOverlay(json.data[position],true);
        trend.appendChild(gif_div);
        // trend.innerHTML = trend.innerHTML + '<div class="gif">';
        // trend.innerHTML = trend.innerHTML + "<img src='" + gif + "' class='trend_gif'></img>";
        // trend.innerHTML = trend.innerHTML + generateOverlay(json.data[position]);
        // trend.innerHTML = trend.innerHTML + '</div>';
    }
}

//Esta función renderiza el overlay en los trending Gifos
function generateGifWithOverlay(gif, isTrendGifos) {
    
    //Se crea el div contenedor del gifo y el overlay
    const gif_div = document.createElement('div');
    //Al div contenedor se le agrega la clase gif del css
    gif_div.className = isTrendGifos ? 'trend_gif' : 'gif';
    
    //Se crea una imagen donde se visualizará el gif
    const image = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    image.setAttribute('src', gif?.images?.fixed_height?.url);
    //Se agrega la imagen al gif contenedor
    gif_div.appendChild(image);
    
    // Se crea el div contenedor para el overlay del gif
    const overlayDiv = document.createElement('div');
    //Al div contenedor se le agrega la clase overlay del css
    overlayDiv.className = 'overlay';

     // Se crea el div contenedor para los botones de las tarjetas del gif
     const buttonsDiv = document.createElement('div');
     //Al div contenedor se le agrega la clase gif_cards_buttons del css
     buttonsDiv.className = 'gif_cards_buttons';


     // Se crea el botón favorito de las tarjetas del gif
     const favoriteButton = document.createElement('button');
     //Al botón favoritos se le agrega la clase gif_favorite_button del css
    favoriteButton.className = 'gif_favorite_button';
    favoriteButton.id = gif?.id?.toString().concat('-fab');
    // Se agregan los data attributes
    favoriteButton.dataset.id = gif?.id;
    favoriteButton.dataset.favorite = false;
    favoriteButton.dataset.title = gif?.title;
    favoriteButton.dataset.author = gif?.username;
    favoriteButton.dataset.link =  gif?.images?.original?.url;

    //Agregar la opción del click favorito
    favoriteButton.addEventListener('click',(event) => {
        event.preventDefault();
        markAsFavorite(favoriteButton);
    })

    //Se crea una imagen donde se visualizará el icono favorito dentro del gif
    const favIconOff = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    favIconOff.setAttribute('src',"./assets/icon-fav-hover.svg");
    // Se le agrega a la imagen el estilo favorite icon gifo
   favIconOff.className = 'favorite_icon';
    //Se agrega la imagen al gif contenedor
    favoriteButton.appendChild(favIconOff);
    
    //Se crea una imagen donde se visualizará el icono activo favorito dentro del gif
    const favIconOn = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    favIconOn.setAttribute('src',"./assets/icon-fav-active.svg");
    // Se le agrega a la imagen el estilo favorite_icon_active
   favIconOn.className = 'favorite_icon_active';
    //Se agrega la imagen al gif contenedor
    favoriteButton.appendChild(favIconOn);

    buttonsDiv.appendChild(favoriteButton);

    // Se crea el botón descarga de las tarjetas del gif
    const downloadButton = document.createElement('button');
    //Al botón se le agrega la clase gif_download_button del css
   downloadButton.className = 'gif_download_button';
   downloadButton.id = gif?.id?.toString().concat('-download');
   // Se agregan los data attributes
   downloadButton.dataset.link =  gif?.images?.original?.url;

   //Agregar la opción del click descargar Gifo
   downloadButton.addEventListener('click',(event) => {
       event.preventDefault();
       downloadGif(downloadButton);
   })

   //Se crea una imagen donde se visualizará el icono de descarga dentro del gif
   const downloadIcon = document.createElement('img');
   //Se agrega la dirección url del gif a la imagen
   downloadIcon.setAttribute('src',"./assets/icon-download.svg");
   // Se le agrega a la imagen el estilo download_icon
   downloadIcon.className = 'download_icon';
   //Se agrega la imagen al gif contenedor
   downloadButton.appendChild(downloadIcon);

   buttonsDiv.appendChild(downloadButton);

   // Se crea el botón ampliar de las tarjetas del gif
   const showButton = document.createElement('button');
   //Al botón se le agrega la clase gif_max_button del css
  showButton.className = 'gif_max_button';
  showButton.id = gif?.id?.toString().concat('-show');

  //Se crea una imagen donde se visualizará el icono de ampliar dentro del gif
  const showIcon = document.createElement('img');
  //Se agrega la dirección url del gif a la imagen
  showIcon.setAttribute('src',"./assets/icon-max.svg");
  // Se le agrega a la imagen el estilo download_icon
  showIcon.className = 'max_icon';
  //Se agrega la imagen al gif contenedor
  showButton.appendChild(showIcon);

  buttonsDiv.appendChild(showButton);
  
  //Inlcuir los botones al Overlay
  overlayDiv.appendChild(buttonsDiv);

   // Se crea el div contenedor para la información del gif
   const infoDiv = document.createElement('div');
   //Al div contenedor se le agrega la clase gif_cards_info del css
   infoDiv.className = 'gif_cards_info';
   infoDiv.innerHTML = '<p class="gif-user">' + gif?.username + '</p><p class="gif-title">' + gif?.title + '</p>';
    
   //Inlcuir infoDiv al Overlay
  overlayDiv.appendChild(infoDiv);

  //Inlcuir el Overlay al contenedor del Gif
  gif_div.appendChild(overlayDiv);

  return gif_div;
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