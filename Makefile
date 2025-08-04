all: src/* template/*
	build/update_post.py
	build/update_index.py
	build/generate_searchdb.py
	build/generate_subset_font.py
	./format.sh

.PHONY : clean
clean:
	-rm posts/*
	-rm index.html
	-rm searchdb.json
	-rm res/SourceHanSerifCN-Subset.woff2

