function switchDisplay(id) {
    var target = document.getElementById(id);
    if(target.style.display == "inline") {
        target.style.display = "none";
    } else {
        target.style.display = "inline";
    }
}