import 'react-devtools';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  // useQuery,
  // useMutation,
  // useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import tailwind from './tailwind.css';
import AppAdd from './AppAdd';
import { ToastProvider } from './ToastManager';

const queryClient = new QueryClient({
  // defaultOptions: {
  //   queries: {
  //     refetchOnWindowFocus: false
  //   }
  // }
});

class AddPopupComponent extends HTMLElement {
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

    const root = ReactDOM.createRoot(mountPoint);

    if (!this.shadowRoot) return;

    this.shadowRoot.appendChild(mountPoint);

    tailwind.use({ target: this.shadowRoot });

    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <AppAdd />
            <div id="widget-portal" />
          </ToastProvider>
        </QueryClientProvider>
      </React.StrictMode>,
    );
  }
}

const placement = document.documentElement;

customElements.define('add-popup-component', AddPopupComponent);

// customElements.get('add-popup-component')

const component = document.createElement('add-popup-component');

// document.body.insertAdjacentHTML('afterbegin', '<add-popup-component></add-popup-component>');

const subscription = (
  request: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  const { message, feature } = request;

  if (feature === 'add' && message === 'ping') {
    if (!placement.contains(component)) {
      placement.insertAdjacentElement('afterbegin', component);
    }

    return sendResponse('pong');
    // let result = ReactDOM.unmountComponentAtNode(mountPoint);
    // console.log('result:', result);
    // let element = document.querySelector('add-popup-component');
    // element?.remove();
  }
};

// The beforeend is due the fact of using #:~:text=...
// If 'afterbegin' used then it will highlight text in widget. Not in the document.
placement.insertAdjacentElement('beforeend', component);
// placement.insertAdjacentElement('afterbegin', component);

chrome.runtime.onMessage.addListener(subscription);
