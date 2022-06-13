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

        for (let i = 0; i < 100; i++) {
          if (!rightClickedElement) break;

          linkUrl = rightClickedElement.getAttribute('href');
          if (linkUrl) break;

          rightClickedElement = rightClickedElement.parentElement;
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
