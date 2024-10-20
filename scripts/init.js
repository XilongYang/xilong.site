import {refreshDarkMode, switchDarkMode} from "./darkmode.js"
import {getCurrentYear} from "./datetime.js"
import {switchTocMode} from "./toc.js"

var darkmode = document.getElementById('darkmode')
darkmode.addEventListener('click', switchDarkMode)

var perferDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
var savedDarkMode = sessionStorage.getItem("darkmode")
if (savedDarkMode == null && perferDarkMode) {
    sessionStorage.setItem("darkmode", "Dark")
}
refreshDarkMode()

var toc = document.getElementById('toc-control')
if (toc != null) {
    toc.addEventListener('click', switchTocMode)
}

var currentYear = document.getElementById('current-year')
currentYear.innerText = getCurrentYear()
