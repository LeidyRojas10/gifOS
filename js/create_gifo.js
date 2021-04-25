
//Key para el sesionstorage
const gifosCreationStepKey = 'gifosCreationStep';


//Botón para crear Gifo
const startCreationButton = document.getElementById('start_creation');

//Función para solicitar permisos de acceso a la cámara 
const getVideo = () => {
    const videoPromise = navigator.mediaDevices.getUserMedia({ video: true });
    videoPromise.then(function (mediaStream) {
        let video = document.getElementById('gifos_video');
        video.srcObject = mediaStream;
        video.play();

    });
    videoPromise.catch(function (err) { console.log(err.name); }); // always check for errors at the end.
}

//Agregar evento clicl al botón Comenzar creación del Gifo
startCreationButton.addEventListener('click', (event) => {
    event.preventDefault();
    getVideo();
})