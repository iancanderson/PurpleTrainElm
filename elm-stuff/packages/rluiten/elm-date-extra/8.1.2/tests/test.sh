#!/usr/bin/env bash

cd "$(dirname "$0")"
set -e

elm-make --yes --output program.js TestRunner.elm
node program.js
