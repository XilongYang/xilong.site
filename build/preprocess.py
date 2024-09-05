#! /usr/bin/python3

import re

from common import read_file
from common import write_file

def parse_title_link(title):
    return '#' + re.sub(r'[^\w\s]', '', title.lower())

def correct_pl_option(option):
    template = '``` {.language-%s .line-numbers .match-braces}'
    return template % (re.sub(r'[` ]', '', option).lower())

def generate_toc(contents):
    toc_titles = re.findall('^## .*$', contents, flags=re.MULTILINE)
    toc_titles = [x.replace('##', '').strip() for x in toc_titles]

    toc_item_template = '<li><a href="{}">{}</a></li>\n'
    toc_items = [toc_item_template.format(parse_title_link(x), x) for x in toc_titles]

    toc_template = '<nav role="navigation" class="toc">\n<h2>Contents</h2>\n<ol>\n{}\n</ol>\n</nav>'
    toc = toc_template.format(''.join(toc_items))

    return contents.replace('$$toc$$', toc)

def preprocess(src_file, target_file):
    # Procedure the source file
    contents = read_file(src_file)
    contents = generate_toc("".join(contents))

    # Replace programming language options
    pl_options = set(re.findall('```.+$', contents, flags=re.MULTILINE))
    for option in pl_options:
        contents = contents.replace(option, correct_pl_option(option))

    # Write the temp file
    write_file(target_file, contents)
