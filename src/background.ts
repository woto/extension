import { Feature } from '../main';
import { loginUrl } from './Utils';

const sendMessageToPage = (data: {}, tab?: chrome.tabs.Tab | undefined) => {
// console.log(data);
  // console.log(data);

  // if (tab) console.log(tab);

  return new Promise((resolve, reject) => {
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(tab.id, data, (response) => {
      if (!response) {
        return reject(new Error('Failed to connect to the specified tab.'));
      }
      return resolve(response);
    });
  });
};

// manifest permissions/history
// chrome.history.onVisited.addListener(
//   () => {},
// )

const injectContentScripts = async (
  feature: Feature,
  contentScriptName: string,
  tab?: chrome.tabs.Tab | undefined,
) => {
  // If there's a reply, the content script already was injected.
  try {
    // console.log('ping');
    return await sendMessageToPage({ message: 'ping', feature }, tab);
  } catch (err) {
    if (!tab || !tab.id) return;

    await chrome.scripting.executeScript({
      // @ts-ignore: @types/chrome not yet updated (Chrome 102)
      injectImmediately: true,
      target: { tabId: tab.id },
      files: [contentScriptName],
    });
  }
};

let authWindowId: number;

const showAppAuth = async () => {
  let authWindow: chrome.windows.Window;
  try {
    authWindow = await chrome.windows.get(authWindowId);
    chrome.windows.update(authWindowId, {
      drawAttention: true,
      // focused: true
    });
  } catch (error) {
    const currentWindow = await chrome.windows.getCurrent();

    const popupWidth = 740;
    const popupHeight = 780;
    const left = currentWindow.width! / 2 - popupWidth / 2 + currentWindow.left!;
    const top = currentWindow.height! / 2 - popupHeight / 2 + currentWindow.top!;

    authWindow = await chrome.windows.create({
      url: loginUrl,
      width: popupWidth,
      height: popupHeight,
      top: Math.round(top),
      left: Math.round(left),
      type: 'popup',
      focused: true,
      // setSelfAsOpener: true,
    });

    if (authWindow.id) {
      authWindowId = authWindow.id;
    }
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message } = request;

  if (message === 'request-auth') {
    showAppAuth();
    return sendResponse();
  }
});

const showAppAdd = async (menuItemId: string, tab: chrome.tabs.Tab) => {
  await injectContentScripts('add', 'js/content_script.js', tab);
  const result = await sendMessageToPage(
    { message: 'select-element', menuItemId },
    tab,
  );
  const pageLanguage = await chrome.tabs.detectLanguage();
  // console.log(pageLanguage);

  await sendMessageToPage(
    {
      message: 'create-fragment',
      linkUrl: (result as Record<'linkUrl', string>).linkUrl,
      imageSrc: (result as Record<'imageSrc', string>).imageSrc,
      pageLanguage,
      menuItemId,
    },
    tab,
  );
};

const showAppEdit = async (entityId: string, tab: chrome.tabs.Tab) => {
  await injectContentScripts('add', 'js/content_script.js', tab);
  const pageLanguage = await chrome.tabs.detectLanguage();
  // console.log(pageLanguage);

  const result = await sendMessageToPage(
    {
      message: 'edit-entity',
      entityId,
      pageLanguage,
    },
    tab,
  );
};

// class WrongApiKeyError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = 'WrongApiKeyError';
//   }
// }

