#!/bin/bash

# Read the current version from package.json
current_version=$(grep -oP '(?<="version": ")[^"]+' package.json)

# Increment the version
new_version=$(echo "$current_version" | awk -F. -v OFS=. '{$NF++;print}')

# Update the version in package.json
sed -i "s/$current_version/$new_version/g" package.json

# Build the project
yarn build

# Stage and commit changes
git add .
git commit -m "bug fix"

# Publish to NPM
npm publish
