#!/bin/bash

set -eu

if [ -n "${INPUT_SCRIPT+set}" ]; then
	eval "${INPUT_SCRIPT}"
	exit 0
fi

echo "::group::Print Arguments"
jq -cn --args '$ARGS.positional' "$@"
echo "::endgroup::"

echo "::group::Print Environment Variables"
typeset -px
echo "::endgroup::"

echo "::set-output name=result::Output from a Docker Action"
