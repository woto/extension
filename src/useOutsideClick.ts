import React, { useEffect } from 'react';

export default function useOutsideClick(
  menuRef: React.RefObject<HTMLDivElement>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const listener1 = (evt: any) => {
    if ((evt.target as Node).nodeName === 'ADD-POPUP-COMPONENT') return;
    setIsOpen(false);
  };

  const listener2 = (evt: any) => {
    if (!popup?.shadowRoot?.contains(evt.target as Node)) return
    if (menuRef?.current?.contains(evt.target as Node)) return;
    setIsOpen(false);
  };

  const popup = document.querySelector('add-popup-component');

  useEffect(() => {
    ['click', 'touchstart'].forEach((type) => {
      document.addEventListener(type, listener1);
      popup?.shadowRoot?.addEventListener(type, listener2);
    });

    return () => {
      ['click', 'touchstart'].forEach((type) => {
        document.removeEventListener(type, listener1);
        popup?.shadowRoot?.removeEventListener(type, listener2);
      });
    };
  });
}
