
//Esta función renderiza el overlay en los trending Gifos
function generateGifWithOverlay(gif, isTrendGifos = false, isFavorites = false, isMyGifos = false) {

    //Se crea el div contenedor del gifo y el overlay
    const gif_div = document.createElement('div');
    //Al div contenedor se le agrega la clase gif del css
    gif_div.className = isTrendGifos ? 'trend_gif' : 'gif';
    gif_div.id = 'gif-container-' + gif?.id;


    //Se crea una imagen donde se visualizará el gif
    const image = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    image.setAttribute('src', (isFavorites || isMyGifos) ? gif?.url : gif?.images?.fixed_height?.url);
    image.id = 'gif-' + gif?.id;
    image.dataset.id = gif?.id;
    image.dataset.favorite = isAFavoriteGif(gif?.id);
    image.dataset.title = gif?.title;
    image.dataset.username = gif?.username;
    image.dataset.link = (isFavorites || isMyGifos) ? gif?.url : gif?.images?.original?.url;

    image.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(image);
    });

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

    if (!isMyGifos) {
        // Se crea el botón favorito de las tarjetas del gif
        const favoriteButton = document.createElement('button');
        //Al botón favoritos se le agrega la clase gif_favorite_button del css
        favoriteButton.className = 'gif_favorite_button';
        favoriteButton.id = gif?.id?.toString().concat('-fab');
        // Se agregan los data attributes
        favoriteButton.dataset.id = gif?.id;
        favoriteButton.dataset.favorite = isAFavoriteGif(gif?.id);
        favoriteButton.dataset.title = gif?.title;
        favoriteButton.dataset.username = gif?.username;
        favoriteButton.dataset.link = isFavorites ? gif?.url : gif?.images?.original?.url;

        //Agregar la opción del click favorito
        favoriteButton.addEventListener('click', (event) => {
            event.preventDefault();
            markAsFavorite(favoriteButton);
        })

        //Se crea una imagen donde se visualizará el icono favorito dentro del gif
        const favIconOff = document.createElement('img');
        //Se agrega la dirección url del gif a la imagen
        favIconOff.setAttribute('src', "./assets/icon-fav-hover.svg");
        // Se le agrega a la imagen el estilo favorite icon gifo
        favIconOff.className = 'favorite_icon';
        //Se agrega la imagen al gif contenedor
        favoriteButton.appendChild(favIconOff);

        //Se crea una imagen donde se visualizará el icono activo favorito dentro del gif
        const favIconOn = document.createElement('img');
        //Se agrega la dirección url del gif a la imagen
        favIconOn.setAttribute('src', "./assets/icon-fav-active.svg");
        // Se le agrega a la imagen el estilo favorite_icon_active
        favIconOn.className = 'favorite_icon_active';
        //Se agrega la imagen al gif contenedor
        favoriteButton.appendChild(favIconOn);

        buttonsDiv.appendChild(favoriteButton);
    }
    else {
        // Se crea el botón eliminar de las tarjetas del gif
        const deleteButton = document.createElement('button');
        //Al botón se le agrega la clase gif_download_button del css
        deleteButton.id = gif?.id?.toString().concat('-download');
        //Agregar la opción del click descargar Gifo
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            deleteMyGifo(gif?.id);
        })

        //Se crea una imagen donde se visualizará el icono de Basura dentro del gif
        const deleteIcon = document.createElement('img');
        //Se agrega la dirección url del gif a la imagen
        deleteIcon.setAttribute('src', "./assets/icon_trash.svg");
        //Se agrega la imagen al gif contenedor
        deleteButton.appendChild(deleteIcon);

        buttonsDiv.appendChild(deleteButton);

    }

    // Se crea el botón descarga de las tarjetas del gif
    const downloadButton = document.createElement('button');
    //Al botón se le agrega la clase gif_download_button del css
    downloadButton.className = 'gif_download_button';
    downloadButton.id = gif?.id?.toString().concat('-download');
    // Se agregan los data attributes
    downloadButton.dataset.link = (isFavorites || isMyGifos) ? gif?.url : gif?.images?.original?.url;

    //Agregar la opción del click descargar Gifo
    downloadButton.addEventListener('click', (event) => {
        event.preventDefault();
        downloadGif(downloadButton);
    })

    //Se crea una imagen donde se visualizará el icono de descarga dentro del gif
    const downloadIcon = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    downloadIcon.setAttribute('src', "./assets/icon-download.svg");
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

    // Se agregan los data attributes
    showButton.dataset.id = gif?.id;
    showButton.dataset.favorite = isAFavoriteGif(gif?.id);
    showButton.dataset.title = gif?.title;
    showButton.dataset.username = gif?.username;
    console.log(gif, gif.username);
    showButton.dataset.link = (isFavorites || isMyGifos) ? gif?.url : gif?.images?.original?.url;

    //Agregar la opción del click descargar Gifo
    showButton.addEventListener('click', (event) => {
        event.preventDefault();
        openModal(showButton, isMyGifos);
    })

    //Se crea una imagen donde se visualizará el icono de ampliar dentro del gifs
    const showIcon = document.createElement('img');
    //Se agrega la dirección url del gif a la imagen
    showIcon.setAttribute('src', "./assets/icon-max.svg");
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

