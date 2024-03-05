#! /usr/bin/python3

import os
import sys
import subprocess

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_PATH  = ROOT_PATH + '/src'
POST_PATH = ROOT_PATH + '/posts'
TEMPLATE  = ROOT_PATH + '/template/post.html'

SOURCE_SUFFIX = ".md"
TARGET_SUFFIX = ".html"

COMPILE_COMMAND = "pandoc {} -o {} --no-highlight --template={} --mathjax"

def src2path(filename):
    return SRC_PATH + '/' + filename + SOURCE_SUFFIX

def post2path(filename):
    return POST_PATH + '/' + filename + TARGET_SUFFIX

def is_file(path):
    return os.path.exists(path) and os.path.isfile(path)

def outdate(src, post):
    if not is_file(src):
        return False
    if not is_file(post):
        return True
    return os.path.getmtime(src) > os.path.getmtime(post)

src_list  = list(set([file.split('.')[0] for file in os.listdir(SRC_PATH)]))
post_list = list(set([file.split('.')[0] for file in os.listdir(POST_PATH)]))

non_source_list  = [post for post in post_list if src_list.count(post) == 0]
if len(non_source_list) > 0:
    sys.stderr.write("[WARNING] Some files lack a source file; fix it in time.\n")
    for non_source in non_source_list:
        sys.stderr.write(non_source + "\n")

need_update_list = [file for file in src_list if not is_file(post2path(file)) or outdate(src2path(file), post2path(file))]

for file in need_update_list:
    subprocess.run(COMPILE_COMMAND.format(src2path(file), post2path(file), TEMPLATE), shell=True)
    print("Build:" + file)
