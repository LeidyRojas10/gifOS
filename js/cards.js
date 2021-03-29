
//Esta función renderiza el overlay en los trending Gifos
function generateGifWithOverlay(gif, isTrendGifos = false,isFavorites = false) {
    
    //Se crea el div contenedor del gifo y el overlay
    const gif_div = document.createElement('div');
    //Al div contenedor se le agrega la clase gif del css
    gif_div.className = isTrendGifos ? 'trend_gif' : 'gif';
    
    //Se crea una imagen donde se visualizará el gif
    const image = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    image.setAttribute('src',isFavorites? gif?.url : gif?.images?.fixed_height?.url);
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
    favoriteButton.dataset.favorite = isFavorites;
    favoriteButton.dataset.title = gif?.title;
    favoriteButton.dataset.author = gif?.username;
    favoriteButton.dataset.link =  isFavorites? gif?.url : gif?.images?.original?.url;

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
   downloadButton.dataset.link =  isFavorites? gif?.url:gif?.images?.original?.url;

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

//------>

//Función para descargar tus Gifos
const downloadGif = async (element) => {
    console.log('downloadGif');
    let gifFromGiphy = await fetch(element.dataset.link);
    let blobObject = await gifFromGiphy.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a");
    saveGif.href = imgURL;
    saveGif.download = `myGif.gif`;
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
};


//Función para marcar como favorito un Gifo
const markAsFavorite = (element) => {
    console.log('markAsFavorite');
    let gif = new Gif(element.dataset.id, element.dataset.title, element.dataset.autor, element.dataset.link);
    //Ingresar al Localstorage para obtener el objeto Gifos
    let gifos = getGifos();
    //Busca sí en la lista de mis favoritos está el Gifo con el id x
    let found = gifos.favorites.findIndex((g) => g.id === element.dataset.id);
    if (found >= 0) {
        gifos.favorites.splice(found, 1);
        element.dataset.favorite = false;
    }
    else {
        gifos.favorites.push(gif);
        element.dataset.favorite = true;
    }
    //Guardo nuevamente el objeto Gifos en el LocalStorage
    saveGifos(gifos);

};