#!/usr/bin/env bash
echo "[INFO] Installing NVM..."
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source ~/.bashrc
nvm install --lts==carbon
nvm alias default lts/carbon
npm install

