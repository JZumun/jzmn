#! /bin/bash

#Using npm minifier module
minify ../src/jzmn.js -o ../dist/jzmn-basic-min.js --no-comments
minify ../src/jzmn.js ../src/dom/dom.js ../src/dom/module-*.js -o ../dist/jzmn-dom-min.js --no-comments