.PHONY : all test test-ut perf-data test-perf clean

all: 
	runghc -ibuilder builder/Main.hs

test:
	$(MAKE) test-ut

test-ut:
	runghc -ibuilder -i. builder/Test/UT/RunTest.hs

perf-data:
	sh builder/Test/PT/scripts/prepare-perf-data.sh

test-perf: perf-data
	UT_ENABLE_PERF=1 runghc -ibuilder -i. builder/Test/PT/RunPerf.hs

clean:
	rm -rf post
	rm -f index.html
	rm -f searchdb.json
	rm -f res/fonts/SourceHanSerifCN-Subset.woff2
