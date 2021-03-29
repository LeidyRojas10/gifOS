//Función para cargar mis Gifos favoritos
const loadMyFavorites = ()=> {
    const gifos = getGifos();
    console.log("myCurrentFavorites",gifos?.favorites?.length);
    
    if(gifos?.favorites?.length == 0){
        document.getElementById('no_content').style.display='flex';
    }
    else{
        document.getElementById('no_content').style.display='none';
        const gifContainer = document.getElementById('gif-content');
        for (var position = 0; position < gifos?.favorites?.length; position++) {
            
            gifContainer.appendChild(generateGifWithOverlay(gifos.favorites[position],false,true));
        }
    }
};

loadMyFavorites();