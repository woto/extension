let rightclickedElement: EventTarget;

document.body.addEventListener("contextmenu", function(e) {
    if (e.target) {
        rightclickedElement = e.target;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(request);

    const message = request.message;
    if (message === 'select-element') {
        switch(request.selectionType) {
            case 'selection': {
              break;
            }
            case 'link': {
              if (!rightclickedElement) return;
          
              let selection = window.getSelection();
              if (!selection) return;
          
              if (rightclickedElement instanceof Node) {
                // selection.selectAllChildren(rightclickedElement);
                const text = rightclickedElement.childNodes[0];
                selection.setBaseAndExtent(text, 0, text, text.textContent!.length);
                // debugger
                // selection.setBaseAndExtent(text,0,text,text.toString().length)
              }
            
              break;
            }
        }

        return sendResponse("element-selected-successfully");
    } else {
        // foo
    }
});