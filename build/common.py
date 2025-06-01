import os
import re

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_PATH = ROOT_PATH + '/src'
POST_PATH = ROOT_PATH + '/posts'
TEMP_PATH = ROOT_PATH + '/temp'
INDEX_PATH = ROOT_PATH + '/index.html'
SEARCHDB_PATH = ROOT_PATH + '/searchdb.json'
WEB_ROOT_PATH = ''
WEB_POST_PATH= WEB_ROOT_PATH + '/posts'
TEMPLATE_PATH = ROOT_PATH + '/template'
TEMPLATE_COMPONENT_PATH = TEMPLATE_PATH + '/component'
TEMPLATE_COMPONENT_PATTERN = '<!--<.*>-->'

def src_path(file_name):
    return SRC_PATH + '/' + file_name.rstrip('\n') + '.md'

def temp_path(name):
    return '{}/{}.md'.format(TEMP_PATH, name)

def post_path(name):
    return '{}/{}.html'.format(POST_PATH, name)

def read_file(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()

def write_file(file_path, contents):
    with open(file_path, 'w') as file:
        file.write(contents)

def post2link(file_name):
    return WEB_POST_PATH+ '/' + file_name.rstrip('\n') + '.html'

def parse_meta(src):
    result = {}
    parse_on = False
    contents = read_file(src)
    for line in contents:
        clear_line = line.replace('\n', '')
        if clear_line == '---':
            parse_on = not parse_on
        elif parse_on:
            parse = clear_line.split(':', 1)
            result[parse[0].replace(' ','')] = parse[1]
    return result

def gen_template(path):
    template = read_file(path)
    result = ''
    for line in template:
        line = line.strip()
        if re.match(TEMPLATE_COMPONENT_PATTERN, line):
            component_name = line.replace('<!--<', '').replace('>-->', '')
            component_file = TEMPLATE_COMPONENT_PATH + '/' + component_name + '.html'
            line = ''.join(read_file(component_file))
        result += line + '\n'
    return result

def gen_index_template():
    return gen_template(TEMPLATE_PATH + '/index.html')

def gen_post_template():
    return gen_template(TEMPLATE_PATH + '/post.html')

def template_last_modify_time():
    get_mtimes = lambda path : [os.path.getmtime(path + '/' + f) for f in os.listdir(path) if os.path.isfile(path + '/' + f)]
    return max(get_mtimes(TEMPLATE_PATH) + get_mtimes(TEMPLATE_COMPONENT_PATH))