//Función para eliminar de la vista de Mis Gifos un gif mediante un id
const deleteMyGifo = (id) => {
    let gifos = getGifos();
    let found = gifos.myOwnGifos.findIndex((g) => g.id === id);
    gifos.myOwnGifos.splice(found, 1);
    //Guardo nuevamente el objeto Gifos en el LocalStorage
    saveGifos(gifos);


    const gifContainer = document.getElementById('gif-content-my-gifos');
    if (gifContainer?.hasChildNodes()) {
        let result = null;
        for (let position = 0; position < gifContainer.childNodes.length && !result; position++) {
            if (gifContainer.childNodes[position]?.id === ('gif-container-' + id)) {
                result = gifContainer.childNodes[position];
            }
        }
        if (result) {
            gifContainer.removeChild(result);
        }
        if (gifos.myOwnGifos.length == 0) {
            document.getElementById('no_content').style.display = 'flex';
            document.getElementById('more_content').style.display = 'none';
            document.getElementById('my_gifos_title').style.marginBottom = '0px';
        }
    }
}

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

//Función para determinar sí el id de un Gif se encuentra en la lista de favoritos
const isAFavoriteGif = (id) => {
    let gifos = getGifos();
    let found = gifos.favorites.findIndex((g) => g.id === id);
    return found >= 0;
}


//Función para marcar como favorito un Gifo
const markAsFavorite = (element) => {
    console.log(element.dataset.username);
    let gif = new Gif(element.dataset.id, element.dataset.title, element.dataset.username, element.dataset.link);
    //Ingresar al Localstorage para obtener el objeto Gifos
    let gifos = getGifos();
    //Obtener botón show
    const buttonShow = document.getElementById(element.dataset.id + '-show');
    const buttonFav = document.getElementById(element.dataset.id + '-fab');
    //Busca sí en la lista de mis favoritos está el Gifo con el id x
    if (isAFavoriteGif(element.dataset.id)) {
        let found = gifos.favorites.findIndex((g) => g.id === element.dataset.id);
        gifos.favorites.splice(found, 1);
        element.dataset.favorite = false;
        buttonShow.dataset.favorite = false;
        buttonFav.dataset.favorite = false;
        deleteFavorite(element.dataset.id);
        if (gifos.favorites.length == 0) {
            document.getElementById('no_content').style.display = 'flex';
            document.getElementById('more_content').style.display = 'none';
            document.getElementById('favorites_title').style.marginBottom = '0px';
        }
    }
    else {
        gifos.favorites.push(gif);
        element.dataset.favorite = true;
        buttonShow.dataset.favorite = true;
        buttonFav.dataset.favorite = true;
    }
    //Guardo nuevamente el objeto Gifos en el LocalStorage
    saveGifos(gifos);
};

//Función para eliminar de la vista de favoritos un gif mediante un id
const deleteFavorite = (id) => {
    const gifContainer = document.getElementById('gif-content-favorites');
    if (gifContainer?.hasChildNodes()) {
        let result = null;
        for (let position = 0; position < gifContainer.childNodes.length && !result; position++) {
            if (gifContainer.childNodes[position]?.id === ('gif-container-' + id)) {
                result = gifContainer.childNodes[position];
            }
        }
        if (result) {
            gifContainer.removeChild(result);
        }        
    }
}

//Función para abrir la opción modal de cada Gif
const openModal = (element, isMyGifos = false) => {
    const modal = document.getElementById('modal_master');
    modal.style.display = 'flex';

    const modal_user = document.getElementById('modal_user');
    modal_user.innerText = element.dataset.username;

    const modal_title = document.getElementById('modal_title');
    modal_title.innerText = element.dataset.title;

    const modal_gif = document.getElementById('modal_gif');
    modal_gif.src = element.dataset.link;

    if (isMyGifos) {
        deleteModal(element.dataset.id);
    }
    else {
        favoriteModal(element);
    }
    downloadModal(element);
}

//Función para cerrar la vista del modal del Gif seleccionado
const closeModal = () => {
    const modal = document.getElementById('modal_master');
    modal.style.display = 'none';
}

//Función para configurar el modal antes de usarse(inicializar)
const initModal = () => {
    const closeButton = document.getElementById('close_modal');
    closeButton.addEventListener('click', closeModal);
}

//Función para guardar Gifo en la vista del modal seleccionada
const favoriteModal = (element) => {
    const modalsFavoriteButton = document.getElementById('modals_favorite_button');
    modalsFavoriteButton.dataset.favorite = element.dataset.favorite;
    modalsFavoriteButton.addEventListener('click', (event) => {
        event.preventDefault();
        markAsFavorite(element);
        modalsFavoriteButton.dataset.favorite = element.dataset.favorite;
        closeModal();
    });
}

//Función para descargar Gifo en la vista del modal seleccionada
const downloadModal = (element) => {
    const downModal = document.getElementById('down_modal');
    downModal.addEventListener('click', (event) => {
        event.preventDefault();
        downloadGif(element);
    });
}

//Función para borrar un Gifo en la vista del modal seleccionado
const deleteModal = (id) => {
    const deleteModal = document.getElementById('delete_modal');
    deleteModal.addEventListener('click', (event) => {
        event.preventDefault();
        deleteMyGifo(id);
        closeModal();
    });
}


initModal();

