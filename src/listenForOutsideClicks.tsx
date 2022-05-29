import React from 'react';

export default function listenForOutsideClicks(
  listening: any,
  setListening: any,
  menuRef: any,
  setIsOpen: any,
) {
  return () => {
    if (listening) return;
    if (!menuRef.current) return;
    setListening(true);

    ['click', 'touchstart'].forEach((type) => {
      const popup = document.querySelector('popup-component');
      popup && popup.shadowRoot
        && popup.shadowRoot.addEventListener('click', (evt) => {
          const cur = menuRef.current;
          const node = evt.target;
          if (cur && node && cur.contains(node)) return;
          setIsOpen(false);
        });
    });
  };
}
