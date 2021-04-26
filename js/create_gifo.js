
//Key para el sesionstorage
const gifosCreationStepKey = 'gifosCreationStep';
const video = document.getElementById('gifos_video');

//Botón para comenzar 'crear Gifo'
const startCreationButton = document.getElementById('start_creation');

//Botón para iniciar la grabación para 'crear Gifo'
const recordButton = document.getElementById('record');

//Botón para finalizar la grabación para 'crear Gifo'
const stopRecordingButton = document.getElementById('stop_recording');

//Botón para subir a Gifos el Gif que hemos creado
const uploadButton = document.getElementById('upload');

//Función para solicitar permisos de acceso a la cámara 
const getVideo = () => {
    const videoPromise = navigator.mediaDevices.getUserMedia({ video: true });
    videoPromise.then(async function (mediaStream) {
        showVideo(mediaStream);
        const recorder = createRecorder(mediaStream);
    });
    videoPromise.catch(function (err) { console.log(err.name); });
}

//Función para mostrar en video lo obtenido desde la cámara
const showVideo = (mediaStream) => {
    video.srcObject = mediaStream;
    video.play();
}

//Función para crear el recorder
const createRecorder = (mediaStream) => {
    const recorder = RecordRTC(mediaStream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
            console.log('started')
        },
    });

    return recorder;
}



//Agregar evento clicl al botón Comenzar creación del Gifo
startCreationButton.addEventListener('click', (event) => {
    event.preventDefault();
    getVideo();
})

