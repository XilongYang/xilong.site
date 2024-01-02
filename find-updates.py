#! /usr/bin/python3

import os
import sys

POST_PATH = './posts'

SOURCE_SUFFIX = ".md"
TARGET_SUFFIX = ".html"

def file2path(filename):
    return POST_PATH + '/' + filename

def isfile(path):
    return os.path.exists(path) and os.path.isfile(path)

file_list = list(set([file.split('.')[0] for file in os.listdir(POST_PATH)]))

need_update_list = []
non_source_list = []

for file in file_list:
    source_file = file + SOURCE_SUFFIX
    if not isfile(file2path(source_file)):
        non_source_list.append(file)
        continue

    target_file = file + TARGET_SUFFIX
    if not isfile(file2path(target_file)):
        need_update_list.append(file)
        continue

    if os.path.getmtime(file2path(source_file)) > os.path.getmtime(file2path(target_file)):
        need_update_list.append(file)

for need_update in need_update_list:
    print(need_update)

if len(non_source_list) > 0:
    sys.stderr.write("[WARNING] Some files lack a source file; fix it promptly.\n")
    for non_source in non_source_list:
        sys.stderr.write(non_source + "\n")
