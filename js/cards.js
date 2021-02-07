//Función para descargar tus Gifos
const downloadGif = (element) => {
    console.log('downloadGif');
    window.open(element.dataset.link, '_blank');
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