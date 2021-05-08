//Función para cargar mis Gifos favoritos
const loadMyGifos = () => {
    let gifos = getGifos();
    if (gifos?.myOwnGifos?.length == 0) {
        document.getElementById('no_content').style.display = 'flex';
        document.getElementById('more_content').style.display = 'none';
        document.getElementById('my_gifos_title').style.marginBottom = '0px';
    }
    else {
        document.getElementById('no_content').style.display = 'none';
        const gifContainer = document.getElementById('gif-content-my-gifos');
        let offSet = (gifos.myOwnGifosOffset + 12 <= gifos.myOwnGifos.length) ? gifos?.myOwnGifosOffset + 12 : gifos.myOwnGifos.length;
        for (var position = gifos?.myOwnGifosOffset; position < offSet; position++) {
            gifContainer.appendChild(generateGifWithOverlay(gifos.myOwnGifos[position], false, false, true));
        }
        gifos.myOwnGifosOffset = offSet;
        saveGifos(gifos);
        document.getElementById('more_content').style.display = 'block';
        document.getElementById('my_gifos_title').style.marginBottom = (window.innerWidth >= 768) ? '36px' :  '46px';
    }
};

const refreshMyGifos = () => {
    let gifos = getGifos();
    gifos.myOwnGifosOffset = 0;
    saveGifos(gifos);
    loadMyGifos();
};

refreshMyGifos();