all: src/* template/*
	runghc -ibuilder builder/Main.hs

.PHONY : test clean
test:
	runghc -ibuilder -i. builder/UT/RunTest.hs

clean:
	-rm post/*
	-rm index.html
	-rm searchdb.json
	-rm res/fonts/SourceHanSerifCN-Subset.woff2
