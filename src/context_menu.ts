let rightclickedElement: EventTarget;

document.body.addEventListener('contextmenu', (e) => {
  let elem = e.target as HTMLElement;

  while (true) {
    const src = elem.getAttribute('href') || '';

    try {
      new URL(src);
      rightclickedElement = elem;
      return;
    } catch (_) {
      if (elem.parentElement) {
        elem = elem.parentElement;
      } else {
        break;
      }

      continue;
    }
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
    // debugger

    switch (request.selectionType) {
      case 'select-text': {
        break;
      }
      case 'select-link': {
        // debugger

        if (!rightclickedElement) return;

        const selection = window.getSelection();
        if (!selection) return;

        if (rightclickedElement instanceof Node) {
          // selection.selectAllChildren(rightclickedElement);
          const text = rightclickedElement.childNodes[0];
          linkUrl = (rightclickedElement as HTMLElement).getAttribute('href')!;
          selection.setBaseAndExtent(rightclickedElement, 0, rightclickedElement, 1);
          // selection.setBaseAndExtent(text, 0, text, text.textContent!.length);
          // debugger
          // selection.setBaseAndExtent(text,0,text,text.toString().length)
        }

        break;
      }
    }

    return sendResponse({ message: 'element-selected-successfully', linkUrl });
  }
  // foo
});
