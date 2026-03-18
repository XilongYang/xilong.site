all: src/* template/*
	runghc -ibuild build/Main.hs

.PHONY : clean
clean:
	-rm posts/*
	-rm index.html
	-rm searchdb.json
	-rm res/SourceHanSerifCN-Subset.woff2

