#! /bin/bash
./scripts/pre_processor.py ./src/en.html > en.html
./scripts/pre_processor.py ./src/zh.html > zh.html
./scripts/pre_processor.py ./src/404.html > 404.html
ln -sf ./en.html ./index.html
