#! /bin/bash

exit_on_error() {
    exit_code=$1
    last_command=${@:2}
    if [ $exit_code -ne 0 ]; then
        >&2 echo "\"${last_command}\" command failed with exit code ${exit_code}."
        exit $exit_code
    fi
}

yum install -y wget

npm install

sh install-hugo.sh

cp -r node_modules/comlink static/javascripts/
cp -r node_modules/pinch-zoom-element/dist static/javascripts/pinch-zoom-element

mkdir data/
echo "Fetching Web Mentions"
node process-mentions.js "https://webmention.io/api/mentions.jf2?per-page=100&domain=paul.kinlan.me&token=$WEBMENTION"

echo "Updating Podroll"
PODOUTPUT=$(cat ./content/en/2019-10-20-podroll.markdown)
(echo "$PODOUTPUT" & node podroll.js https://player.fm/pkinlan/fm.opml) > ./content/en/2019-10-20-podroll.markdown

echo "Building site"
./hugo -d dist
exit_on_error $?

npx rollup -c rollup.config.js

echo "Sending mentions"
npx webmention dist/index.xml --limit 1 --send
