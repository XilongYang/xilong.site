# xilongyang.github.io

This repo is the source code of my personal site (xilong.site).

## File Structure

```
.
├── 404.html // the 404 page
├── CNAME
├── README.md
├── build // build tools
│   ├── update-index.py
│   └── update-post.py
├── index.html
├── todolist.txt
├── posts // generated post pages
│   ├── 001_C_The_Binary_Representation_of_Float_Numbers_IEEE_754.html
│   └── 002_C++_Declaration_and_Definition.html
├── res
│   ├── JetBrainsMono-Regular.ttf
│   ├── MaterialIcons
│   ├── favicon.ico
│   ├── latex-css-1.10.0
│   └── mathjax
├── scripts
│   ├── darkmode.js
│   ├── datetime.js
│   └── init.js
├── src // post sources
│   ├── 001_C_The_Binary_Representation_of_Float_Numbers_IEEE_754.md
│   └── 002_C++_Declaration_and_Definition.md
├── style
│   ├── darkmode.css
│   ├── patches.css
│   └── wrapper.css
└── template // template files for generating
    ├── index.html
    └── post.html
```

## Work flow

### 1. Edit Source Files

To create new posts, just put `.md` files in the `src` folder. 

The metadata is surrounded by '---' and it has a structure such as `"key":value` per line.

Use the `$$toc$$` for an automatic generated TOC, which just include the level 2 title(`##`).

### 2. Generate Posts

Dependencies:

```
python3
pandoc
```

Run:

```
build/update-post.py
```

### 3. Generate Index

Run:

```
build/update-index.py
```

Updates the post list, which is sorted by creation date and grouped by creation year.

The title and creation date of a post are parse from the metadata of the source files.