// const checkToken = async () => {
//   console.debug('checkToken');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message } = request;

  // console.debug(message);

  function onCaptured(imageUri: any) {
    sendResponse({ imageUri });
  }

  function onError(error: any) {
    console.error(`Error: ${error}`);
  }

  if (message === 'take-screenshot') {
    const capturing = chrome.tabs.captureVisibleTab();
    capturing.then(onCaptured, onError);
  }

  return true;
});

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    const { message } = request;
    if (message === 'edit-entity') {
      if (sender.tab) {
        showAppEdit(request.entityId, sender.tab);
      }
    }
  },
);

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    const { message, apiKey } = request;

    debugger;

    if (message === 'api-token-obtained') {
      if (authWindowId) {
        chrome.windows.remove(authWindowId);
      }
    }
  },
);

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    const { message, apiKey } = request;
    if (message === 'authenticate-user') {
      // console.debug(request);
      // console.debug(sender);
      // console.debug(sendResponse);
      chrome.storage.sync.set({ apiKey: request.apiKey }).then(() => {
        // console.log('token saved');
      });

      sendResponse();
    }
  },
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(request);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message } = request;
  // console.debug(message);

  if (message === 'preserve-widget') {
    if (!sender.tab?.id) return;

    const value = {
      [sender.tab.id]: request,
    };

    // debugger

    chrome.storage.local.set(value);

    return sendResponse();
  }
});

async function onClickHandler(
  info: chrome.contextMenus.OnClickData,
  tab?: chrome.tabs.Tab | undefined,
) {
  const menuItemId = info.menuItemId.toString();

  // chrome.runtime.onMessage.addListener(
  //   (message: any, sender: chrome.runtime.MessageSender, sendResponse) => {
  //     showAppAdd(menuItemId, tab!);
  //     sendResponse({ message: 'foo' });
  //   },
  // );

  // if (['select-page', 'select-link', 'select-text', 'select-image'].includes(menuItemId)) {
  //   try {
  //     await checkToken()
  //     showAppAdd(menuItemId, tab!);
  //   } catch (err) {
  //     console.error(err);
  //     showAppAuth();
  //   }
  // }

  if (
    ['select-page', 'select-link', 'select-text', 'select-image'].includes(
      menuItemId,
    )
  ) {
    showAppAdd(menuItemId, tab!);
  }
}

chrome.contextMenus.create({
  id: 'select-page',
  title: 'Добавить страницу',
  contexts: ['page'],
});
chrome.contextMenus.create({
  id: 'select-text',
  title: 'Добавить выделение',
  contexts: ['selection'],
});
chrome.contextMenus.create({
  id: 'select-link',
  title: 'Добавить ссылку',
  contexts: ['link'],
});
chrome.contextMenus.create({
  id: 'select-image',
  title: 'Добавить изображение',
  contexts: ['image'],
});
chrome.contextMenus.onClicked.addListener(onClickHandler);

async function restoreWidget() {
  // try {
  //   await checkToken()
  // } catch (err) {
  //   return
  // }

  // await chrome.tabs.query({ currentWindow: true, active: true });

  const store = await chrome.storage.local.get();
  // console.log(store);

  for (const item in store) {
    let tab: chrome.tabs.Tab;

    try {
      if (!store[item].showWindow) {
        throw new Error('showWindow is false');
      }

      tab = await chrome.tabs.get(parseInt(item));

      try {
        await injectContentScripts('add', 'js/content_script.js', tab);

        // debugger
        try {
          await sendMessageToPage(
            {
              ...store[item],
              message: 'restore-widget',
            },
            tab,
          );
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      chrome.storage.local.set({ [item]: {} });
    }
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete') {
    // console.log('chrome.tabs.onUpdated');
    restoreWidget();
  }
});

// chrome.history.onVisited.addListener( () => {
//   console.log('chrome.history.onVisited')
// })

// NOTE: Was added permission
chrome.webNavigation.onCommitted.addListener(() => {
  // console.log('chrome.webNavigation.onCommitted');
  restoreWidget();
});

// NOTE: Was added permission
chrome.webNavigation.onCompleted.addListener(() => {
  // console.log('chrome.webNavigation.onCompleted')
});

// NOTE: Was added permission
chrome.webNavigation.onDOMContentLoaded.addListener(() => {
  // console.log('chrome.webNavigation.onDOMContentLoaded')
});

// NOTE: Was added permission
chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  // console.log('chrome.webNavigation.onHistoryStateUpdated')
});

// chrome.devtools.network.onNavigated.addListener(
//   function(requesturl) {
//       console.log('Navigating toooooo: ' + requesturl);
//   });
