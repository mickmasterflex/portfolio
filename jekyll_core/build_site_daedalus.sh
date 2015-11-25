#!/bin/bash

echo "  -update site from jekyll_core"
./core_update_daedalus.sh

echo "  -compile sass"
sass --update _scss/:css/ --style compact

echo "  -run Jekyll build"
jekyll build