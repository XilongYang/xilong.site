var realClose=false;
var hideID=null;
var iconID=null;
var frameID=null;
function hide() {
    var hideTarget = document.getElementById(hideID);
    hideTarget.style.display="none";
    hideTarget.removeEventListener("animationend", hide);
    if(realClose) {
        resetWindowDirect(hideID);
        resetIcon(iconID);
        reloadFrame(frameID);
    }
};
function closeWindow(id, animation, close=false, iconid="", frameid="") {
    hideID=id;
    realClose = close;
    iconID=iconid;
    frameID=frameid;
    var hideTarget = document.getElementById(id);
    hideTarget.addEventListener("animationend", hide);
    hideTarget.style.animation=animation;
}
function callWindow(id, animation) {
    var target = document.getElementById(id);
    if (getComputedStyle(target).display == "none") {
        target.style.animation=animation;
        target.style.display = "inline";
    } else {
        closeWindow(id, 'fadeout 0.5s');
    }
}


function lightIcon(id) {
    var icon = document.getElementById(id);
    icon.style.borderBottom="solid 2px";
}
function resetIcon(id) {
    var icon = document.getElementById(id);
    icon.style.borderBottom="";
}

function reloadFrame(id) {
    var frame = document.getElementById(id);
    frame.src = frame.src;
}

function dark() {
    var buttons = document.getElementsByClassName("fake_close");
    var frames = document.getElementsByClassName("fake_window_contents");
    for (var i = 0; i < buttons.length; ++i) {
        buttons[i].style.filter = "invert(1)";
    }
    for (var i = 0; i < buttons.length; ++i) {
        frames[i].style.filter = "invert(1)";
    }
}
function light() {
    var buttons = document.getElementsByClassName("fake_close");
    var frames = document.getElementsByClassName("fake_window_contents");
    for (var i = 0; i < buttons.length; ++i) {
        buttons[i].style.filter = "invert(0)";
    }
    for (var i = 0; i < buttons.length; ++i) {
        frames[i].style.filter = "invert(0)";
    }
}

function switchDarkmode() {
    var mask = document.getElementById("darkmode-mask");
    mask.removeEventListener("transitionend", dark);
    mask.removeEventListener("transitionend", light);
    if (getComputedStyle(mask).opacity != '1') {
        mask.style.opacity = "1";
        mask.addEventListener("transitionend", dark);
    } else {
        mask.style.opacity = "0";
        mask.addEventListener("transitionend", light);
    }
}

function fullscreen(id) {
    var windowTarget = document.getElementById(id);
    windowTarget.full = "true";
    windowTarget.style.animation="fullscreen 0.5s";
    windowTarget.style.top = "0";
    windowTarget.style.left = "0";
    windowTarget.style.width = "100%";
    windowTarget.style.height = "100%";
}
function resetWindow(id) {
    var windowTarget = document.getElementById(id);
    windowTarget.style.animation="window 0.5s";
    resetWindowDirect(id);
}

function resetWindowDirect(id){
    var windowTarget = document.getElementById(id);
    windowTarget.full = "false";
    windowTarget.style.top = "10%";
    windowTarget.style.left = "15%";
    windowTarget.style.width = "70%";
    windowTarget.style.height = "80%";
}

function switchFull(id) {
    var windowTarget = document.getElementById(id);
    if(windowTarget.full == "true"){
        resetWindow(id);
    } else {
        fullscreen(id);
    }
}
