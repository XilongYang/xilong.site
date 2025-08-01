import re
import os
from fontTools import subset

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

FONT_SOURCE = os.path.join(ROOT_PATH, "res", "SourceHanSerifCN-Regular.otf")
FONT_SUBSET_PATH = os.path.join(ROOT_PATH, "res", "SourceHanSerifCN-Subset")


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


def unique_text(path):
    search_db_lines = read_file_in_lines(path)
    search_db_text = ''.join(search_db_lines)
    return search_db_text


def gen_subset(file_name, text):
    options = subset.Options()
    options.set(layout_features='*')
    options.set(glyph_names=True)
    options.set(notdef_glyph=True)
    options.set(recalc_bounds=True)
    options.flavor = 'woff2'

    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)

    font = subset.load_font(FONT_SOURCE, options)

    font_name = os.path.splitext(file_name)[0]
    font_path = os.path.join(FONT_SUBSET_PATH, font_name + ".woff2")

    subsetter.subset(font)
    subset.save_font(font, font_path, options)
    print(font_path)
