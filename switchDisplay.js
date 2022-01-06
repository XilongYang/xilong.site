function switchDisplay(bid, iid) {
    var button = document.getElementById(bid);
    var intro = document.getElementById(iid);
    if (intro.style.display == "none" || intro.style.display == "") {
        intro.style.display = "inherit";
        button.innerHTML = '<i class="fa fa-chevron-down"></i>';
    } else {
        intro.style.display = "none";
        button.innerHTML = '<i class="fa fa-chevron-up"></i>';
    }
}