#!/usr/bin/env bash

echo "Setting up the ENV"
printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
apt-get update

echo "Installing xvfb..."
apt-get install -y wget xvfb

echo "Creating FF folder"
mkdir $FIREFOX_DIR

echo "Fetching ff"
wget -q --continue --output-document $FIREFOX_FILENAME "https://ftp.mozilla.org/pub/firefox/releases/${FIREFOX_VERSION}/linux-x86_64/en-US/firefox-${FIREFOX_VERSION}.tar.bz2"
tar -xaf "$FIREFOX_FILENAME" --strip-components=1 --directory "$FIREFOX_DIR"

echo "Add ff to the path"
export PATH=$FIREFOX_DIR:$PATH

echo "FF check:"
firefox -v
