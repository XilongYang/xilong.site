#! /usr/bin/python3

import os

from common import SRC_PATH
from common import INDEX_PATH
from common import INDEX_TEMPLATE
from common import src_path
from common import read_file
from common import write_file

WEB_ROOT_PATH = ''
WEB_POST_PATH= WEB_ROOT_PATH + '/posts'

def post2link(file_name):
    return WEB_POST_PATH+ '/' + file_name.rstrip('\n') + '.html'

def parse_meta(src):
    result = {}
    parse_on = False
    contents = read_file(src)
    for line in contents:
        clear_line = line.replace('\n', '')
        if clear_line == '---':
            parse_on = not parse_on
        elif parse_on:
            parse = clear_line.split(':', 1)
            result[parse[0].replace(' ','')] = parse[1]
    return result

def post_html():
    post_map = {}
    for src in [file.split('.')[0] for file in os.listdir(SRC_PATH)]:
        meta = parse_meta(src_path(src))
        title = meta['title'].replace('"','')
        year = meta['date'].split('-', 1)[0]
        date = meta['date'].split('-', 1)[1]
        post_item_template = '<p>{} <a href="{}">{}</a></p>'
        post_item = post_item_template.format(date, post2link(src), title)

        if None == post_map.get(year):
            post_map[year] = [post_item]
        else:
            post_map[year].append(post_item)

    post_html = ''
    for post_year in sorted(list(post_map.items()), key=lambda x: x[0], reverse=True):
        post_html += '<h3>' + post_year[0] + '</h3>' + '\n'
        for post_items in sorted(post_year[1], reverse=True):
            post_html += post_items + '\n'

    return post_html

def update_index():
    write_file(INDEX_PATH, ''.join(read_file(INDEX_TEMPLATE)).replace("$posts$", post_html()))

if __name__ == "__main__":
    update_index()
