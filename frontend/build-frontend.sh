#!/bin/bash

echo "Building frontend..."
npm run build
# echo $1 | sudo -S rm -rf /var/www/kingfisher/html
# echo $1 | mkdir /var/www/kingfisher/html
# echo $1 | cp -r ./dist/* /var/www/kingfisher/html/
echo "Goodbye!"