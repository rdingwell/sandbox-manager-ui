#!/usr/bin/env bash

echo "Setting up the ENV"
printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
apt-get update

echo "Installing needed libs"
apt-get install -y wget fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libatspi2.0-0 libcups2 libdbus-1-3 libgtk-3-0 #xvfb

echo "Fetching chrome"
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

echo "Installing chrome"
dpkg -i google-chrome-stable_current_amd64.deb

echo "Chrome check:"
google-chrome --version
