#! /bin/bash

exit_on_error() {
    exit_code=$1
    last_command=${@:2}
    if [ $exit_code -ne 0 ]; then
        >&2 echo "\"${last_command}\" command failed with exit code ${exit_code}."
        exit $exit_code
    fi
}

echo "Updating Podroll"
PODOUTPUT=$(cat ./content/en/2019-10-20-podroll.markdown)
(echo "$PODOUTPUT" & node podroll.js https://player.fm/pkinlan/fm.opml) > ./content/en/2019-10-20-podroll.markdown

echo "Building site"
hugo -D
exit_on_error $?

# echo "Sending mentions"
# npx webmention public/index.xml --limit 1 --send
