function dark() {
    var nondarks = document.getElementsByClassName("non_dark");
    for (var i = 0; i < nondarks.length; ++i) {
        nondarks[i].style.filter = "invert(1)";
        nondarks[i].style.animation = "invert 0.5s";
    }
}
function light() {
    var nondarks = document.getElementsByClassName("non_dark");
    for (var i = 0; i < nondarks.length; ++i) {
        nondarks[i].style.filter = "invert(0)";
        nondarks[i].style.animation = "devert 0.5s";
    }
}

function switchDarkmode() {
    var mask = document.getElementById("darkmode-mask");
    mask.removeEventListener("transitionstart", dark);
    mask.removeEventListener("transitionstart", light);
    if (getComputedStyle(mask).opacity != '1') {
        mask.addEventListener("transitionstart", dark);
        mask.style.opacity = "1";
    } else {
        mask.addEventListener("transitionstart", light);
        mask.style.opacity = "0";
    }
}
