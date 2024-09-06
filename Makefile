all: src/*
	build/refresh.py

.PHONY : clean
clean:
	-rm posts/*