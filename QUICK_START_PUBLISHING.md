# Quick Start: Publishing Your Addon

## Fastest Way to Publish

### 1. Create the Package

**Option A: Using the script (Mac/Linux)**
```bash
./package.sh
```
This creates `Firefox_addon_package.zip` ready for upload.

**Option B: Manual (any OS)**
1. Create a ZIP file containing ONLY:
   - `manifest.json`
   - `background.js`
   - `icon.png` (if you have one)
2. Make sure files are at the root of the ZIP (not in a subfolder)

### 2. Submit to AMO

1. Go to: https://addons.mozilla.org/developers/addon/submit/
2. Sign in with Firefox Account
3. Upload your ZIP file
4. Fill in:
   - **Name**: Bookmark Current Page Here
   - **Summary**: Adds 'Bookmark current page here' option when right-clicking on bookmark folders
   - **Description**: (see full guide for details)
5. Submit!

### 3. Wait for Review

- Usually takes a few hours to a day
- You'll get an email when approved

## That's It! 🎉

For detailed instructions, see `PUBLISHING_GUIDE.md`




