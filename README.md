# xilongyang.github.io

This repo is the source code of my personal site (xilong.site).

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
build/refresh.py
```

Updates the posts, which is sorted by creation date and grouped by creation year.

The title and creation date of a post are parse from the metadata of the source files.


