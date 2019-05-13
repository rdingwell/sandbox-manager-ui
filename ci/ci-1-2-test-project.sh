#!/usr/bin/env bash

echo "Setting up the ENV"
printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
apt-get update
apt-cache search firefox
echo "Installing xvfb..."
#apt-get install -y xvfb

echo "Creating FF folder"
#mkdir $FIREFOX_DIR

echo "Installing FF"
#apt-get install firefox

echo "FF check:"
#firefox -v
