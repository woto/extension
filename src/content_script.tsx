let rightclickedItem: EventTarget | null;

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log(msg);
  console.log(rightclickedItem);

  // if (msg.color) {
  //   console.log("Receive color = " + msg.color);
  //   document.body.style.backgroundColor = msg.color;
  //   sendResponse("Change color to " + msg.color);
  // } else {
  //   sendResponse("Color message is none.");
  // }
  
});

document.body.addEventListener("contextmenu", function(e) {
  rightclickedItem = e.target;
  // console.log("context menu in content script handler", rightclickedItem);
});
