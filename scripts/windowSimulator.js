// Drag
var startX;
var startY;
function dragStart(e) {
    console.log(e);
    startX = e.screenX;
    startY = e.screenY;
    updateOrder(e);
}
function dragEnd(e) {
    console.log(e);
    var target = e.target;
    var endX = e.screenX;
    var endY = e.screenY;
    var originX = parseInt(target.getBoundingClientRect().left);
    var originY = parseInt(target.getBoundingClientRect().top);
    target.style.left = originX + endX - startX + "px";
    target.style.top = originY + endY - startY + "px";
}

//Close&Open
function close(e) {
    var window = e.target;
    window.removeEventListener("animationend", close);
    window.style.display = "none";
    if (document.getElementById("body").mobile != "true") {
        resetWindowDirect(window);
    }
    var childs = window.childNodes;
    for (var i = 0; i < childs.length; ++i) {
        if (childs[i].nodeName == "IFRAME") {
            childs[i].src = childs[i].src;
        }
    }
    var app = window.parentNode;
    while (app.className != "app") {
        app = app.parentNode;
    }
    var appchilds = app.childNodes;
    for (var i = 0; i < appchilds.length; ++i) {
        if (appchilds[i].className == "icon") {
            appchilds[i].style.borderBottomStyle = "";
        }
    }
}

function closeWindow(target) {
    target.style.animation="fadeout 0.5s";
    target.addEventListener("animationend", close);
}

function closeButtonEvent(e) {
    var target = e.target;
    while(target.className != "fake_window") {
        target = target.parentNode;
    }
    closeWindow(target);
}

function hide(e) {
    var target = e.target;
    target.style.display="none";
    target.removeEventListener("animationend", hide);
};

function hideWindow(target) {
    target.style.animation="fadeout 0.5s";
    target.addEventListener("animationend", hide);
}

function hideButtonEvent(e) {
    var target = e.target;
    while(target.className != "fake_window") {
        target = target.parentNode;
    }
    hideWindow(target);
}

//Icon
function lightIcon(e) {
    var icon = e.target;
    while (icon.className != "icon") {
        icon = icon.parentNode;
    }
    icon.style.borderBottomStyle="solid";
}

function callWindow(e) {
    var target = e.target;
    while (target.className != "app") {
        target = target.parentNode;
    }
    var childs = target.childNodes;
    for (var i = 0; i < childs.length; ++i) {
        if(childs[i].className == "fake_window") {
            target = childs[i];
            break;
        }
    }
    if (getComputedStyle(target).display == "none") {
        target.style.animation="fadein 0.5s";
        target.style.display = "inline";
    } else {
        hideWindow(target);
    }
}

//Scale Window
function fullscreen(target) {
    target.style.animation="fullscreen 0.5s";
    fullscreenDirect(target);
}

function fullscreenDirect(target) {
    target.full = "true";
    target.style.top = "0";
    target.style.left = "0";
    target.style.width = "100%";
    target.style.height = "100%";
}

function resetWindow(target) {
    target.style.animation="window 0.5s";
    resetWindowDirect(target);
}

function resetWindowDirect(target){
    target.full = "false";
    target.style.top = "10%";
    target.style.left = "15%";
    target.style.width = "70%";
    target.style.height = "80%";
}

function switchFull(e) {
    var window = e.target;
    while(window.className != "fake_window") {
        window = window.parentNode;
    }
    if(window.full == "true"){
        resetWindow(window);
    } else {
        fullscreen(window);
    }
}

//Stack simulation
var order = new Array();
function updateOrder(e) {
    var target = e.target;
    while(target.className != "fake_window") {
        target = target.parentNode;
    }
    if (target.className != "fake_window") {
        return;
    }
    for (var i = 0; i < order.length; ++i) {
        if (order[i] == target) {
            for (var j = i; j + 1 < order.length; ++j) {
                order[j] = order[j + 1];
                order[j].style.zIndex = j + 1;
            }
            order.pop();
        }
    }
    order.push(target);
    target.style.zIndex = order.length;
}
