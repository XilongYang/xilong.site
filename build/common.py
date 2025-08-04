import re
import os

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_PATH = os.path.join(ROOT_PATH, 'src')
POST_PATH = os.path.join(ROOT_PATH, 'posts')
TEMP_PATH = os.path.join(ROOT_PATH, 'temp')
INDEX_PATH = os.path.join(ROOT_PATH, 'index.html')
SEARCHDB_PATH = os.path.join(ROOT_PATH, 'searchdb.json')

WEB_ROOT_PATH = ''
WEB_POST_PATH = os.path.join(WEB_ROOT_PATH, 'posts')

TEMPLATE_PATH = os.path.join(ROOT_PATH, 'template')
TEMPLATE_INDEX_PATH = os.path.join(TEMPLATE_PATH, 'index.html')
TEMPLATE_POST_PATH = os.path.join(TEMPLATE_PATH, 'post.html')
TEMPLATE_COMPONENT_PATH = os.path.join(TEMPLATE_PATH, 'component')
TEMPLATE_COMPONENT_PATTERN = '<!--<.*>-->'


def abs_path(path, name):
    isHtml = path in [POST_PATH, WEB_POST_PATH, TEMPLATE_COMPONENT_PATH]
    ext = '.html' if isHtml else '.md'
    return os.path.join(path, name + ext)


def read_file_in_lines(abs_path):
    with open(abs_path, 'r') as file:
        return file.readlines()


def write_file(abs_path, contents):
    with open(abs_path, 'w') as file:
        file.write(contents)


def parse_meta(abs_src_path):
    result = {}
    lines = read_file_in_lines(abs_src_path)

    is_parsing = False
    for line in lines:
        clear_line = line.replace('\n', '')
        if clear_line == '---':
            is_parsing = not is_parsing
        elif is_parsing:
            kv_pair = clear_line.split(':', 1)
            key = kv_pair[0].strip()
            val = kv_pair[1].strip()
            result[key] = val
    return result


def gen_template(path):
    template = read_file_in_lines(path)
    result = ''
    for line in template:
        line = line.strip()
        if re.match(TEMPLATE_COMPONENT_PATTERN, line):
            component_name = line.replace('<!--<', '').replace('>-->', '')
            component_file = abs_path(TEMPLATE_COMPONENT_PATH, component_name)
            line = ''.join(read_file_in_lines(component_file))
        result += line + '\n'
    return result


def unique_file_list(path):
    return list(set([os.path.splitext(f)[0] for f in os.listdir(path)]))
