#!/bin/bash

echo "Updating jekyll_core"
git -C ../jekyll_core/ pull

echo "Updating current site with jekyll_core"
echo "  -removing and copying _includes"
rm -rf ./_includes/
cp -r ../jekyll_core/_includes .

echo "  -removing and copying _layouts"
rm -rf ./_layouts/
cp -r ../jekyll_core/_layouts .

echo "  -removing and copying _scss_include"
rm -rf ./_scss_include/
cp -r ../jekyll_core/_scss_include .

echo "  -moving pertinent scss files/directories from _scss_include into _scss (for ease of sass compilation)"
rm -rf ./_scss/core/
cp -r ./_scss_include/core ./_scss/
rm -rf ./_scss/vendor/
cp -r ./_scss_include/vendor ./_scss/
rm -rf ./_scss/style.scss
cp -r ./_scss_include/style.scss ./_scss/

echo "  -removing and copying core"
rm -rf ./core/
cp -r ../jekyll_core/core .

echo "  -removing and copying examples"
rm -rf ./examples/
cp -r ../jekyll_core/examples .

