#!/bin/bash

echo "🏗 Building frontend..."
npm run build
echo $1 | sudo -S rm -rf /var/www/kingfisher/html
echo $1 | sudo -S mkdir /var/www/kingfisher/html
echo $1 | sudo -S cp -r ./dist/* /var/www/kingfisher/html/
echo "👋 Goodbye!"