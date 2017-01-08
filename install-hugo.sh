HUGO_VERSION=0.18.1

set -x
set -e

# Install Hugo if not already cached or upgrade an old version.
if [ ! -e .hugo ] || ! [[ `hugo version` =~ v${HUGO_VERSION} ]]; then
  wget https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -P .hugo/
  tar xvzf .hugo/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -C .hugo/
  cp .hugo/hugo_${HUGO_VERSION}_linux_amd64/hugo_${HUGO_VERSION}_linux_amd64 ./hugo
fi