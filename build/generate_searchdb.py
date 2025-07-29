#! /usr/bin/python3

import json
from html.parser import HTMLParser

from common import SRC_PATH
from common import POST_PATH
from common import WEB_POST_PATH
from common import SEARCHDB_PATH

from common import abs_path
from common import parse_meta
from common import unique_file_list

from common import read_file_in_lines
from common import write_file


class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.data = []

    def handle_data(self, data):
        self.data.append(data.strip())


def gen_searchdb():
    posts = []
    for file in unique_file_list(POST_PATH):
        title = parse_meta(abs_path(SRC_PATH, file))['title'].replace('"', '')
        url = abs_path(WEB_POST_PATH, file)

        valid_lines = []
        line_valid = False
        for line in read_file_in_lines(abs_path(POST_PATH, file)):
            if line.find('<main>') != -1:
                line_valid = True
            if line.find('</main>') != -1:
                line_valid = False
            if not line_valid:
                continue
            valid_lines.append(line)

        parser = MyHTMLParser()
        parser.feed(''.join(valid_lines))
        content = ' '.join(parser.data).replace('\n',' ').replace('Contents remove', 'Contents')

        posts.append({"title": title, "url": url, "content": content})

    json_string = json.dumps({"posts": posts}, ensure_ascii=False)

    write_file(SEARCHDB_PATH, json_string)


if __name__ == "__main__":
    gen_searchdb()
