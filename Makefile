all: src/* template/*
	build/update_post.py
	build/update_index.py
	build/generate_searchdb.py
	./format.sh

.PHONY : clean
clean:
	-rm posts/*
	-rm index.html
	-rm searchdb.json

