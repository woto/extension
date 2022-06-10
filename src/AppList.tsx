import React, { useEffect, useState } from 'react';
// @ts-ignore
import * as utils from './text-fragment-utils.js';

// // const hash = ':~:text=This%20domain,examples&text=in%20literature&text=More%20information...';
const hash = '#:~:text=Яндекс';

const init = () => {
  const fragmentDirectives = utils.getFragmentDirectives(hash);
  const parsedFragmentDirectives = utils.parseFragmentDirectives(
    fragmentDirectives,
  );
  const processedFragmentDirectives = utils.processFragmentDirectives(
    parsedFragmentDirectives,
  );
  const createdMarks = processedFragmentDirectives.text;
  utils.applyTargetTextStyle();
  const firstFoundMatch = createdMarks.find((marks: any) => marks.length)[0];
  if (firstFoundMatch) {
    // console.log()
    window.setTimeout(() => utils.scrollElementIntoView(firstFoundMatch));
  }
};

function AppList() {
  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { message, feature } = request;
      if (message === 'list-fragments') {
        init();
        return sendResponse();
      } if (feature === 'list' && message === 'ping') {
        return sendResponse('pong');
      }
    });
    return () => {
      chrome.runtime.onMessage.removeListener(() => {
      });
    };
  }, []);

  // useEffect(() => {

  // }, [])

  return (
    <div className="absolute w-52 h-52 top-0 left-0 bg-slate-100 content-center flex flex-col">
      123
    </div>
  );
}

export default AppList;
