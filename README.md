# xilong.site

Source repository for [xilong.site](https://xilong.site), a statically generated personal blog.

## Highlights

- Markdown article sources under `src/`
- Published post pages under `post/`
- Shared page templates under `template/`
- Front-end styles and scripts under `style/` and `scripts/`
- Client-side search data in `searchdb.json`

## Repository Layout

```text
.
├─ src/                 # Markdown sources with front matter
├─ post/                # Published post pages
├─ template/            # HTML templates and components
├─ style/               # CSS assets
├─ scripts/             # Front-end scripts
├─ res/                 # Static resources (fonts, images, third-party libs)
├─ index.html           # Homepage
└─ searchdb.json        # Search database
```

## Post Source Format

Each post in `src/` starts with front matter:

```md
---
title: Your Post Title
author: Your Name
date: 2026-03-25
---

Abstract paragraph(s)...

## First Section
Main content...
```

Date format: `YYYY-MM-DD`.

## Third-Party Libraries / Acknowledgements

- Latex.css: <https://github.com/vincentdoerig/latex-css>
- Prism: <https://github.com/PrismJS/prism>
- MathJax: <https://github.com/mathjax/MathJax>

## Fonts

- JetBrains Mono: [OFL](./res/fonts/JetBrainsMono-Regular-OFL.txt)
- Material Icons: [License](./res/fonts/MaterialIcons-LICENSE.txt)
- Source Han Serif CN: [OFL](./res/fonts/SourceHanSerifCN-OFL.txt)

## License

- Source code: MIT, see [LICENSE](./LICENSE)
- Articles and written content: CC BY-NC 4.0, see [CONTENT_LICENSE.txt](./CONTENT_LICENSE.txt)
