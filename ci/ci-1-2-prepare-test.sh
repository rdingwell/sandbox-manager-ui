#!/usr/bin/env bash

echo "Setting up the ENV"
printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
apt-get update

echo "Installing needed libs"
apt-get install -y wget xvfb

echo "Fetching chrome"
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

set +e;
echo "Installing chrome"
dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
ser -e;

echo "Chrome check:"
google-chrome --version

#Xvfb :99 -ac &
#Xvfb :0 -ac -screen 0 1024x768x24 &
Xvfb :99 -screen 0 1280x1024x24 &
echo "Xvfb started"
