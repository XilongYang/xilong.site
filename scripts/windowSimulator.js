var windowsNums = 0;
// Drag
var curX = 0;
var curY = 0;
var selected = null;

var startX = 0;
var startY = 0;
var originX = 0;
var originY = 0;
function dragStart(e) {
    startX = curX;
    startY = curY;
    selected = e.target;
    while (selected.className != "fake_window" && selected.parentNode != null) {
        selected = selected.parentNode;
    }
    if (selected.className != "fake_window") {
        selected = null;
        return;
    }
    originX = parseInt(selected.getBoundingClientRect().left);
    originY = parseInt(selected.getBoundingClientRect().top);
    var dragMasks = document.getElementsByClassName("drag_mask");
    for (var i = 0; i < dragMasks.length; ++i) {
        dragMasks[i].style.display = "inline";
    }
    updateOrderEvent(e);
}

function updateMousePos(e) {
    curX = e.clientX;
    curY = e.clientY;
    if (selected == null) return;
    selected.style.left = originX + curX - startX + "px";
    selected.style.top = originY + curY - startY + "px";
}

function dragEnd() {
    selected = null;
    var dragMasks = document.getElementsByClassName("drag_mask");
    for (var i = 0; i < dragMasks.length; ++i) {
        dragMasks[i].style.display = "none";
    }
}

function dragMode(e) {
    if (e.key == "Alt") {
        var dragMasks = document.getElementsByClassName("drag_mask");
        for (var i = 0; i < dragMasks.length; ++i) {
            dragMasks[i].style.display = "inline";
        }
    }
}

function clearDragMode(e) {
    if (e.key == "Alt" && selected == null) {
        var dragMasks = document.getElementsByClassName("drag_mask");
        for (var i = 0; i < dragMasks.length; ++i) {
            dragMasks[i].style.display = "none";
        }
    }
}

//Close&Open
function close(e) {
    var window = e.target;
    window.removeEventListener("animationend", close);
    if (document.getElementById("body").mobile != "true") {
        resetWindowDirect(window);
    }
    window.style.visibility = "hidden";
    var childs = window.childNodes;
    for (var i = 0; i < childs.length; ++i) {
        if (childs[i].nodeName == "IFRAME") {
            childs[i].src = childs[i].src + ''; 
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
    --windowsNums;
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
    target.style.visibility ="hidden";
    target.removeEventListener("animationend", hide);
    --windowsNums;
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
    if (getComputedStyle(target).visibility == "hidden") {
        target.style.animation="fadein 0.5s";
        target.style.visibility = "visible";
        updateOrder(target);
        ++windowsNums;
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
function updateOrder(target) {
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
                order[j].style.zIndex = j + 20;
            }
            order.pop();
        }
    }
    order.push(target);
    target.style.zIndex = order.length + 20;
}

function updateOrderEvent(e) {
    var target = e.target;
    updateOrder(target);
}
