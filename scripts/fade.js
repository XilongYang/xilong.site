var prePos = 642;
function fade() {
    if (window.innerWidth)
    var about = document.getElementById("about");
    var curPos = about.offsetTop - document.documentElement.scrollTop;
    if (curPos < prePos && curPos < 400) {
        about.style.animation="fadein 0.5s";
        about.style.opacity=1;
    }
    if (curPos > prePos && curPos >= 400) {
        about.style.animation="fadeout 0.5s";
        about.style.opacity=0;
    }
    prePos = curPos;
}