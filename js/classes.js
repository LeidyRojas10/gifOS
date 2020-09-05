//Esta es la API Key de Giphy developers que me habilita el uso de las apis de Giphy
const KEY = "api_key=yGMJAYeVTaWUz1e4xHnA4K1Yu7oxznmO";

//La constante headers tiene como finalidad definir los formatos de respuesta y envío de datos a través de la Api de Giphy
//que para nuestro caso solo se acepta archivos JSON y envíos del mismo tipo
const HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class Gif {
    constructor(title, user, favorite, url){
        this.title = title;
        this.user = user;
        this.favorite = favorite;
        this.url = url;
    }
}

class Buscador{
    constructor(searchWord, limit, offset, autocompleteWords){
        this.searchWord = searchWord;
        this.limit = limit;
        this.offset = offset;
        this.autocompleteWords = autocompleteWords;
    }
}

class Gifos{
    constructor(search, favorites, myOwnGifos, mode){
        this.search = search;
        this.favorites = favorites;
        this.myOwnGifos = myOwnGifos;
        this.mode = mode;
        this.trendingOffset = 0;
    }
}

// Esta es la llave para aceeder a la información generada por el sitio web GIFOS
const GIFOS_KEY = "GIFOS_APP";

//Esta función se encarga de guardar y actualizar la información del sitio web GIFOS
function saveGifos (gifos){
    localStorage.setItem(GIFOS_KEY, JSON.stringify(gifos));
}

//Esta función se encarga de regresar los valores actuales de GIFOS guardados en el LocalStorage
function getGifos (){
    let gifosString= localStorage.getItem(GIFOS_KEY);
    let gifos= JSON.parse(gifosString);
    return gifos;
}

saveGifos(new Gifos( new Buscador("", 12, 0, []) , [], [], "diurno"));