import {switchDarkMode} from "./darkmode.js";
import {getCurrentYear} from "./datetime.js";
import {switchTocMode} from "./toc.js";

var darkmode = document.getElementById('darkmode');
darkmode.addEventListener('click', switchDarkMode);
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    switchDarkMode();
}

var toc = document.getElementById('toc-control');
toc.addEventListener('click', switchTocMode);

var currentYear = document.getElementById('current-year');
currentYear.innerText = getCurrentYear();
