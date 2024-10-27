import os

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_PATH = ROOT_PATH + '/src'
POST_PATH = ROOT_PATH + '/posts'
TEMP_PATH = ROOT_PATH + '/temp'
INDEX_PATH = ROOT_PATH + '/index.html'
SEARCHDB_PATH = ROOT_PATH + '/searchdb.json'
WEB_ROOT_PATH = ''
WEB_POST_PATH= WEB_ROOT_PATH + '/posts'
INDEX_TEMPLATE = ROOT_PATH + '/template/index.html'
POST_TEMPLATE  = ROOT_PATH + '/template/post.html'

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
