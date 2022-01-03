var en = true;

function hidden(e) {
    e.setAttribute("hidden", "");
}

function show(e) {
    e.removeAttribute("hidden");
}

function switch_language() {
    var ens = Array.from(document.getElementsByClassName("en"));
    var cns = Array.from(document.getElementsByClassName("cn"));
    if (en) {
        ens.map(hidden);
        cns.map(show);
    } else {
        ens.map(show);
        cns.map(hidden);
    }
    en = !en;
}