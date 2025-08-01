#! /bin/bash

for file in $(find . -type f -not -path '*/.*' -not -path '*/res/*' -not -path '*__pycache__*'); do
    if grep -qE '\s+$' $file  ; then
        sed -i -E 's/\s+$//' $file
    fi
done
