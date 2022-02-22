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