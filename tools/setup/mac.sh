#!/bin/sh

# This script sets up the local development for Max OSX environments.
# You should be able to run this script as many times as you want.

# Check if Homebrew (https://brew.sh/) is installed
## https://github.com/mxcl/homebrew/wiki/installation
which -s brew
if [[ $? != 0 ]] ; then
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  brew update
fi

# install non-npm dependencies
brew install git node bash-completion 
brew upgrade

# install nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

# for auto switching nvm when switching folders
npm install -g avn avn-nvm
avn setup
