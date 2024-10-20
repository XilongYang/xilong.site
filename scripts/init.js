import {refreshDarkMode, switchDarkMode} from "./darkmode.js"
import {getCurrentYear} from "./datetime.js"
import {switchTocMode} from "./toc.js"
import { backTop, goBottom } from "./navigator.js"

refreshDarkMode()

var darkmode = document.getElementById('darkmode')
darkmode.addEventListener('click', switchDarkMode)

var toc = document.getElementById('toc-control')
if (toc != null) {
    toc.addEventListener('click', switchTocMode)
}

var currentYear = document.getElementById('current-year')
currentYear.innerText = getCurrentYear()

var backTopButton = document.getElementById('back-top')
backTopButton.addEventListener('click', backTop)

var goBottomButton = document.getElementById('go-bottom')
goBottomButton.addEventListener('click', goBottom)

var antiFlash = document.getElementById("anti-flash")
antiFlash.parentNode.removeChild(antiFlash)
