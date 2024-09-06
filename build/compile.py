#! /usr/bin/python3

import subprocess

from common import POST_TEMPLATE

def compile(src, target):
    command = "pandoc {} -o {} --no-highlight --template={} --mathjax"
    subprocess.run(command.format(src, target, POST_TEMPLATE), shell=True)
    print("Build:" + target)
