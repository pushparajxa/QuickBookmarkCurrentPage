# AMO Submission Notes - Data Collection

## If you get "data_collection_permissions" error:

The `data_collection_permissions` property might need to be declared in the **AMO submission form**, not in the manifest.json.

### Steps:

1. **In the AMO submission form**, look for sections like:
   - "Data Collection"
   - "Privacy Policy"
   - "Data Handling"
   - "What data does your addon collect?"

2. **Declare that your addon does NOT collect data:**
   - Select "No data collection" or similar option
   - Or explicitly state: "This addon does not collect, store, or transmit any user data. All operations are performed locally using the browser's built-in bookmarks API."

3. **If there's a privacy policy field:**
   - You can state: "No data collection. All operations are local."
   - Or link to a simple privacy policy page

### Alternative: Try adding to manifest (if form doesn't work)

If the AMO form doesn't have a data collection field, try adding this to manifest.json:

```json
"data_collection_permissions": []
```

Or:

```json
"data_collection_permissions": {}
```

### What your addon does:
- Uses `bookmarks` API - only creates bookmarks locally
- Uses `tabs` API - only reads current tab info locally
- Uses `menus` API - only creates context menu items
- **No data is collected, stored, or transmitted**

This should satisfy AMO's requirements.




