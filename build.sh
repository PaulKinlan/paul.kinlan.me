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

sh install-hugo.sh

echo "Building site"
./hugo -D
exit_on_error $?