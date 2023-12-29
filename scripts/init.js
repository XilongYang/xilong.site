import {switchDarkMode} from "./darkmode.js";
import {getCurrentYear} from "./datetime.js";

var darkmode = document.getElementById('darkmode');
darkmode.addEventListener('click', switchDarkMode);
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    switchDarkMode();
} 

var currentYear = document.getElementById('current-year');
currentYear.innerText = getCurrentYear();
