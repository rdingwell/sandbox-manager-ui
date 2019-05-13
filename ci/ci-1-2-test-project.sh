#!/usr/bin/env bash

echo "Setting up the ENV"
printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
apt-get update

echo "Installing wget"
apt-get install -y wget #xvfb

echo "Fetching chrome"
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

echo "Installing chrome"
dpkg -i google-chrome-stable_current_amd64.deb

echo "Chrome check:"
google-chrome --version
