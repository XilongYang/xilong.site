#! /bin/python3
import sys

title=sys.argv[1]
code_ref=sys.argv[2]
play_ref=sys.argv[3]

bid=title+"_bid"
iid=title+"_iid"

print('<div class="works_item">')
print('<div class="item_header">')
print('<div class="item_buttons">')
print('<div class="item_button item_chevron">')
print('<button id="{}" onclick="switchDisplay(\'{}\', \'{}\')">'.format(bid, bid, iid))
print('<i class="fa fa-chevron-up"></i>');
print('</button>')
print('</div>')
print('<div class="item_button"><a href="{}"><i class="fa fa-code"></i></a></div>'.format(code_ref))
print('<div class="item_button"><a href="{}"><i class="fa fa-play"></i></a></div>'.format(play_ref))
print('</div>')
print('<div class="item_title">')
print('<p><b>{}</b></p>'.format(title))
print('<p>describe</p>')
print('</div>')
print('</div>')
print('<div class="item_intro" id="{}">'.format(iid))
print('<p>intro</p>')
print('</div>')
print('</div>')

