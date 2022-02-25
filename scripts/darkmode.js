function dark() {
    var nondarks = document.getElementsByClassName("non_dark");
    for (var i = 0; i < nondarks.length; ++i) {
        nondarks[i].style.filter = "invert(1)";
    }
}
function light() {
    var nondarks = document.getElementsByClassName("non_dark");
    for (var i = 0; i < nondarks.length; ++i) {
        nondarks[i].style.filter = "invert(0)";
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
