// Drag
var startX;
var startY;
function dragStart(e) {
    startX = e.screenX;
    startY = e.screenY;
}
function dragEnd(e) {
    var target = document.getElementById(e.path[0].id);
    var endX = e.screenX;
    var endY = e.screenY;
    var originX = parseInt(target.getBoundingClientRect().left);
    var originY = parseInt(target.getBoundingClientRect().top);
    target.style.left = originX + endX - startX + "px";
    target.style.top = originY + endY - startY + "px";
}

//Close&Open
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

//Icon Light&Reset
function lightIcon(id) {
    var icon = document.getElementById(id);
    icon.style.borderBottomStyle="solid";
}
function resetIcon(id) {
    var icon = document.getElementById(id);
    icon.style.borderBottomStyle="";
}

//Reload frame that in windows.
function reloadFrame(id) {
    var frame = document.getElementById(id);
    frame.src = frame.src;
}

//Scale Window
function fullscreen(id) {
    var windowTarget = document.getElementById(id);
    windowTarget.style.animation="fullscreen 0.5s";
    fullscreenDirect(id);
}

function fullscreenDirect(id) {
    var windowTarget = document.getElementById(id);
    windowTarget.full = "true";
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
