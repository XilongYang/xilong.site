#! /usr/bin/python3

import os
import sys
import re

LOCAL_ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCAL_SRC_PATH = LOCAL_ROOT_PATH + '/src'
LOCAL_INDEX_PATH = LOCAL_ROOT_PATH + '/index.html'
LOCAL_TEMPLATE_PATH = LOCAL_ROOT_PATH + '/template/index.html'

WEB_ROOT_PATH = ''
WEB_POST_PATH= WEB_ROOT_PATH + '/posts'

POST_HTML_TEMPLATE = '<p>$date$ <a href="$link$">$title$</a></p>'

def src2path(file_name):
    return LOCAL_SRC_PATH + '/' + file_name.rstrip('\n') + '.md'

def post2link(file_name):
    return WEB_POST_PATH+ '/' + file_name.rstrip('\n') + '.html'

def read_file(file_path):
    with open(file_path, 'r') as file:
        return file.read()

def parse_meta(src_file_path):
    result = {}
    parse_on = False
    with open(src_file_path, "r") as file:
        for line in file:
            clear_line = line.replace('\n', '')
            if clear_line == '---':
                parse_on = not parse_on
            elif parse_on:
                parse = clear_line.split(':', 1)
                result[parse[0].replace(' ','')] = parse[1]
    return result

def post_html():
    post_map = {} 
    for src in list(set([file.split('.')[0] for file in os.listdir(LOCAL_SRC_PATH)])):
        meta = parse_meta(src2path(src))
        title = meta['title'].replace('"','')
        date = meta['date'].split('-', 1)
        post_item = POST_HTML_TEMPLATE.replace("$date$", date[1]).replace("$link$", post2link(src)).replace("$title$", title)

        if None == post_map.get(date[0]):
            post_map[date[0]] = [post_item]
        else:
            post_map[date[0]].append(post_item)

    post_html = ''
    for year_post in sorted(list(post_map.items()), key=lambda x: x[0], reverse=True):
        post_html += '<h3>' + year_post[0] + '</h3>' + '\n'
        for post_items in sorted(year_post[1], reverse=True):
            post_html += post_items + '\n'

    return post_html

index_contents = read_file(LOCAL_TEMPLATE_PATH).replace("$posts$", post_html())
with open(LOCAL_INDEX_PATH, "w") as index_file:
    index_file.write(index_contents)
