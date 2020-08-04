//Este archivo tiene como finalidad mostrar las tendencias (palabras) en Giphy
const trendingsWords = 'https://api.giphy.com/v1/trending/searches';
const apiKey = 'api_key=yGMJAYeVTaWUz1e4xHnA4K1Yu7oxznmO';
const trendingsWords_url = ( trendingsWords + '?' + apiKey);

// Una vez obtenga la url estructurada puedo hacerle la consulta a la API de las trendings words
//Para ello uso el método fetch y así obtener las palabras en tendencia

//Es necesario definir que tipo de operación y de datos espero por parte de Giphy
// de forma que es necesario crear un objeto que cuente con la descripción necesaria para hacer la solicitud
// de las palabras tendencia a este objeto se le conoce como petición o request el cual se compone principalmente de 3 campos
//el primero se llama metodo que me determina que tipo de acción debe hacerse para efectos del ejercicio es un GET
//el segundo son las cabeceras de la petición que tiene como objetivo definir el tipo de contenido esperado y el formato
//el tercero es el cuerpo de la petición o body que para este caso no es requerido.

const request = {
    method: 'GET',
    headers: {
        'Content-type':'application/json',
        'Accept': 'application/json'
    }
}


function loadTrendingsWords(){
    fetch(trendingsWords_url, request)
    .then(response => response.json())
    .then(data => showTrendingsWords(data))
    .catch( error => console.error( 'Something went wrong' ) );
}


//función para pintar en el html las trendings words de Giphy

function showTrendingsWords(data){
    let trendings_paragraph = document.getElementById('trendings_paragraph');
    trendings_paragraph.innerHTML = '';
    trendings_paragraph.innerHTML = data.data[0]+ ", " + data.data[1] + ", " + data.data[2] + ", " + data.data[3] + ", " + data.data[4];
}

loadTrendingsWords();