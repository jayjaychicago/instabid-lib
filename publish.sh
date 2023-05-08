#!/bin/bash

# Read the current version from package.json
current_version=$(jq -r '.version' package.json)

# Increment the version
new_version=$(echo "$current_version" | awk -F. -v OFS=. '{$NF++;print}')

# Update the version in package.json
jq ".version = \"$new_version\"" package.json > package_temp.json && mv package_temp.json package.json

# Build the project
yarn build

# Stage and commit changes
git add .
git commit -m "bug fix"

# Publish to NPM
npm publish
