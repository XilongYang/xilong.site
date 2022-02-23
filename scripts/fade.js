var prePos = 642;
function fade() {
    var fades = document.getElementById("fades");
    var curPos = fades.offsetTop - document.documentElement.scrollTop;
    if (curPos < prePos && curPos < 500) {
        fades.style.animation="fadein 1s";
        fades.style.opacity=1;
    }
    if (curPos > prePos && curPos >= 500) {
        fades.style.animation="fadeout 1s";
        fades.style.opacity=0;
    }
    prePos = curPos;
}