import { appUrl } from './Utils';
import { Feature } from '../main';

const sendMessageToPage = (data: {}, tab?: chrome.tabs.Tab | undefined) => new Promise((resolve, reject) => {
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

// manifest permissions/history
// chrome.history.onVisited.addListener(
//   () => {},
// )

const injectContentScripts = async (feature: Feature, contentScriptName: string, tab?: chrome.tabs.Tab | undefined) => {
  // If there's a reply, the content script already was injected.
  try {
    return await sendMessageToPage({ message: 'ping', feature }, tab);
  } catch (err) {
    if (!tab || !tab.id) return;

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: [contentScriptName],
    });
  }
};

const showAppAuth = async () => {
  chrome.windows.getCurrent((window) => {
    const width = 400;
    const height = 500;
    const left = ((window.width! / 2) - (width / 2)) + window.left!;
    const top = ((window.height! / 2) - (height / 2)) + window.top!;

    chrome.windows.create({
      url: 'auth.html',
      width,
      height,
      top: Math.round(top),
      left: Math.round(left),
      type: 'popup',
    });
  });
};

const showAppAdd = async (selectionType: string, tab: chrome.tabs.Tab) => {
  await injectContentScripts('add', 'js/content_script.js', tab);
  const result = await sendMessageToPage({ message: 'select-element', selectionType }, tab);
  await sendMessageToPage({ message: 'create-fragment', linkUrl: (result as Record<'linkUrl', string>).linkUrl }, tab);
};

const checkToken = async () => {
  const data = await chrome.storage.sync.get('api_key');
  const apiKey = data.api_key;

  return new Promise((resolve, reject) => {
    if (!apiKey) {
      return reject();
    }

    fetch('http://localhost:3000/api/me', {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': apiKey,
      },
    }).then((result) => {
      if (result.ok) {
        return resolve('ok');
      }
      return reject();
    }).catch((reason) => reject());
  });
};

async function onClickHandler(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) {
  const menuItemId = info.menuItemId.toString();

  chrome.runtime.onMessage.addListener(
    (message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
      console.log('received message:', message);
      showAppAdd(menuItemId, tab!);
      sendResponse({ message: 'foo' });
    },
  );
  if (['select-link', 'select-text'].includes(menuItemId)) {
    checkToken()
      .then(() => {
        showAppAdd(menuItemId, tab!);
      })
      .catch(() => {
        showAppAuth();
      });
  }
}

chrome.contextMenus.create({ id: 'select-text', title: 'Добавить выделение', contexts: ['selection'] });
chrome.contextMenus.create({ id: 'select-link', title: 'Добавить ссылку', contexts: ['link'] });
chrome.contextMenus.onClicked.addListener(onClickHandler);
