class Music {
    constructor(id, name, url) {
        this.id = id;
        this.name = name;
        this.url = url;
    }
    item() {
        return "<div class='music-item' onclick='changeMusic(\""+this.name
               +"\", \""+this.url+"\");changeItemDisplay(\""+this.id
               +"\")' id='"+this.id+"'>"+this.name+"</div>";
    }
}

var playlist = new Array();
playlist[0] = new Music("1", "Animenz - Merry-go-round of life", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz_merry-go-round_of_life.mp3");
playlist[1] = new Music("2", "Animenz - A cruel angel thesis", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-a_cruel_angel_thesis.mp3");
playlist[2] = new Music("3", "Animenz - βios", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-bios.mp3");
playlist[3] = new Music("4", "Animenz - Blue bird", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-blue_bird.mp3");
playlist[4] = new Music("5", "Animenz - Change the world", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-change_the_world.mp3");
playlist[5] = new Music("6", "Animenz - Connect", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-connect.mp3");
playlist[6] = new Music("7", "Animenz - Dango family", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-dango.mp3");
playlist[7] = new Music("8", "Animenz - Departures", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-departures.mp3");
playlist[8] = new Music("9", "Animenz - Hikaru nara", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-hikaru_nara.mp3");
playlist[9] = new Music("10", "Animenz - Kawaki wo ameku", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-kawaki_wo_ameku.mp3");
playlist[10] = new Music("11", "Animenz - Main theme from laputa", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-main_theme_from_laputa.mp3");
playlist[11] = new Music("12", "Animenz - One more time, one more chance", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-one_more_time_one_more_chance.mp3");
playlist[12] = new Music("13", "Animenz - Screct base", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-screct_base.mp3");
playlist[13] = new Music("14", "Animenz - Tabi no tochuu", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-tabi_no_tochuu.mp3");
playlist[14] = new Music("15", "Animenz - The everlasting guilty crown", "https://onedrive.xilong.site/Music/Pure/Animenz/animenz-the_everlasting_guilty_crown.mp3");

function generatePlaylist() {
    var musics = document.getElementById("musics");
    for (var i = 0; i < playlist.length; ++i) {
        musics.innerHTML += playlist[i].item();
    }
}

function changeMusic(name, src) {
    var player = document.getElementById("control");
    player.pause();
    player.setAttribute("src", src);
    console.log(player.innerHTML);
    player.play();

    var nameDiv = document.getElementById("name");
    nameDiv.innerHTML = name;
}

function changeFromUrl() {
    var url = document.getElementById("custom-url").value;
    changeMusic(url, url);
    url = "";
}

function playAnimation() {
    var disk = document.getElementById("disk");
    disk.style.animation = "shake 200ms infinite";
}

function stopAnimation() {
    var disk = document.getElementById("disk");
    disk.style.animation = "";
}
var preItem = null;
function changeItemDisplay(id) {
    if (preItem != null) preItem.style = "";
    var item = document.getElementById(id);
    console.log(id);
    console.log(item.innerHTML);
    item.style = "box-shadow: 0px 0px 4px 4px #aaa;background-color: #333;color: #fff;";
    preItem = item;
}