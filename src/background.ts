const sendMessageToPage = (data: {}, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => new Promise((resolve, reject) => {
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

async function onClickHandler(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) {
  if(!['test 1'].includes(info.menuItemId.toString())) {
    if (!tab || !tab.id) return;

    await injectContentScripts('js/content_script.js', info, tab);
    await sendMessageToPage({message: 'select-element', selectionType: info.menuItemId}, info, tab);
    await sendMessageToPage({message: 'create-text-fragment'}, info, tab);
  } else {
    await injectContentScripts('js/content_script2.js', info, tab);
  }
}

const injectContentScripts = async (contentScriptName: string, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => {
  // If there's a reply, the content script already was injected.
  try {
    return await sendMessageToPage({ message: 'ping' }, info, tab);
  } catch (err) {
    if (!tab || !tab.id) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [contentScriptName],
    });
  }
};

chrome.contextMenus.create({ id: 'selection', title: 'selection', contexts: ['selection'] });
chrome.contextMenus.create({ id: 'link', title: 'link', contexts: ['link'] });
chrome.contextMenus.create({ id: 'test 1', title: 'test 1', contexts: ['all'] });

chrome.contextMenus.onClicked.addListener(onClickHandler);
