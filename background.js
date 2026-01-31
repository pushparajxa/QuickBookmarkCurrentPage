// Wait for extension to be ready and get the contextMenus API
let contextMenus = null;

function initializeContextMenus() {
  console.log("Initializing contextMenus API...");
  console.log("typeof browser:", typeof browser);
  console.log("typeof chrome:", typeof chrome);
  
  // Try chrome.menus first (Firefox uses chrome.menus instead of chrome.contextMenus)
  if (typeof chrome !== 'undefined') {
    console.log("chrome object exists");
    console.log("chrome.contextMenus:", typeof chrome.contextMenus, chrome.contextMenus);
    console.log("chrome.menus:", typeof chrome.menus, chrome.menus);
    
    // Try chrome.menus first (Firefox uses this)
    if (chrome.menus) {
      contextMenus = chrome.menus;
      console.log("✓ Using chrome.menus API");
      return true;
    }
    // Try chrome.contextMenus as fallback (for Chrome/other browsers)
    if (chrome.contextMenus) {
      contextMenus = chrome.contextMenus;
      console.log("✓ Using chrome.contextMenus API");
      return true;
    }
  }
  
  // Then try browser namespace
  if (typeof browser !== 'undefined') {
    console.log("browser object exists");
    console.log("browser.contextMenus:", typeof browser.contextMenus, browser.contextMenus);
    console.log("browser.menus:", typeof browser.menus, browser.menus);
    
    // Try browser.contextMenus
    if (browser.contextMenus) {
      contextMenus = browser.contextMenus;
      console.log("✓ Using browser.contextMenus API");
      return true;
    }
    // Try browser.menus as fallback
    if (browser.menus) {
      contextMenus = browser.menus;
      console.log("✓ Using browser.menus API");
      return true;
    }
  }
  
  // If we get here, the API is not available
  console.error("✗ contextMenus API is not available!");
  console.error("Checked: browser.contextMenus, browser.menus, chrome.contextMenus, chrome.menus");
  if (typeof browser !== 'undefined') {
    console.error("Available browser APIs:", Object.keys(browser).sort());
    console.error("Browser APIs containing 'menu':", Object.keys(browser).filter(k => k.toLowerCase().includes('menu')));
  }
  if (typeof chrome !== 'undefined') {
    console.error("Available chrome APIs:", Object.keys(chrome).sort());
    console.error("Chrome APIs containing 'menu':", Object.keys(chrome).filter(k => k.toLowerCase().includes('menu')));
  }
  return false;
}

// Initialize immediately
if (!initializeContextMenus()) {
  // Try again after a short delay in case APIs load asynchronously
  setTimeout(() => {
    if (!initializeContextMenus()) {
      console.error("✗ Failed to initialize contextMenus API after retry");
    }
  }, 100);
}

// Helper function to promisify chrome API calls
function promisifyChromeAPI(apiFunc, ...args) {
  return new Promise((resolve, reject) => {
    apiFunc(...args, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(result);
      }
    });
  });
}

