function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();


function onClickHandler(info: any, tab: any) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.id) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          selection: info.menuItemId,
        },
        (msg) => {
          console.log("result message:", msg);
        }
      );
    }
  });

}

chrome.contextMenus.create({"id": 'selection', "title": 'selection', "contexts":['selection']});
chrome.contextMenus.create({"id": 'link', "title": 'link', "contexts":['link']});


chrome.contextMenus.onClicked.addListener(onClickHandler);