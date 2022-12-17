let rightClickedElement: Element | null;

// NOTE: test
window.addEventListener('message', (event) => {
  // console.log(event);

  if (
    event.source == window
    && event.data
    && event.data.direction == 'from-page-script'
  ) {
    alert(`Content script received message: "${event.data.message}"`);
  }
});

document.addEventListener('contextmenu', (e) => {
  rightClickedElement = e.target as Element;
});

document.addEventListener('click', (e) => {
  // console.debug('link click');

  if (e.target instanceof HTMLElement) {
    if (e.target.dataset.entityId) {
      e.preventDefault();

      alert('link click');

      chrome.runtime.sendMessage({ message: 'edit-entity' }, () => {
        alert('link click');
      });
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { message } = request;

  let linkUrl: string | null = null;
  let imageSrc: string | null = null;

  if (message === 'select-element') {
    switch (request.selectionType) {
      case 'select-text': {
        break;
      }
      case 'select-image': {
        const selection = window.getSelection();

        for (let i = 0; i < 10; i++) {
          if (!rightClickedElement) break;

          imageSrc = rightClickedElement.getAttribute('src');

          if (!imageSrc) {
            rightClickedElement = rightClickedElement.parentElement;
            continue;
          }
          imageSrc = new URL(imageSrc, window.location.toString()).toString();
          break;
        }

        if (!imageSrc) return;

        if (!rightClickedElement) return;

        if (!selection) return;

        selection.selectAllChildren(rightClickedElement);

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
          break;
        }

        if (!linkUrl) return;

        if (!rightClickedElement) return;

        if (!selection) return;

        selection.selectAllChildren(rightClickedElement);

        break;
      }
    }

    return sendResponse({
      message: 'element-selected-successfully',
      linkUrl,
      imageSrc,
    });
  }
});
