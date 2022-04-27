const sendMessageToPage = (data: {}, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => {
  return new Promise((resolve, reject) => {
    if (!tab || !tab.id) return;
    
    chrome.tabs.sendMessage(tab.id, data, (response) => {
      if (!response) {
        return reject(
            new Error('Failed to connect to the specified tab.'),
        );
      }
      return resolve(response);
    });
  });
}

async function onClickHandler(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) {
  if (!tab || !tab.id) return;

  await injectContentScripts('js/content_script.js', info, tab);
  await sendMessageToPage({ message: 'select-element', selectionType: info.menuItemId }, info, tab)
  await sendMessageToPage({ message: 'create-text-fragment' }, info, tab)
}

const injectContentScripts = async (contentScriptName: string, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => {
  // If there's a reply, the content script already was injected.
  try {
    return await sendMessageToPage({ message: 'ping' }, info, tab);
  } catch (err) {
    if (!tab || !tab.id) return;

    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: [contentScriptName],
    })
  }
};


chrome.contextMenus.create({"id": 'selection', "title": 'selection', "contexts":['selection']});
chrome.contextMenus.create({"id": 'link', "title": 'link', "contexts":['link']});

chrome.contextMenus.onClicked.addListener(onClickHandler);