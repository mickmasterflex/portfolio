#!/bin/bash

echo "Updating jekyll_core"
git -C ../jekyll_core/ pull

cp -r ../jekyll_core/* .
git init
rm .gitignore

echo "Creating new .gitignore file with requirements for new site"
touch .gitignore
echo ".sass-cache" >> .gitignore
echo ".idea" >> .gitignore
echo "_site" >> .gitignore
echo "_includes" >> .gitignore
echo "_layouts" >> .gitignore
echo "_scss_include" >> .gitignore
echo "examples" >> .gitignore
echo "core" >> .gitignore
echo "vendor" >> .gitignore
echo "init_site.sh" >> .gitignore
echo "core_update.sh" >> .gitignore
git add -A
git commit -m 'initial project commit from jekyll_core init_site.sh'
