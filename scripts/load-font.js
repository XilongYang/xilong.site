function loadFont() {
    fetch(`/res/SourceHanSerifCN-Subset.woff2`, { method: 'HEAD' })
        .then(resp => {
        if (resp.ok) {
            const font = new FontFace('Source Han Serif', `url(/res/SourceHanSerifCN-Subset.woff2)`);
            font.load().then(f => {
                document.fonts.add(f);
                const fontFamily = "'Latin Modern', $TARGET$, Georgia, Cambria, 'Times New Roman', Times, serif"
                document.body.style.fontFamily = fontFamily.replace("$TARGET$", "'Source Han Serif'");
            });
        }
    });
}

export {loadFont}
