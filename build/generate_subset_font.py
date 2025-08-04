#! /bin/python3

import os
from fontTools import subset

from common import read_file_in_lines
from common import unique_file_list
from common import abs_path

from common import ROOT_PATH
from common import INDEX_PATH
from common import POST_PATH

FONT_SOURCE = os.path.join(ROOT_PATH, "res", "SourceHanSerifCN-Regular.otf")
FONT_SUBSET = os.path.join(ROOT_PATH, "res", "SourceHanSerifCN-Subset.woff2")


def gen_subset(text):
    options = subset.Options()
    options.set(layout_features='*')
    options.set(glyph_names=True)
    options.set(notdef_glyph=True)
    options.set(recalc_bounds=True)
    options.flavor = 'woff2'

    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)

    font = subset.load_font(FONT_SOURCE, options)

    subsetter.subset(font)

    subset.save_font(font, FONT_SUBSET, options)


def generate_subset_font():
    text_set = set(''.join(read_file_in_lines(INDEX_PATH)))
    for file in unique_file_list(POST_PATH):
        abs_post_path = abs_path(POST_PATH, file)
        text_set = text_set | set(''.join(read_file_in_lines(abs_post_path)))

    gen_subset(''.join(sorted(text_set)))


if __name__ == "__main__":
    generate_subset_font()
