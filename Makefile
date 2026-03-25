.PHONY : all test clean

all: 
	runghc -ibuilder builder/Main.hs

test:
	runghc -ibuilder -i. builder/UT/RunTest.hs

clean:
	rm -rf post
	rm -f index.html
	rm -f searchdb.json
	rm -f res/fonts/SourceHanSerifCN-Subset.woff2
