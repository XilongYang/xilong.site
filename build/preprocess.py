#! /usr/bin/python3

import re

from common import read_file
from common import write_file

def preprocess(src_file, target_file):
    contents = read_file(src_file)
    # Insert abstract and toc
    start_pos = [i for i in range(len(contents)) if re.match('---', contents[i]) != None][1] + 1
    end_pos = [i for i in range(len(contents)) if re.match('## ', contents[i]) != None][0]
    abstract_template = '<div class="abstract">\n{}</div>\n\n'
    abstract = abstract_template.format(''.join([contents[i] for i in range(start_pos, end_pos)]))
    contents.insert(end_pos, '[[toc]]\n\n')
    contents.insert(end_pos, abstract)
    del contents[start_pos:end_pos]

    # Replace programming language options
    contents = ''.join(contents)

    pl_template = '``` {.language-%s .line-numbers .match-braces}'
    pl_options = set(re.findall('```.+$', contents, flags=re.MULTILINE))
    for option in pl_options:
        correct_pl_option = pl_template % (re.sub(r'[` ]', '', option).lower())
        contents = contents.replace(option, correct_pl_option)

    # Write the temp file
    write_file(target_file, contents)
