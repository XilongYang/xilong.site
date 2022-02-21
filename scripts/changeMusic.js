function changeMusic(playerID, src) {
    var player = document.getElementById(playerID);
    player.pause();
    player.setAttribute("src", src);
    console.log(player.innerHTML);
    player.play();
}