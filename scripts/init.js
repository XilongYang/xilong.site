import {switchDarkMode} from "./darkmode.js";

var darkmode = document.getElementById('darkmode');
darkmode.addEventListener('click', switchDarkMode);
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    switchDarkMode();
} 
