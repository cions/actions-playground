#!/bin/bash

set -eu

echo "::group::Print arguments"
jq -cn --args '$ARGS.positional' "$@"
echo "::endgroup::"

echo "::group::Current working directory"
pwd -P
echo "::endgroup::"

echo "::group::Print environment variables"
typeset -px
echo "::endgroup::"

echo "::group::Run findmnt"
findmnt
echo "::endgroup::"

echo "output=Docker Action output" >> "${GITHUB_OUTPUT}"
