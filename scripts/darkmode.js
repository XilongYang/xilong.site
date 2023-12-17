function switchDarkMode() {
    var isDark = document.body.classList.toggle("latex-dark");
    var icon = document.getElementById('darkmode');
    if (isDark) {
        icon.innerText = 'light_mode';
    } else {
        icon.innerText = 'dark_mode';
    }
}

export {switchDarkMode};
