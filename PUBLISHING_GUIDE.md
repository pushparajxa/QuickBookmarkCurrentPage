# Publishing Guide for Firefox Addon

This guide will help you publish your "Bookmark Current Page Here" addon to the Firefox Add-ons store (AMO - addons.mozilla.org).

## Prerequisites

1. **Firefox Account**: You need a Firefox Account to submit addons
   - Sign up at: https://accounts.firefox.com/signup
   - Or use existing account

2. **Prepare Your Addon**:
   - Make sure all files are ready
   - Test thoroughly
   - Remove any debug/test files

## Step 1: Prepare the Extension Package

1. **Create a ZIP file** containing only the necessary files:
   ```
   - manifest.json
   - background.js
   - icon.png (if you have one)
   ```

2. **Do NOT include**:
   - README.md
   - DEBUG_INSTRUCTIONS.md
   - PUBLISHING_GUIDE.md
   - test-api.js
   - ICON_NOTE.txt
   - Any other documentation files

3. **Create the ZIP**:
   - On Mac: Select files → Right-click → Compress
   - On Windows: Select files → Right-click → Send to → Compressed folder
   - On Linux: `zip -r addon.zip manifest.json background.js icon.png`

4. **Important**: The ZIP file should contain the files directly, not in a folder
   - ✅ Correct: `addon.zip` contains `manifest.json`, `background.js`, etc.
   - ❌ Wrong: `addon.zip` contains `Firefox_addon/` folder with files inside

## Step 2: Create Developer Account

1. Go to: https://addons.mozilla.org/developers/
2. Sign in with your Firefox Account
3. Accept the Developer Agreement
4. Complete your developer profile (if required)

## Step 3: Submit Your Addon

1. **Go to Developer Hub**: https://addons.mozilla.org/developers/addon/submit/
2. **Choose submission type**: 
   - Select "On this site" (for public listing)
   - Or "On your own" (for self-distribution)

3. **Upload your ZIP file**:
   - Click "Select a file..." or drag and drop your ZIP file
   - Wait for upload and validation

4. **Fill in addon information**:
   - **Name**: "Bookmark Current Page Here" (or your preferred name)
   - **Summary**: Brief description (max 250 characters)
     - Example: "Adds 'Bookmark current page here' option when right-clicking on bookmark folders in the bookmarks sidebar."
   - **Description**: Detailed description
     - Include features, usage instructions, etc.
   - **Categories**: Select relevant categories (e.g., "Bookmarks")
   - **Tags**: Add relevant tags (e.g., "bookmarks", "context-menu", "productivity")

5. **Upload screenshots** (optional but recommended):
   - Screenshot showing the context menu option
   - Recommended size: 1280x720 or 1280x800
   - At least one screenshot is recommended

6. **Set visibility**:
   - **Public**: Listed in AMO and searchable
   - **Unlisted**: Only accessible via direct link
   - Choose based on your preference

## Step 4: Review Process

1. **Automatic Review** (most common):
   - Addons are automatically reviewed if they meet certain criteria
   - Usually takes a few minutes to a few hours
   - You'll receive an email when review is complete

2. **Manual Review** (if needed):
   - May take several days
   - Required for addons with certain permissions or features
   - You'll be notified via email

3. **Check status**:
   - Go to: https://addons.mozilla.org/developers/addons/
   - Check the status of your submission

## Step 5: After Approval

1. **Your addon will be live** on AMO
2. **Share the link**: Users can install from the addon page
3. **Update your addon**:
   - Go to your addon's developer page
   - Click "Upload New Version"
   - Upload updated ZIP file
   - Add version notes describing changes

## Important Notes

### Version Numbering
- Update version in `manifest.json` for each release
- Use semantic versioning: 1.0.0, 1.0.1, 1.1.0, etc.

### Privacy Policy
- If your addon collects any data, you may need a privacy policy
- For this addon (only uses bookmarks API locally), likely not required
- But check AMO requirements

### Permissions
- Your current permissions are:
  - `bookmarks` - Required for functionality
  - `tabs` - Required to get current tab
  - `menus` - Required for context menu
  - `activeTab` - Required for current tab access
- These are all necessary and should be approved

### Icon Requirements
- Recommended sizes: 48x48 and 96x96 pixels
- Format: PNG
- If you don't have an icon, Firefox will use a default one
- But having a custom icon is better for branding

## Troubleshooting

### Common Issues:

1. **Validation Errors**:
   - Check the validation results page
   - Fix any errors before resubmitting
   - Common issues: missing manifest.json, invalid JSON, etc.

2. **Rejection Reasons**:
   - If rejected, you'll receive an email with reasons
   - Address all concerns and resubmit

3. **Update Rejected**:
   - Make sure version number is incremented
   - Check that all changes are documented

## Alternative: Self-Hosting

If you prefer not to publish on AMO:

1. **Host the XPI file** on your own website
2. **Users install** by:
   - Downloading the XPI file
   - Going to `about:addons` in Firefox
   - Clicking the gear icon → "Install Add-on From File..."
   - Selecting the downloaded XPI file

## Resources

- **AMO Developer Hub**: https://addons.mozilla.org/developers/
- **Addon Policies**: https://extensionworkshop.com/documentation/publish/add-on-policies/
- **Developer Documentation**: https://extensionworkshop.com/
- **Support Forum**: https://discourse.mozilla.org/c/add-ons/

## Quick Checklist Before Publishing

- [ ] Tested the addon thoroughly
- [ ] Removed all debug/test files from ZIP
- [ ] Updated version number in manifest.json
- [ ] Created a good description
- [ ] Prepared screenshots (optional but recommended)
- [ ] Read and understood AMO policies
- [ ] ZIP file structure is correct (files at root, not in subfolder)

Good luck with your publication! 🚀




