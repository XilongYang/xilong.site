#! /usr/bin/python3

import os
import sys
import shutil

from common import SRC_PATH
from common import POST_PATH
from common import TEMP_PATH
from common import src_path
from common import temp_path
from common import post_path
from common import POST_TEMPLATE

from preprocess import preprocess
from compile import compile
from postprocess import postprocess

def process_files(operation, src_path, target_path, list):
    for file in [{'src': src_path(f), 'target': target_path(f)} for f in list]:
        operation(file['src'], file['target'])

def update_post():
    src_list  = list(set([file.split('.')[0] for file in os.listdir(SRC_PATH)]))
    post_list = list(set([file.split('.')[0] for file in os.listdir(POST_PATH)]))

    non_source_list  = [post for post in post_list if src_list.count(post) == 0]
    if len(non_source_list) > 0:
        sys.stderr.write("[WARNING] Source file missing:\n")
        sys.stderr.write('\n'.join(non_source_list))

    is_file = lambda path : os.path.exists(path) and os.path.isfile(path)
    is_changed_after = lambda path1, path2 : os.path.getmtime(path1) > os.path.getmtime(path2)
    need_update = lambda src, post : (not is_file(post)) or (is_file(src) and is_changed_after(src, post)) or is_changed_after(POST_TEMPLATE, post)
    need_update_list = [f for f in src_list if need_update(src_path(f), post_path(f))]

    try:
        # Create Temp path
        os.mkdir(TEMP_PATH)
        if not os.path.exists(TEMP_PATH):
            sys.stderr.write("[ERROR] Can not create temp folder.\n")
            exit(-1)

        # Preprocess sources
        process_files(preprocess, src_path, temp_path, need_update_list)

        # Compile posts
        process_files(compile, temp_path, post_path, need_update_list)

        # Postprocess posts
        process_files(postprocess, post_path, post_path, need_update_list)

    finally:
        # Delete Temp path
        shutil.rmtree(TEMP_PATH)

if __name__ == "__main__":
    update_post()
