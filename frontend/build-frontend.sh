#!/bin/bash

echo "🏗 Building frontend..."
npm install # if new packages have been installed during development
npm run build
echo $1 | sudo -S rm -rf /var/www/kingfisher/html
echo "Previous build destroyed"
sudo mkdir /var/www/kingfisher/html
sudo cp -r ./dist/* /var/www/kingfisher/html/
echo "New build installed successfully and ready to be served"
echo "Restarting services..."
pm2 restart 2
echo "👋 Goodbye!"