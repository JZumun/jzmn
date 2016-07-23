#! /bin/bash

#Using npm minifier module. Run from ../
minify src/jzmn.js -o dist/jzmn.basic.min.js --no-comments
minify src/jzmn.js src/dom/dom.js src/dom/module-*.js -o dist/jzmn.dom.min.js --no-comments
minify src/dom/module-createEl.js -o dist/jzmn.createEl.min.js --no-comments
minify src/dom/module-ajax.js -o dist/jzmn.ajax.min.js --no-comments