/* chrome.commands.onCommand.addListener((command) => {
  console.log("on command");
  // Listens for keyboard shortcuts registered in the manifest.
  if (command === "_execute_action") {
    console.log("execute command");
    // Check if the executed command matches "_execute_action".
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("tab:", tabs);
      // Gets the currently active tab in the current window.
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id }, // Targets the active tab.
        files: ["content.js"], // Injects the content script into the active tab.
      });
    });
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  console.log("Current tab URL:", tabs[0].url);
});
 */
