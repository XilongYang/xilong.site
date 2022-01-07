#! /bin/python3
import sys
import re
import os

rflag = re.compile('\s*<!--\s*#include\s*".*"\s*-->\s*')
rpath = re.compile('".*"')

def process(fileName):
    filepath = os.path.abspath(fileName)
    workpath = os.path.dirname(filepath)
    os.chdir(workpath)
    file = open(filepath, mode='rt')
    cur = file.readline()
    while cur != "" :
        print(cur,end="")
        if rflag.fullmatch(cur):
            process(rpath.search(cur)[0].split('"')[1])
            os.chdir(workpath)
        cur = file.readline()
    file.close()

if __name__ == "__main__":
    process(sys.argv[1])