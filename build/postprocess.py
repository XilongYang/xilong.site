#! /usr/bin/python3

import re

from common import read_file
from common import write_file

MAX_LEVEL = 4

def part_toc(contents, level):
    if contents == '' or level > MAX_LEVEL:
        return ''

    title_pattern = '<h%d *id=".*">.*</h%d>' % (level, level)
    indexs = [i for i in range(0, len(contents)) if re.match(title_pattern, contents[i:]) != None]
    indexs.append(len(contents))

    parse_id = lambda i : contents[indexs[i]:].split('"')[1]
    parse_title = lambda i : contents[indexs[i]:].split('>')[1].split('<')[0]
    parse_sub_contents = lambda i : contents[indexs[i]:indexs[i + 1]]

    item_pair = [(parse_id(i), parse_title(i), parse_sub_contents(i)) for i in range(len(indexs) - 1)]
    template = '<li><a href="#{}">{}</a>{}</li>\n'

    items = [template.format(x[0], x[1], part_toc(x[2], level + 1)) for x in item_pair]
    return '<ol>{}</ol>'.format(''.join(items))

def is_chinese_post(contents):
    title = ''.join(re.findall(r'<title.*/title>', contents))
    return len([c for c in title if '\u4e00' <= c <= '\u9fff']) > 0

def generate_toc(contents):
    toc_template = ('<nav role="navigation" class="toc">\n<h2>Contents<i class="material-icons icon" '
                    'id="toc-control">remove</i></h2>\n<div id="toc-items">\n{}\n</div>\n</nav>')
    if is_chinese_post(''.join(contents)):
        toc_template = toc_template.replace('Contents', '目录')

    serialized_contents = ''.join([x.strip() for x in contents]).replace('\n', '')
    toc = toc_template.format(part_toc(serialized_contents, 2))

    return ''.join(contents).replace('<p>[[toc]]</p>', toc)

def postprocess(src_file, target_file):
    # Generate TOC
    write_file(target_file, generate_toc(read_file(src_file)))
