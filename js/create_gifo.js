
//Key para el sesionstorage
const gifosCreationStepKey = 'gifosCreationStep';
const video = document.getElementById('gifos_video');

//Variable para retener el Gifo grabado antes de subirlo
let currentGifo;

//Título principal de crear Gifos
const createGifosTitle = document.getElementById('create_gifos_title');

//Párrafo principal de crear Gifos
const createGifosParagraph = document.getElementById('create_gifos_paragraph');

//Botón para comenzar 'crear Gifo'
const startCreationButton = document.getElementById('start_creation');

//Botón para iniciar la grabación para 'crear Gifo'
const recordButton = document.getElementById('record');

//Botón para finalizar la grabación para 'crear Gifo'
const stopRecordingButton = document.getElementById('stop_recording');

//Botón para subir a Gifos el Gif que hemos creado
const uploadButton = document.getElementById('upload');

//Botón step 1
const step1 = document.getElementById('step_1');

//Botón step 2
const step2 = document.getElementById('step_2');

//Botón step 3
const step3 = document.getElementById('step_3');

//No Botón ID
const no_button = document.getElementById('no_button');

//Flag grabando
let isRecording = false;

//Hora y fecha de inicio de la grabación
let dateStarted = null;

//Contador
const timerText = document.getElementById('timer');

//Repetir captura
const repeatText = document.getElementById('repeat');

//Overlead Gifo
const overlayGifo = document.getElementById('create_gifo_overlay');

//Loading Gifo
const loadingGifo = document.getElementById('loading_gifo');

//Loaded Gifo
const loadedGifo = document.getElementById('loaded_gifo');


//Función para solicitar permisos de acceso a la cámara 
const getVideo = () => {
    createGifosTitle.innerHTML = '¿Nos das acceso <br> a tu cámara?';
    createGifosParagraph.innerHTML = 'El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO.';
    step1.className = 'step-full';
    startCreationButton.style.display = 'none';
    no_button.style.marginTop = '46px';
    no_button.style.marginBottom = '76px';
    let videoPromise = navigator.mediaDevices.getUserMedia({ video: true });
    videoPromise.then(async function (mediaStream) {
        createGifosTitle.style.display = 'none';
        createGifosParagraph.style.display = 'none';
        video.style.display = 'inline';
        step1.className = 'step';
        step2.className = 'step-full';
        no_button.style.marginTop = '0px';
        no_button.style.marginBottom = '0px';
        recordButton.style.display = 'inline';
        showVideo(mediaStream);
        isRecording = false;
        const recorder = createRecorder(mediaStream);
        recordButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('a')
            startRecording(recorder);
        });

        stopRecordingButton.addEventListener('click', (event) => {
            event.preventDefault();
            stopRecording(recorder);
        });
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

//Iniciar la grabación para crear Gifo
const startRecording = (recorder) => {
    recordButton.style.display = 'none';
    stopRecordingButton.style.display = 'inline';
    isRecording = true;
    dateStarted = new Date().getTime();
    recorder.startRecording();
    timerText.style.display = 'inline';
    timer();
    console.log('startRecording');
}

//Detener la grabación para crear Gifo
const stopRecording = (recorder) => {
    recorder.stopRecording(() => {
        console.log('stopRecording');
        stopRecordingButton.style.display = 'none';
        isRecording = false;
        generateGifo(recorder);
        uploadButton.style.display = 'inline';
        timerText.style.display = 'none';
        repeatText.style.display = 'inline';
    });
}

//Crear Gif a partir de la grabación
const generateGifo = (recorder) => {
    console.log('generatingGifo');
    console.log(recorder.getBlob());
    let form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    currentGifo = form;
}

//Agregar evento click al botón Comenzar creación del Gifo
startCreationButton.addEventListener('click', (event) => {
    event.preventDefault();
    getVideo();
})

//Agregar evento click al botón Subir Gifo 
const uploadGifosRequest = (data) => {
    const URL = 'https://upload.giphy.com/v1/gifs?' + KEY;
    return new Promise((resolve, reject) => {
        fetch(URL, { method: 'POST', body: data })
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

//Función para obtener un Gif por su ID
const getGifoById = (id) => {
    const URL = 'https://api.giphy.com/v1/gifs/' + id + '?' + KEY;
    return new Promise((resolve, reject) => {
        fetch(URL, { method: 'GET' })
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}


// Procesar respuesta de Giphy
const receiveGifo = () => {
    if (currentGifo) {
        overlayGifo.style.height = '100%';
        loadingGifo.style.display = 'inline';
        const giphyRequest = uploadGifosRequest(currentGifo);
        giphyRequest.then((gifData) => {
            console.log(gifData);
            return gifData?.data?.id;
        }).then((gifId) => {
            getGifoById(gifId).then((gif) => {
                console.log(gif);
                saveMyGifo(gif.data);
            })
        })
    }
}

// Guardar mi Gifo
const saveMyGifo = (gif) => {
    let gifos = getGifos();
    const gifo = new Gif(gif.id, 'My Gifo ' + gif.id, 'Gifos App', gif?.images?.fixed_height?.url);
    gifos.myOwnGifos.push(gifo);
    saveGifos(gifos);
    loadingGifo.style.display = 'none';
    loadedGifo.style.display = 'inline';
};


uploadButton.addEventListener('click', (event) => {
    event.preventDefault();
    receiveGifo();
})

//Generar formato de horas para el contador o timer
function calculateTimeDuration(secs) {
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if (hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
}

//Función para mostrar el contador
const timer = () => {
    console.log('timer');
    if (!isRecording) {
        return;
    }
    timerText.innerHTML = calculateTimeDuration((new Date().getTime() - dateStarted) / 1000);
    setTimeout(timer, 1000);
}

//Función para reiniciar todo
const reset = () => {
    startCreationButton.style.display = 'none';
    recordButton.style.display = 'inline';
    stopRecordingButton.style.display = 'none';
    uploadButton.style.display = 'none';
    timerText.style.display = 'none';
    repeatText.style.display = 'none';
    currentGifo = null;
    getVideo();
}

//Función click al texto Repetir Captura
repeatText.addEventListener('click', event => {
    event.preventDefault();
    reset();
})