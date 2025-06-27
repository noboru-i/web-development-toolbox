#!/bin/bash

# Build script for creating DXT package
set -e

echo "Building Web Development Toolbox DXT..."

# Store original directory
ORIGINAL_DIR="$(pwd)"

# Clean and build
echo "Building TypeScript..."
npm run build

# Create temporary directory for DXT package
TMP_DIR="$(mktemp -d)"
echo "Creating package in: $TMP_DIR"

# Copy necessary files
cp -r dist/ "$TMP_DIR/"
cp manifest.json "$TMP_DIR/"
cp -r ../../assets/ "$TMP_DIR/"

# Create a modified package.json without any scripts to avoid build issues during install
cat package.json | jq '. | del(.scripts) | del(.devDependencies)' > "$TMP_DIR/package.json"

# Install production dependencies in the temp directory
cd "$TMP_DIR"
echo "Installing production dependencies..."
npm install --silent 2>/dev/null || npm install

# Create the DXT file manually using zip
echo "Creating DXT package..."
DXT_NAME="web-development-toolbox-mcp-0.4.7.dxt"
zip -r "$DXT_NAME" . >/dev/null

echo "DXT file created in: $(pwd)/$DXT_NAME"
ls -la "$DXT_NAME"

# Move the DXT file back to the original directory
mv "$DXT_NAME" "$ORIGINAL_DIR/"

# Clean up
cd "$ORIGINAL_DIR"
rm -rf "$TMP_DIR"

echo "DXT package created successfully!"
ls -la *.dxt