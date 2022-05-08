import 'react-devtools';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import tailwind from './tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

class PopupComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const mountPoint = document.createElement("div");
    mountPoint.style.zIndex = '2147483647';
    mountPoint.style.position = 'absolute';
    // mountPoint.style.left = '10px';
    // mountPoint.style.top = '10px';
    // mountPoint.style.transform = 'translate(-10%, -10%)';
    // mountPoint.className = 'w-[320px]';
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(mountPoint);
    tailwind.use({ target: this.shadowRoot });

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      mountPoint
    );
  }
}
customElements.define('popup-component', PopupComponent);

document.body.insertAdjacentHTML('afterbegin', "<popup-component></popup-component>");