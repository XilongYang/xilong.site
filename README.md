# xilongyang.github.io

This repo is the source code of my personal site (xilong.site).

## Work flow

### 1. Edit Source Files

To create new posts, just put `.md` files in the `src` folder. 

The metadata is surrounded by '---' and it has a structure such as `"key":value` per line.

Insert a `[[toc]]` into source files for an automatic generated TOC.

### 2. Generate Posts

Dependencies: `python3`, `pandoc`

Run `make` to build posts.

Run `make clean` to remove all posts already built.

Posts are sorted by their creation date and grouped by their creation year.
