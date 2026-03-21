all: src/* template/*
	runghc -ibuild build/Main.hs

.PHONY : test clean
test:
	runghc -ibuild -i. build/UT/RunTest.hs

clean:
	-rm posts/*
	-rm index.html
	-rm searchdb.json
	-rm res/SourceHanSerifCN-Subset.woff2
