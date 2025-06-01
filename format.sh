#! /bin/bash

for file in $(find . -type f -not -path '*/.*' -not -path '*/res/*' -not -path '*__pycache__*'); do
    sed -i -E 's/\s+$//' $file
done