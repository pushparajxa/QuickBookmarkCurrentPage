#!/bin/bash
# Script to package the Firefox addon for publishing
# This creates a ZIP file with only the necessary files

echo "Packaging Firefox addon for publishing..."

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Using temp directory: $TEMP_DIR"

# Copy necessary files
cp manifest.json "$TEMP_DIR/"
cp background.js "$TEMP_DIR/"

# Copy icon if it exists
if [ -f "icon.png" ]; then
    cp icon.png "$TEMP_DIR/"
    echo "✓ Icon included"
else
    echo "⚠ Warning: icon.png not found (optional but recommended)"
fi

# Create ZIP file
cd "$TEMP_DIR"
zip -r ../../Firefox_addon_package.zip . -x "*.DS_Store" "*.git*"
mv ../../Firefox_addon_package.zip /Users/pushparaj/Desktop/code/Firefox_addon/
cd - > /dev/null

# Clean up
rm -rf "$TEMP_DIR"

echo "✓ Package created: Firefox_addon_package.zip"
echo ""
echo "Files included:"
unzip -l Firefox_addon_package.zip | grep -E "\.(json|js|png)$"
echo ""
echo "Ready to upload to AMO!"




