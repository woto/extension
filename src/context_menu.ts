let rightclickedElement: EventTarget;

document.body.addEventListener('contextmenu', (e) => {
  if (e.target) {
    rightclickedElement = e.target;
  }
});

// function addScript( src: string ) {
//   var s = document.createElement( 'script' );
//   s.setAttribute( 'src', src );
//   document.body.appendChild( s );
// }

// // addScript("http://localhost:8097");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(request);

  const { message } = request;
  let linkUrl = '';

  if (message === 'select-element') {
    switch (request.selectionType) {
      case 'selection': {
        break;
      }
      case 'link': {
        if (!rightclickedElement) return;

        const selection = window.getSelection();
        if (!selection) return;

        if (rightclickedElement instanceof Node) {
          // selection.selectAllChildren(rightclickedElement);
          const text = rightclickedElement.childNodes[0];
          linkUrl = (rightclickedElement as HTMLElement).getAttribute('href')!;
          selection.setBaseAndExtent(text, 0, text, text.textContent!.length);
          // debugger
          // selection.setBaseAndExtent(text,0,text,text.toString().length)
        }

        break;
      }
    }

    return sendResponse({message: 'element-selected-successfully', linkUrl: linkUrl});
  }
  // foo
});
