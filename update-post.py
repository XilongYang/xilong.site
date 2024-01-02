#! /usr/bin/python3

import sys
import subprocess

POST_PATH = './posts'
TEMPLATE = './template/post.html'

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
