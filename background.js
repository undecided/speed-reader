chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  const ON = "✅";
  const OFF = "";
  // Retrieve the action badge to check if the extension is ON or OFF
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === ON ? OFF : ON

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  chrome.scripting
    .executeScript({
      target : {tabId : tab.id},
      files : [ nextState == ON ? "speedreader.js" : "speedreader_off.js" ],
    }).then(() => console.log("injected script file"));
});

