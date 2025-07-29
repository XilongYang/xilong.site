#! /usr/bin/python3

import os

from common import SRC_PATH
from common import INDEX_PATH
from common import TEMPLATE_INDEX_PATH
from common import WEB_POST_PATH

from common import gen_template
from common import abs_path
from common import write_file
from common import parse_meta


def split_post_by_year():
    posts_in_year = {}
    for src in [os.path.splitext(file)[0] for file in os.listdir(SRC_PATH)]:
        meta = parse_meta(abs_path(SRC_PATH, src))
        title = meta['title'].replace('"', '')
        year = meta['date'].split('-', 1)[0]
        date = meta['date'].split('-', 1)[1]

        post_item_template = '<p>{} <a href="{}">{}</a></p>'
        post_link = abs_path(WEB_POST_PATH, src)
        post_item = post_item_template.format(date, post_link, title)

        if posts_in_year.get(year) is None:
            posts_in_year[year] = [post_item]
        else:
            posts_in_year[year].append(post_item)
    return posts_in_year


def post_html():
    post_html = ''

    years_with_posts = list(split_post_by_year().items())
    sorted_years = sorted(years_with_posts, key=lambda x: x[0], reverse=True)

    for year, posts in sorted_years:
        post_html += '<div class="post-year-wrapper">'
        post_html += '<h3>' + year + '</h3>' + '\n'
        for post in sorted(posts, reverse=True):
            post_html += '<div class="post-wrapper">' + post + '\n</div>'
        post_html += '</div>'

    return post_html


def update_index():
    index_template = gen_template(TEMPLATE_INDEX_PATH)
    index_html = index_template.replace("$posts$", post_html())
    write_file(INDEX_PATH, index_html)


if __name__ == "__main__":
    update_index()
