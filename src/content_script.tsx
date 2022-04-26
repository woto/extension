import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const body = document.querySelector('body');
const app = document.createElement('div');
const fgu = require('./fragment-generation-utils');

app.id = 'root';

if (body) {
  body.prepend(app);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


const copyToClipboard = async(url: string, selection: Selection) => {
  // const type = "text/plain";
  // const blob = new Blob([url], {type: type});

    /* global ClipboardItem */
  // const clipboardData = [new ClipboardItem({[type]: blob} as unknown as Record<string, ClipboardItemData>)];
  // const { ClipboardItem } = window;
  // const clipboardData = [new ClipboardItem({[type]: blob} as unknown as Record<string, ClipboardItemData>)];
  // await navigator.clipboard.write(clipboardData);
  // await navigator.clipboard.writeText(url);
  
  console.log(url);
};

const createTextFragment = () => {
  const selection = window.getSelection();
  // eslint-disable-next-line no-undef
  const result = fgu.generateFragment(selection);
  let url = `${location.origin}${location.pathname}${location.search}`;
  if (result.status === 0) {
    const fragment = result.fragment;
    const prefix = fragment.prefix ?
      `${encodeURIComponent(fragment.prefix)}-,` :
      '';
    const suffix = fragment.suffix ?
      `,-${encodeURIComponent(fragment.suffix)}` :
      '';
    const textStart = encodeURIComponent(fragment.textStart);
    const textEnd = fragment.textEnd ?
      `,${encodeURIComponent(fragment.textEnd)}` :
      '';
    url = `${url}#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
    if (selection) copyToClipboard(url, selection);
    return url;
  } else {
    return `Could not create URL ${result.status}`;
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(request);

  const message = request.message;
  if (message === 'create-text-fragment') {
    return sendResponse(createTextFragment());
  } else if (message === 'ping') {
    return sendResponse('pong');
  } else {
    // foo
  }
});


// if (msg.color) {
//   console.log("Receive color = " + msg.color);
//   document.body.style.backgroundColor = msg.color;
//   sendResponse("Change color to " + msg.color);
// } else {
//   sendResponse("Color message is none.");
// }