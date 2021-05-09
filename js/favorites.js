//Función para cargar mis Gifos favoritos
const loadMyFavorites = () => {
    let gifos = getGifos();
    if (gifos?.favorites?.length == 0) {
        document.getElementById('no_content').style.display = 'flex';
        document.getElementById('more_content').style.display = 'none';
        document.getElementById('favorites_title').style.marginBottom = '0px';
    }
    else {
        document.getElementById('no_content').style.display = 'none';
        const gifContainer = document.getElementById('gif-content-favorites');
        let offSet = (gifos.favoritesOffset + 12 <= gifos.favorites.length) ? gifos?.favoritesOffset + 12 : gifos.favorites.length;
        for (var position = gifos?.favoritesOffset; position < offSet; position++) {
            gifContainer.appendChild(generateGifWithOverlay(gifos.favorites[position], false, true));
        }
        gifos.favoritesOffset = offSet;
        saveGifos(gifos);
        document.getElementById('more_content').style.display = 'block';
        document.getElementById('favorites_title').style.marginBottom = (window.innerWidth >= 768) ? '36px' : '46px';
    }
};

const refreshFavorites = () => {
    let gifos = getGifos();
    gifos.favoritesOffset = 0;
    saveGifos(gifos);
    loadMyFavorites();
};

refreshFavorites();