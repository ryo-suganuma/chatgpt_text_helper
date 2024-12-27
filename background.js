let shouldOpenPanel = false;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "askGPT",
    title: "Ask ChatGPT",
    contexts: ["selection"]
  });

  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'sidepanel.html'
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "askGPT") {
    try {
      await chrome.storage.local.set({ 
        selectedText: info.selectionText,
        timestamp: Date.now()
      });

      chrome.action.setIcon({
        tabId: tab.id,
        path: {
          "16": "icons/highlight_16.png",
          "32": "icons/highlight_32.png",
          "48": "icons/highlight_48.png",
          "128": "icons/highlight_128.png"
        }
      });

      chrome.action.setBadgeText({
        tabId: tab.id,
        text: "!"
      });

      chrome.action.setBadgeBackgroundColor({
        tabId: tab.id,
        color: "#FF0000"
      });

      shouldOpenPanel = true;
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    chrome.action.setIcon({
      tabId: tab.id,
      path: {
        "16": "icons/default_16.png",
        "32": "icons/default_32.png",
        "48": "icons/default_48.png",
        "128": "icons/default_128.png"
      }
    });

    chrome.action.setBadgeText({
      tabId: tab.id,
      text: ""
    });

    await chrome.sidePanel.open({ windowId: tab.windowId });

    shouldOpenPanel = false;
  } catch (error) {
    console.error('Error:', error);
  }
});
