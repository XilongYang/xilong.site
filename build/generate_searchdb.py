#! /usr/bin/python3

import os
import json
from html.parser import HTMLParser

from common import POST_PATH
from common import SEARCHDB_PATH
from common import parse_meta
from common import post2link
from common import src_path
from common import post_path
from common import read_file
from common import write_file

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.data = []

    def handle_data(self, data):
        self.data.append(data.strip())

def gen_searchdb():
    posts = []
    for file in [file.split('.')[0] for file in os.listdir(POST_PATH)]:
        title = parse_meta(src_path(file))['title'].replace('"', '')
        url = post2link(file)

        valid_lines = []
        line_valid = False
        for line in read_file(post_path(file)):
            if line.find('<main>') != -1:
                line_valid = True
            if line.find('</main>') != -1:
                line_valid = False
            if not line_valid:
                continue
            valid_lines.append(line)

        parser = MyHTMLParser()
        parser.feed(''.join(valid_lines))
        content = ''.join(parser.data).replace('\n','')

        posts.append({"title": title, "url": url, "content": content})

    json_string = json.dumps({"posts":posts}, ensure_ascii=False)

    write_file(SEARCHDB_PATH, json_string)

if __name__ == "__main__":
    gen_searchdb()
