HUGO_VERSION=0.18.1

set -x
set -e

# Install Hugo if not already cached or upgrade an old version.
if [ ! -e /tmp/bin/hugo ] || ! [[ `hugo version` =~ v${HUGO_VERSION} ]]; then
  wget https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz /tmp
  tar xvzf /tmp/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz
  cp /tmp/hugo_${HUGO_VERSION}_linux_amd64/hugo_${HUGO_VERSION}_linux_amd64 ./hugo
fi