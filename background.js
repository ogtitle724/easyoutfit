let isActive = false;
let imgData = null;

chrome.commands.onCommand.addListener((command) => {
  if (command === "capture-page") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Capture error:", chrome.runtime.lastError.message);
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length === 0) return; // no active tab
        const activeTabId = tabs[0].id;
        const message = { isActive };

        if (!isActive) message.dataUrl = dataUrl;

        chrome.tabs.sendMessage(activeTabId, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Message error:", chrome.runtime.lastError.message);
          } else {
            imgData = dataUrl;
            isActive = !isActive;
          }
        });
      });
    });
  }
});
