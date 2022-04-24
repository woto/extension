let rightclickedItem: EventTarget;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  switch(msg.selectionType) {
    case 'selection': {
      break;
    }
    case 'link': {

      if (!rightclickedItem) return;

      let selection = window.getSelection();
      if (!selection) return;

      if (rightclickedItem instanceof Node) {
        selection.selectAllChildren(rightclickedItem);
      }
    
      break;
    }
  }

  // if (msg.color) {
  //   console.log("Receive color = " + msg.color);
  //   document.body.style.backgroundColor = msg.color;
  //   sendResponse("Change color to " + msg.color);
  // } else {
  //   sendResponse("Color message is none.");
  // }
  
});

document.body.addEventListener("contextmenu", function(e) {
  if (e.target) {
    rightclickedItem = e.target;
  }
  // console.log("context menu in content script handler", rightclickedItem);
});
