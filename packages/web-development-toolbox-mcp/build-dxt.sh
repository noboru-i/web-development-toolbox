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
cp -r dist "$TMP_DIR/"
cp manifest.json "$TMP_DIR/"
cp -r ../../assets/ "$TMP_DIR/"

# Create a modified package.json without any scripts to avoid build issues during install
cat package.json | jq '. | del(.scripts) | del(.devDependencies)' > "$TMP_DIR/package.json"

# Install production dependencies in the temp directory
cd "$TMP_DIR"
echo "Installing production dependencies..."
npm install --silent 2>/dev/null || npm install

VERSION=$(cat package.json | jq -r '.version')
DXT_NAME="web-development-toolbox-mcp-$VERSION.dxt"

# Create the DXT file using dxt pack command
echo "Creating DXT package..."
npx @anthropic-ai/dxt pack . "$DXT_NAME"

# Find the created DXT file and move it to the original directory
DXT_FILE=$(find . -name "*.dxt" -type f | head -n 1)
if [ -n "$DXT_FILE" ]; then
    echo "DXT file created: $DXT_FILE"
    ls -la "$DXT_FILE"
    mv "$DXT_FILE" "$ORIGINAL_DIR/"
else
    echo "Error: No DXT file was created"
    exit 1
fi

# Clean up
cd "$ORIGINAL_DIR"
rm -rf "$TMP_DIR"

echo "DXT package created successfully!"
ls -la *.dxt