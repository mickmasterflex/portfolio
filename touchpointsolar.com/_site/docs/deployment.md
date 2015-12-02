#Deploy Prometheus Site on Marketing Server

1. ssh into marketing server:
  1. server: www-data@findanycollege.com
  2. password: Mhcrgw{4,K*ZO}z
2. go into sites-available directory within apache
  1. cd /etc/apache2/sites-available/
3. copy apache config file of a similar site (i.e. ambitionlending.com)
  1. cp www.ambitionlending.com www.domain.com
4. edit new config file to replace all instances of ambitionlending.com with your new domain
  1. vim www.domain.com
  2. replace ambitionlending with domain
5. now create a symlink from the config file in sites-available to sites-enabled
  1. cd ../sites-enabled/
  2. ln -s /etc/apache2/sites-available/www.domain.com .
6. run apache2ctl configtest
7. run apache2ctl restart
8. Next we will need to setup the Daedalus deployment server to auto-deploy newly configured site
9. login to Daedalus server:
  1. http://daedalus.neutronnetwork.com:8080/
  2. use your daedalus creds
10. Once in, click on New Item in the upper left corner of the site
  1. give it the name that you gave the apache config file (i.e. www.domain.com)
  2. copy existig from www.ambitionlending.com
  3. change the repository root to the repo for the new site and save.

You should now have an fully deployed Prometheus site.