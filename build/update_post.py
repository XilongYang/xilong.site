#! /usr/bin/python3

import os
import sys
import shutil
import subprocess

from common import SRC_PATH
from common import POST_PATH
from common import TEMP_PATH
from common import src_path
from common import temp_path
from common import post_path
from common import gen_post_template
from common import write_file
from common import template_last_modify_time

from preprocess import preprocess
from postprocess import postprocess

POST_TEMPLATE_PATH = TEMP_PATH + '/' + 'post_template.html'

def compile(src, target):
    command = "pandoc {} -o {} --no-highlight --template={} --mathjax"
    subprocess.run(command.format(src, target, POST_TEMPLATE_PATH), shell=True)
    print("Build:" + target)

def process_files(operation, src_path, target_path, list):
    for file in [{'src': src_path(f), 'target': target_path(f)} for f in list]:
        operation(file['src'], file['target'])

# refactor todo
def gen_need_update_list(src_list):
    is_file = lambda path : os.path.exists(path) and os.path.isfile(path)
    is_template_changed = lambda file : os.path.getmtime(file) < template_last_modify_time()
    is_dependency_changed = lambda file, denpendency : os.path.getmtime(file) < os.path.getmtime(denpendency)

    need_update = lambda src, post \
        : (not is_file(post)) or is_template_changed(post) \
        or (is_file(src) and is_dependency_changed(post, src)) \


    return [f for f in src_list if need_update(src_path(f), post_path(f))];

def update_post():
    src_list  = list(set([file.split('.')[0] for file in os.listdir(SRC_PATH)]))
    post_list = list(set([file.split('.')[0] for file in os.listdir(POST_PATH)]))

    non_source_list  = [post for post in post_list if src_list.count(post) == 0]
    if len(non_source_list) > 0:
        sys.stderr.write("[WARNING] Source file missing:\n")
        sys.stderr.write('\n'.join(non_source_list))

    need_update_list = gen_need_update_list(src_list)

    try:
        # Create Temp path
        os.mkdir(TEMP_PATH)
        if not os.path.exists(TEMP_PATH):
            sys.stderr.write("[ERROR] Can not create temp folder.\n")
            exit(-1)

        write_file(POST_TEMPLATE_PATH, gen_post_template())

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
