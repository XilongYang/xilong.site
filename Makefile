all: src/* template/*
	runghc -ibuilder builder/Main.hs

.PHONY : test clean
test:
	runghc -ibuilder -i. builder/UT/RunTest.hs

clean:
	-rm posts/*
	-rm index.html
	-rm searchdb.json
	-rm res/SourceHanSerifCN-Subset.woff2
