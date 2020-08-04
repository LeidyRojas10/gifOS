//Este archivo tiene como finalidad mostrar los gif que son tendencias (slider) en Giphy
const trendingsGifs = 'https://api.giphy.com/v1/gifs/trending';
const limitMobile = 'limit=12';
const limitDesktop = 'limit=3';
const offset = 0;
const rating = 'rating=g';

const trendings_url = ( trendingsGifs + '?' + apiKey + '&' + rating );


//listener para cargar según resolución de la pantalla
window.addEventListener("load", function(event){
    if(window.innerWidth>=768){
        console.log('desktop');
        let desktop = limitDesktop;

    }
    else{
        console.log('mobile');
        let mobile = limitMobile;
    }
} );

function loadSlider (){

}