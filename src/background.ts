type Feature = 'list' | 'add';

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
  // if (!tab || !tab.id) return;

  if (['link', 'selection'].includes(info.menuItemId.toString())) {
    await injectContentScripts('add', 'js/content_script.js', info, tab);
    await sendMessageToPage({ message: 'select-element', selectionType: info.menuItemId }, info, tab);
    await sendMessageToPage({ message: 'create-fragment' }, info, tab);
  } else if (['list'].includes(info.menuItemId.toString())) {
    // debugger
    await injectContentScripts('list', 'js/content_script2.js', info, tab);
    await sendMessageToPage({ message: 'list-fragments' }, info, tab);
  }
}

const injectContentScripts = async (feature: Feature, contentScriptName: string, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => {
  // If there's a reply, the content script already was injected.
  try {
    return await sendMessageToPage({ message: 'ping', feature }, info, tab);
  } catch (err) {
    if (!tab || !tab.id) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [contentScriptName],
    });
  }
};

chrome.contextMenus.create({ id: 'selection', title: 'Добавить выделение', contexts: ['selection'] });
chrome.contextMenus.create({ id: 'link', title: 'Добавить ссылку', contexts: ['link'] });
chrome.contextMenus.create({ id: 'list', title: 'Список объектов', contexts: ['page'] });

chrome.contextMenus.onClicked.addListener(onClickHandler);
