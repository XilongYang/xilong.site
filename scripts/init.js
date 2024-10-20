import {refreshDarkMode, switchDarkMode} from "./darkmode.js"
import {getCurrentYear} from "./datetime.js"
import {switchTocMode} from "./toc.js"

refreshDarkMode()

var darkmode = document.getElementById('darkmode')
darkmode.addEventListener('click', switchDarkMode)

var toc = document.getElementById('toc-control')
if (toc != null) {
    toc.addEventListener('click', switchTocMode)
}

var currentYear = document.getElementById('current-year')
currentYear.innerText = getCurrentYear()

var antiFlash = document.getElementById("anti-flash")
antiFlash.parentNode.removeChild(antiFlash)
