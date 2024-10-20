function refreshDarkMode() {
    var classList = document.body.classList
    var icon = document.getElementById('darkmode')
    var codeStyle = document.getElementById('code-style')
    var imgInvert = document.getElementById('img-invert')
    var currentMode = sessionStorage.getItem("darkmode")
    if (currentMode == "Dark") {
        classList.add("latex-dark")
        icon.innerText = 'light_mode'
        codeStyle.href = '/res/latex-css-1.10.0/prism/prism-dracula.css'
        imgInvert.href = '/style/img-invert.css'
    } else {
        classList.remove("latex-dark")
        icon.innerText = 'dark_mode'
        codeStyle.href = '/res/latex-css-1.10.0/prism/prism-one-light.css'
        imgInvert.href = ''
    }
}

function switchDarkMode() {
    var currentMode = sessionStorage.getItem("darkmode")
    if (currentMode == "Dark") {
        sessionStorage.setItem("darkmode", "Light")
    } else {
        sessionStorage.setItem("darkmode", "Dark")
    }
    refreshDarkMode()
}

export {switchDarkMode, refreshDarkMode}
