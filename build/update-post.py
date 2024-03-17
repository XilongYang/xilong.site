#! /usr/bin/python3

import os
import sys
import subprocess
import re
import shutil

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_PATH  = ROOT_PATH + '/src'
POST_PATH = ROOT_PATH + '/posts'
POST_TEMPLATE  = ROOT_PATH + '/template/post.html'
TEMP_PATH = ROOT_PATH + '/temp'

SOURCE_SUFFIX = ".md"
TARGET_SUFFIX = ".html"

COMPILE_COMMAND = "pandoc {} -o {} --no-highlight --template={} --mathjax"

TOC_TEMPLATE = '''
<nav role="navigation" class="toc">
    <h2>Contents</h2>
    <ol>
        $$items$$
    </ol>
</nav>
'''

TOC_ITEM_TEMPLATE = '<li><a href="$$link$$">$$title$$</a></li>\n'

def PL_OPTIONS(language):
    PL_OPTIONS_TEMPLATE = '{.language-$$language$$ .line-numbers .match-braces}'
    return '``` ' + PL_OPTIONS_TEMPLATE.replace('$$language$$', language[3:])

def src2path(filename):
    return SRC_PATH + '/' + filename + SOURCE_SUFFIX

def temp2path(filename):
    return TEMP_PATH + '/' + filename + SOURCE_SUFFIX

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

def preprocessing(file):
    contents = ''
    with open(src2path(file), 'r') as src:
        # Generate toc
        contents = src.read()
        titles = [x.split(' ', 1)[1] for x in re.findall('^## .*$', contents, flags=re.MULTILINE)]
        toc_items = [TOC_ITEM_TEMPLATE.replace('$$link$$', '#'+x.replace(' ','-').lower()).replace('$$title$$', x) for x in titles]
        toc = TOC_TEMPLATE.replace('$$items$$', ''.join(toc_items)) if len(toc_items) != 0 else ''
        contents = contents.replace('$$toc$$', toc)

        # Replace programming language options
        pl_options = set(re.findall('^```.+$', contents, flags=re.MULTILINE))
        for option in pl_options:
            contents = contents.replace(option, PL_OPTIONS(option))

    # Write the temp file
    with open(temp2path(file), 'w') as temp:
        temp.write(contents)



src_list  = list(set([file.split('.')[0] for file in os.listdir(SRC_PATH)]))
post_list = list(set([file.split('.')[0] for file in os.listdir(POST_PATH)]))

non_source_list  = [post for post in post_list if src_list.count(post) == 0]
if len(non_source_list) > 0:
    sys.stderr.write("[WARNING] Some files lack a source file; fix it in time.\n")
    for non_source in non_source_list:
        sys.stderr.write(non_source + "\n")

need_update_list = [file for file in src_list if not is_file(post2path(file)) or outdate(src2path(file), post2path(file))]
try:
    # Create Temp path
    os.mkdir(TEMP_PATH)
    if not os.path.exists(TEMP_PATH):
        sys.stderr.write("[ERROR] Can not create temp folder.\n")
        exit(-1)

    # Compile posts
    for file in need_update_list:
        preprocessing(file)
        subprocess.run(COMPILE_COMMAND.format(temp2path(file), post2path(file), POST_TEMPLATE), shell=True)
        print("Build:" + file)
finally:
    # Delete Temp path
    shutil.rmtree(TEMP_PATH)
