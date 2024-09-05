#! /usr/bin/python3

import re

from common import read_file
from common import write_file

def preprocess(src_file, target_file):
    # Replace programming language options
    contents = ''.join(read_file(src_file))
    
    pl_template = '``` {.language-%s .line-numbers .match-braces}'
    pl_options = set(re.findall('```.+$', contents, flags=re.MULTILINE))
    for option in pl_options:
        correct_pl_option = pl_template % (re.sub(r'[` ]', '', option).lower())
        contents = contents.replace(option, correct_pl_option)

    # Write the temp file
    write_file(target_file, contents)
