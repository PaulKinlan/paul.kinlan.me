export GOOGLE_APPLICATION_CREDENTIALS=../key.json
find content/ -iname 2018-10-11*[^.]??.markdown -exec node translate.js -s '{}' -t hi,fr,es,ja,de,ta,vi,ru,id \;
