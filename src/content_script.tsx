import 'react-devtools';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import React from 'react';
import ReactDOM from 'react-dom';
import tailwind from './tailwind.css';
import App from './App';

class PopupComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    mountPoint.style.zIndex = '2147483647';
    mountPoint.style.position = 'fixed';
    mountPoint.style.left = '0';
    mountPoint.style.top = '0';
    mountPoint.style.width = '0';
    mountPoint.style.height = '0';
    // mountPoint.style.transform = 'translate(-10%, -10%)';
    // mountPoint.className = 'w-[320px]';
    if (!this.shadowRoot) return;
    this.shadowRoot.appendChild(mountPoint);
    tailwind.use({ target: this.shadowRoot });

    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      mountPoint,
    );
  }
}
customElements.define('popup-component', PopupComponent);

document.body.insertAdjacentHTML('afterbegin', '<popup-component></popup-component>');
