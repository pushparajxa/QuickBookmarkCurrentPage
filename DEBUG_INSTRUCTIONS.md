# Debugging Instructions

If the context menu option is not appearing, follow these steps to debug:

## 1. Check the Background Page Console

1. Go to `about:debugging`
2. Find your extension in the list
3. Click "Inspect" next to the extension (this opens the background page console)
4. Look for any error messages or the console.log messages we added

## 2. Check if the Menu Item was Created

In the background page console, you should see:
- "Context menu item created successfully" when the extension loads
- When you right-click on a bookmark, you should see "Context menu shown, info:" with details

## 3. Verify Permissions

Make sure the extension has all required permissions:
- Go to `about:addons`
- Find your extension
- Check that it has permissions for bookmarks, tabs, and menus

## 4. Test with a Simple Version

If the menu still doesn't appear, the issue might be that Firefox's bookmark sidebar context menu doesn't support custom items the same way. In that case, we might need to use a content script approach instead.

## 5. Check Firefox Version

The `onShown` API is available in Firefox 63+. If you're using an older version, the menu might appear for all bookmarks (not just folders).




