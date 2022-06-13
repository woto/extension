let rightClickedElement: Element | null;

document.body.addEventListener('contextmenu', (e) => {
  rightClickedElement = e.target as Element;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message } = request;
  let linkUrl: string | null = null;

  if (message === 'select-element') {
    switch (request.selectionType) {
      case 'select-text': {
        break;
      }
      case 'select-link': {
        const selection = window.getSelection();

        for (let i = 0; i < 10; i++) {
          if (!rightClickedElement) break;

          linkUrl = rightClickedElement.getAttribute('href');

          if (!linkUrl) {
            rightClickedElement = rightClickedElement.parentElement;
            continue;
          }

          linkUrl = new URL(linkUrl, window.location.toString()).toString();
        }

        if (!linkUrl) return;

        if (!rightClickedElement) return;

        if (!selection) return;

        selection.selectAllChildren(rightClickedElement);

        break;
      }
    }

    return sendResponse({ message: 'element-selected-successfully', linkUrl });
  }
});
