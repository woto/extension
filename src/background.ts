// function polling() {
//   // console.log("polling");
//   setTimeout(polling, 1000 * 30);
// }

// polling();

const sendMessageToPage = (data: {}, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => {
  return new Promise((resolve, reject) => {
    if (!tab || !tab.id) return;
    
    chrome.tabs.sendMessage(tab.id, data, (response) => {
      // console.log(response);

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
  // console.log(info);
  // console.log(tab);

  await injectContentScripts('js/content_script.js', info, tab);
  await sendMessageToPage({ message: 'select-element', selectionType: info.menuItemId }, info, tab)
  await sendMessageToPage({ message: 'create-text-fragment' }, info, tab)
}

const injectContentScripts = async (contentScriptName: string, info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => {
  // If there's a reply, the content script already was injected.
  try {
    return await sendMessageToPage({ message: 'ping' }, info, tab);
  } catch (err) {
    // console.log(err);
    if (!tab || !tab.id) return;

    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: [contentScriptName],
    })

    // await Promise.all(
    //     contentScriptNames.map((contentScriptName) => {
    //       return new Promise((resolve) => {
    //         if (!tab || !tab.id) return;

    //         chrome.scripting.executeScript({
    //           target: {tabId: tab.id},
    //           files: [contentScriptName],
    //         },
    //         () => {
    //           return resolve(null);
    //         });

    //         // chrome.tabs.executeScript(
    //         //     {
    //         //       file: contentScriptName,
    //         //     },
    //         //     () => {
    //         //       return resolve(null);
    //         //     },
    //         // );
    //       });
    //     }),
    // );
  }
};


chrome.contextMenus.create({"id": 'selection', "title": 'selection', "contexts":['selection']});
chrome.contextMenus.create({"id": 'link', "title": 'link', "contexts":['link']});


chrome.contextMenus.onClicked.addListener(onClickHandler);