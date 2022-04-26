import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import tailwind from './tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const fgu = require('./fragment-generation-utils');

const body = document.querySelector('body');

class PopupComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    mountPoint.style.zIndex = '2147483647';
    mountPoint.style.position = 'fixed';
    mountPoint.style.left = '50%';
    mountPoint.style.top = '50%';
    mountPoint.style.transform = 'translate(-50%, -50%)';
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(mountPoint);
    tailwind.use({ target: this.shadowRoot });

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      mountPoint
      // document.getElementById('root')
    );
  }
}
customElements.define('popup-component', PopupComponent);

// class XSearch extends HTMLElement {
//   connectedCallback() {
//     const mountPoint = document.createElement('span');
//     this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

//     const name = this.getAttribute('name');
//     const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
//     const root = ReactDOM.createRoot(mountPoint);
//     root.render(<a href={url}>{name}</a>);
//   }
// }
// customElements.define('x-search', XSearch);

if (body) {
  body.insertAdjacentHTML('afterbegin', "<popup-component></popup-component>");
}

// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       'x-search': unknown
//     }
//   }
// }


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