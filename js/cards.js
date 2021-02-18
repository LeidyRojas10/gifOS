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