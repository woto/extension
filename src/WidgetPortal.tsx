import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export default function WidgetPortal(props: { children: ReactNode }) {
  const el = document
    .querySelector('add-popup-component')!
    .shadowRoot!.querySelector('#widget-portal');
  if (el) {
    return ReactDOM.createPortal(props.children, el);
  }
  return <></>;
}