// Function to create the context menu item
async function createContextMenu() {
  if (!ensureContextMenus()) {
    console.error("Cannot create context menu - API not available");
    return;
  }
  
  try {
    // Remove existing menu item if it exists (to avoid duplicates)
    try {
      if (typeof contextMenus.remove === 'function') {
        // Check if we're using chrome API (callback-based) or browser API (promise-based)
        if (typeof chrome !== 'undefined' && (chrome.menus === contextMenus || chrome.contextMenus === contextMenus)) {
          await promisifyChromeAPI(contextMenus.remove.bind(contextMenus), "bookmark-current-page-here");
        } else {
          await contextMenus.remove("bookmark-current-page-here");
        }
      }
    } catch (e) {
      // Menu item doesn't exist yet, that's fine
      console.log("Menu item doesn't exist yet (this is OK)");
    }
    
    // Create the context menu item for bookmarks
    // Start hidden - we'll show it only for folders in onShown handler
    const menuOptions = {
      id: "bookmark-current-page-here",
      title: "Bookmark current page here",
      contexts: ["bookmark"],
      visible: false  // Hidden by default, will be shown only for folders
    };
    
    // Check if we're using chrome API (callback-based) or browser API (promise-based)
    if (typeof chrome !== 'undefined' && (chrome.menus === contextMenus || chrome.contextMenus === contextMenus)) {
      await promisifyChromeAPI(contextMenus.create.bind(contextMenus), menuOptions);
    } else {
      await contextMenus.create(menuOptions);
    }
    console.log("✓ Context menu item created successfully");
    
    // Verify it was created by trying to get all menu items
    try {
      let allMenus;
      // Check if we're using browser API (has getAll) or chrome API (doesn't have getAll)
      if (typeof chrome === 'undefined' || (chrome.menus !== contextMenus && chrome.contextMenus !== contextMenus)) {
        // Using browser API
        if (contextMenus.getAll) {
          allMenus = await contextMenus.getAll();
          console.log("All context menu items:", allMenus);
          const ourMenu = allMenus.find(m => m.id === "bookmark-current-page-here");
          if (ourMenu) {
            console.log("✓ Our menu item verified:", ourMenu);
          } else if (allMenus.length > 0) {
            console.log("Menu item created but not in getAll list");
          }
        }
      } else {
        // Using chrome API - doesn't have getAll, so we can't verify
        console.log("Using chrome API - menu item should be created (can't verify with getAll)");
      }
    } catch (e) {
      console.log("Could not verify menu items:", e);
    }
  } catch (error) {
    console.error("✗ Error creating context menu:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
  }
}

// Function to ensure contextMenus is available
function ensureContextMenus() {
  if (!contextMenus) {
    initializeContextMenus();
  }
  return contextMenus !== null;
}

// Initialize when runtime is ready
const runtime = (typeof browser !== 'undefined' && browser.runtime) || (typeof chrome !== 'undefined' && chrome.runtime);

if (runtime) {
  // Try to initialize immediately
  if (ensureContextMenus()) {
    createContextMenu();
  }
  
  // Also try on installed/startup
  if (runtime.onInstalled) {
    runtime.onInstalled.addListener(() => {
      console.log("Extension installed/updated, initializing...");
      if (ensureContextMenus()) {
        createContextMenu();
      }
    });
  }
  
  if (runtime.onStartup) {
    runtime.onStartup.addListener(() => {
      console.log("Browser startup, initializing...");
      if (ensureContextMenus()) {
        createContextMenu();
      }
    });
  }
} else {
  console.error("Runtime API not available!");
}

// Only proceed if contextMenus API is available
if (ensureContextMenus()) {

  // Handle context menu click
  contextMenus.onClicked.addListener(async (info, tab) => {
    console.log("Context menu clicked, info:", info);
    if (info.menuItemId === "bookmark-current-page-here") {
    try {
      // Get the bookmark folder ID from the clicked bookmark
      const bookmarkId = info.bookmarkId;
      
      if (!bookmarkId) {
        console.error("No bookmark ID found");
        return;
      }
      
      // Get the bookmark details to check if it's a folder
      const bookmarkNode = await browser.bookmarks.get(bookmarkId);
      const clickedBookmark = bookmarkNode[0];
      
      if (!clickedBookmark) {
        console.error("Bookmark not found");
        return;
      }
      
      // Only proceed if clicked on a folder
      if (clickedBookmark.type !== "folder") {
        console.log("Clicked item is not a folder, ignoring");
        return;
      }
      
      // Use the folder as the parent
      const parentId = clickedBookmark.id;
      
      // Get the current active tab
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) {
        console.error("No active tab found");
        return;
      }
      
      const currentTab = tabs[0];
      
      // Check if the tab has a valid URL (not about: pages, etc.)
      if (!currentTab.url || currentTab.url.startsWith("about:") || currentTab.url.startsWith("moz-extension:")) {
        console.error("Cannot bookmark this page type");
        return;
      }
      
      // Create bookmark in the selected folder
      await browser.bookmarks.create({
        title: currentTab.title || currentTab.url,
        url: currentTab.url,
        parentId: parentId
      });
      
      console.log(`Bookmarked "${currentTab.title}" in folder "${clickedBookmark.title}"`);
    } catch (error) {
      console.error("Error bookmarking page:", error);
    }
    }
  });

  // Update menu item visibility based on whether clicked item is a folder
  // This only works in Firefox 63+, for older versions the menu will always show
  if (contextMenus.onShown) {
    console.log("onShown API is available, setting up listener");
    contextMenus.onShown.addListener(async (info) => {
      console.log("Context menu shown, info:", info);
      if (info.bookmarkId) {
        try {
          const bookmarkNode = await browser.bookmarks.get(info.bookmarkId);
          const clickedBookmark = bookmarkNode[0];
          console.log("Clicked bookmark type:", clickedBookmark ? clickedBookmark.type : "unknown");
          
          // Only show menu item for folders
          if (clickedBookmark && clickedBookmark.type === "folder") {
            console.log("Showing menu item for folder:", clickedBookmark.title);
            // Check if we're using chrome API (callback-based) or browser API (promise-based)
            if (typeof chrome !== 'undefined' && (chrome.menus === contextMenus || chrome.contextMenus === contextMenus)) {
              await promisifyChromeAPI(contextMenus.update.bind(contextMenus), "bookmark-current-page-here", {
                visible: true
              });
            } else {
              await contextMenus.update("bookmark-current-page-here", {
                visible: true
              });
            }
          } else {
            console.log("Hiding menu item (not a folder)");
            // Check if we're using chrome API (callback-based) or browser API (promise-based)
            if (typeof chrome !== 'undefined' && (chrome.menus === contextMenus || chrome.contextMenus === contextMenus)) {
              await promisifyChromeAPI(contextMenus.update.bind(contextMenus), "bookmark-current-page-here", {
                visible: false
              });
            } else {
              await contextMenus.update("bookmark-current-page-here", {
                visible: false
              });
            }
          }
        } catch (error) {
          console.error("Error checking bookmark type:", error);
          // Hide menu item on error
          try {
            if (typeof chrome !== 'undefined' && (chrome.menus === contextMenus || chrome.contextMenus === contextMenus)) {
              await promisifyChromeAPI(contextMenus.update.bind(contextMenus), "bookmark-current-page-here", {
                visible: false
              });
            } else {
              await contextMenus.update("bookmark-current-page-here", {
                visible: false
              });
            }
          } catch (e) {
            console.error("Error updating menu visibility:", e);
          }
        }
      } else {
        // No bookmarkId, hide the menu item
        console.log("No bookmarkId, hiding menu item");
        try {
          if (typeof chrome !== 'undefined' && (chrome.menus === contextMenus || chrome.contextMenus === contextMenus)) {
            await promisifyChromeAPI(contextMenus.update.bind(contextMenus), "bookmark-current-page-here", {
              visible: false
            });
          } else {
            await contextMenus.update("bookmark-current-page-here", {
              visible: false
            });
          }
        } catch (e) {
          console.error("Error updating menu visibility:", e);
        }
      }
    });
  } else {
    console.log("onShown API not available - menu will show for all bookmarks");
    console.log("Available contextMenus properties:", Object.keys(contextMenus));
  }
} else {
  console.error("✗ Extension cannot function - contextMenus API is not available!");
  console.error("Please check that the 'menus' permission is in manifest.json");
}

