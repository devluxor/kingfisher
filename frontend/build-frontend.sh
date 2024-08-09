#!/bin/bash

echo "🏗 Building frontend..."
npm install # if new packages have been installed during development
npm run build
echo $1 | sudo -S rm -rf /var/www/kingfisher/html
echo "Previous build destroyed"
echo $1 | sudo -S mkdir /var/www/kingfisher/html
echo $1 | sudo -S cp -r ./dist/* /var/www/kingfisher/html/
echo "New build installed successfully and ready to be served"
echo "👋 Goodbye!"