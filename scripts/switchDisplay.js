var target=null;
function hide() {
    target.style.display="none";
};
function switchDisplay(id, animation_in, animation_out) {
    target = document.getElementById(id);
    if(target.style.display == "inline") {
        target.addEventListener("animationend", hide);
        target.style.animation=animation_out;
    } else {
        target.removeEventListener("animationend", hide);
        target.style.animation=animation_in;
        target.style.display = "inline";
    }
}

function reloadFrame(id) {
    var frame = document.getElementById(id);
    frame.src = frame.src;
}

function switchDarkmode() {
    var mask = document.getElementById("darkmode-mask");
    if (mask.style.opacity != "1") {
        mask.style.opacity = "1";
    } else {
        mask.style.opacity = "0";
    }
    var buttons = document.getElementsByClassName("fake_close");
    for (var i = 0; i < buttons.length; ++i) {
        buttons[i].style.filter = "invert(1)";
    }
    var frames = document.getElementsByClassName("fake_window_contents");
    for (var i = 0; i < buttons.length; ++i) {
        frames[i].style.filter = "invert(1)";
    }
}