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
└── template // template files for post generating
    ├── index.html
    └── post.html
```

## Work flow

### 1. Edit Source Files

To create new posts, just put files in the `src` folder. 

The meta data is surrounded by '---' and has a structure as `"key":value` per line.

Use the `$$toc$$` for a automatic generated TOC, which just include the level 2 title(`##`).

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

Updates the post list, which is sorted by created date and grouped by create year.

The info of title and date of a post is from the meta info of the source files.
