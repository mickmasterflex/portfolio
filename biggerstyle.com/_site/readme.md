# Jekyll Core

Here we have the default Jekyll site deployment. From this project you should be able to build Jekyll locally and have a fully featured site complete with Prometheus/Proton/Atlas/Cake/Valkyrie functionality.

## Site Deployment Scripts

### init_site.sh

`init_site.sh` is run on each individual site deployment. To run the script you first need to navigate to your Sites directory. From there you create a new site root directory and run the command within said new directory. Below are the commands to do so:

```
mkdir new_vertical
cd new_vertical/
../jekyll_core/init_site.sh
```

What this script does is it copies the `jekyll_core` base Jekyll repository, initializes a new git project, creates a new .gitignore file (to ignore certain directories from git commands), and then commits all of the newly copied over files from `jekyll_core` into the new site git.

### core_update.sh

`core_update.sh` is run from within the new site root directory. This script lives on each new site repository. From your Terminal, run these commands to run the script:

```
./core_update.sh
```

What this script does is it first pulls down all new changes made to the `jekyll_core` repository and then updates all of the core directories from `jekyll_core` (_includes, _layouts, _scss_include, core and examples) that have now been copied over into the new site.