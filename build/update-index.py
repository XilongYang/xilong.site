#! /usr/bin/python3

import os
import sys
import subprocess

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POST_PATH = ROOT_PATH + '/posts'
TEMPLATE = ROOT_PATH + '/template/post.html'

SOURCE_SUFFIX = ".md"
TARGET_SUFFIX = ".html"

COMPILE_COMMAND = "pandoc {} -o {} --no-highlight --template={} --mathjax"

def file2path(filename, suffix):
    return POST_PATH + '/' + filename.rstrip('\n') + suffix

for file in sys.stdin:
    source_path = file2path(file, SOURCE_SUFFIX)
    target_path = file2path(file, TARGET_SUFFIX)
    subprocess.run(COMPILE_COMMAND.format(source_path, target_path, TEMPLATE), shell=True)
    print("Build:" + file)
