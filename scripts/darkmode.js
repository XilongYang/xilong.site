function switchDarkMode() {
    var isDark = document.body.classList.toggle("latex-dark");
    var icon = document.getElementById('darkmode');
    var codeStyle = document.getElementById('code-style')
    var imgInvert = document.getElementById('img-invert')
    if (isDark) {
        icon.innerText = 'light_mode';
        codeStyle.href = '/res/latex-css-1.10.0/prism/prism-dracula.css';
        imgInvert.href = '/style/img-invert.css';
    } else {
        icon.innerText = 'dark_mode';
        codeStyle.href = '/res/latex-css-1.10.0/prism/prism-one-light.css';
        imgInvert.href = ''
    }
}

export {switchDarkMode};
