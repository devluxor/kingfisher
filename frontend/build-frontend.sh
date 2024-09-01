#!/bin/bash

# "HISTIGNORE" means to not save this command into the history. 
# That is the history in memory or "~/.bash_history" file.
export HISTIGNORE='*sudo -S*'

echo "🏗 Building frontend..."
npm install # if new packages have been installed during development
npm audit fix
npm run build

# sudo:
# -S means to use stdin for the password,
# -k means to ignore cached credentials to force sudo to always ask. 
# This is for consistent behavior.

echo $1 | sudo -S -k rm -rf /var/www/kingfisher/html
echo "Previous build destroyed"
echo $1 | sudo -S -k mkdir /var/www/kingfisher/html
echo $1 | sudo -S -k cp -r ./dist/* /var/www/kingfisher/html/
echo "New build installed successfully and ready to be served"
echo "Restarting services..."
pm2 restart Kingfisher
echo "👋 Goodbye!"
