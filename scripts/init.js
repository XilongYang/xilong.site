import {refreshDarkMode, switchDarkMode} from "./darkmode.js"
import {getCurrentYear} from "./datetime.js"
import {switchTocMode} from "./toc.js"
import { backTop, goBottom } from "./navigator.js"
import { closePanel, openPanel, search } from "./search.js"
import { clearErrorMsg, inputFilter, refreshFilter, toggleInput } from "./post-filter.js"

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

var searchButton = document.getElementById("search-button")
searchButton.addEventListener("click", openPanel)

var closeSearchButton = document.getElementById("search-close")
closeSearchButton.addEventListener('click', closePanel)

var searchBox = document.getElementById("search-box")
searchBox.addEventListener('input', search)

var antiFlash = document.getElementById("anti-flash")
antiFlash.parentNode.removeChild(antiFlash)

var postFilter = document.getElementById("post-filter")
if (postFilter != null) {
    postFilter.addEventListener('click', toggleInput)

    var postFilterInput = document.getElementById("post-filter-input")
    postFilterInput.addEventListener('keypress', inputFilter)
    postFilterInput.addEventListener('input', inputFilter)
    postFilterInput.addEventListener('focus', clearErrorMsg)
    postFilterInput.addEventListener('focusout', refreshFilter)
}
