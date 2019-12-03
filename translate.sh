#! /usr/bin/bash
export GOOGLE_APPLICATION_CREDENTIALS=../key.json
find content/en -iname "2019-11*[^.]??.markdown" |
while read filename
do 
  node translate.js -s $filename -t hi,fr,es,ja,de,vi,ru,id,ta,te,pa,pt  \;
done

#find src/content/en/updates/2018/01/ -iname "*.md" -exec node translate.js -s '{}' -t hi,fr,es,ja,de,vi,ru,id \;
