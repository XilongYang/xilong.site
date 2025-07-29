#! /usr/bin/python3

import os
import re
import sys
import shutil
import subprocess

from common import SRC_PATH
from common import POST_PATH
from common import TEMP_PATH
from common import TEMPLATE_PATH
from common import TEMPLATE_POST_PATH
from common import TEMPLATE_COMPONENT_PATH

from common import abs_path
from common import gen_template
from common import unique_file_list
from common import read_file_in_lines
from common import write_file

COMPILE_TEMPLATE = os.path.join(TEMP_PATH, 'compile_template.html')

START_LEVEL = 2
MAX_LEVEL = 3

TOC_ID = 'id'
TOC_TITLE = 'title'
TOC_SUB = 'sublist'


def get_mtimes(path):
    return [os.path.getmtime(os.path.join(path, f))
            for f in os.listdir(path)
            if os.path.isfile(os.path.join(path, f))]


def template_last_modify_time():
    return max(get_mtimes(TEMPLATE_PATH) + get_mtimes(TEMPLATE_COMPONENT_PATH))


def is_need_update(file):
    abs_src_path = abs_path(SRC_PATH, file)
    if not os.path.isfile(abs_src_path):
        return False

    abs_post_path = abs_path(POST_PATH, file)
    if not os.path.isfile(abs_post_path):
        return True

    if os.path.getmtime(abs_post_path) < template_last_modify_time():
        return True

    return os.path.getmtime(abs_post_path) < os.path.getmtime(abs_src_path)


def preprocess(src_file, target_file):
    contents = read_file_in_lines(src_file)
    # Insert abstract and toc
    start_pos = 0
    end_pos = 0
    for i in range(len(contents)):
        if re.match('---', contents[i]) is not None:
            start_pos = i + 1
        if re.match('## ', contents[i]) is not None and end_pos == 0:
            end_pos = i

    abstract_template = '<div class="abstract">\n{}</div>\n\n'
    abstract_content = ''.join(contents[i] for i in range(start_pos, end_pos))
    abstract = abstract_template.format(abstract_content)

    contents.insert(end_pos, '[[toc]]\n\n')
    contents.insert(end_pos, abstract)

    # Remove lines between the meta field and first abstract
    del contents[start_pos:end_pos]

    # Replace programming language mark
    contents = ''.join(contents)

    pl_template = '``` {.language-%s .line-numbers .match-braces}'
    orginal_pl_marks = set(re.findall('```.+$', contents, flags=re.MULTILINE))
    for orginal_mark in orginal_pl_marks:
        final_mark = pl_template % (re.sub(r'[` ]', '', orginal_mark).lower())
        contents = contents.replace(orginal_mark, final_mark)

    # Write the temp file
    write_file(target_file, contents)


def compile(src, target):
    command = "pandoc {} -o {} --no-highlight --template={} --mathjax"
    subprocess.run(command.format(src, target, COMPILE_TEMPLATE), shell=True)
    print("Build:" + target)


def toc2html(toc):
    toc_html = ""
    item_template = '<li><a href="#{}">{}</a>{}</li>\n'
    for item in toc:
        toc_html += \
            item_template.format(item[TOC_ID], item[TOC_TITLE], item[TOC_SUB])

    return "<ol>{}</ol>\n".format(toc_html) if toc_html != "" else ""


def part_toc(serialized_contents, start, end, level):
    if level > MAX_LEVEL or start >= end:
        return ""

    substring = serialized_contents[start:end]
    title_pattern = '<h%d *id=".*">.*</h%d>' % (level, level)
    matchs = list(re.finditer(title_pattern, substring))

    toc = []
    for i in range(0, len(matchs)):
        cur = matchs[i]
        nxt = matchs[i + 1] if i + 1 < len(matchs) else None

        sub_s = cur.end()
        sub_e = nxt.start() if nxt is not None else cur.end()

        raw_item = cur.group()
        toc_id = raw_item.split('"')[1]
        toc_title = raw_item.split('>')[1].split('<')[0]

        toc_sub = part_toc(serialized_contents, sub_s, sub_e, level + 1)

        toc_item = {TOC_ID: toc_id, TOC_TITLE: toc_title, TOC_SUB: toc_sub}
        toc.append(toc_item)

    return toc2html(toc)


def generate_toc(contents):
    serialized_contents = ''.join(contents)
    contents_length = len(serialized_contents)
    tocs = part_toc(serialized_contents, 0, contents_length, START_LEVEL)

    toc_html = '<nav role="navigation" class="toc">\n' + \
               '<h2>Contents' + \
               '<i class="material-icons icon" id="toc-control">remove</i>' + \
               '</h2>\n' + \
               '<div id="toc-items">\n' + \
               tocs + \
               '</div>\n</nav>'

    return serialized_contents.replace('<p>[[toc]]</p>', toc_html)


def postprocess(file):
    # Generate TOC
    write_file(file, generate_toc(read_file_in_lines(file)))


def process_files(operation, src_path, target_path, list):
    for file in list:
        src = abs_path(src_path, file)
        target = abs_path(target_path, file)
        operation(src, target)


def update_post():
    src_list = unique_file_list(SRC_PATH)
    post_list = unique_file_list(POST_PATH)

    non_source_posts = [f for f in post_list if src_list.count(f) == 0]
    if len(non_source_posts) > 0:
        sys.stderr.write("[WARNING] Source file missing:\n")
        sys.stderr.write('\n'.join(non_source_posts))

    need_update_list = [f for f in src_list if is_need_update(f)]

    try:
        # Create Temp path
        os.mkdir(TEMP_PATH)
        if not os.path.exists(TEMP_PATH):
            sys.stderr.write("[ERROR] Can not create temp folder.\n")
            exit(-1)

        write_file(COMPILE_TEMPLATE, gen_template(TEMPLATE_POST_PATH))

        for file in need_update_list:
            abs_src_path = abs_path(SRC_PATH, file)
            abs_temp_path = abs_path(TEMP_PATH, file)
            abs_post_path = abs_path(POST_PATH, file)
            # Generate posts
            preprocess(abs_src_path, abs_temp_path)
            compile(abs_temp_path, abs_post_path)
            postprocess(abs_post_path)
    finally:
        # Delete Temp path
        shutil.rmtree(TEMP_PATH)


if __name__ == "__main__":
    update_post()
