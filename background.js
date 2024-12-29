// background.js

// Listener for when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function (details) {
  console.log("Extension installed or updated", details);
  // Perform any setup tasks here
});

// Listener for when a message is received from the content script or popup
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received:", message);
  // Handle the message and send a response if needed
  sendResponse({ response: "Message received" });
});

// Example of using chrome alarms API
chrome.alarms.create("exampleAlarm", { delayInMinutes: 1 });

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "exampleAlarm") {
    console.log("Alarm triggered:", alarm);
    // Perform any tasks when the alarm is triggered
  }
});

// Example of using chrome storage API
chrome.storage.sync.set({ key: "value" }, function () {
  console.log('Value is set to "value"');
});

chrome.storage.sync.get(["key"], function (result) {
  console.log("Value currently is " + result.key);
});
