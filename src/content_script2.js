import * as utils from './text-fragment-utils.js';

// const hash = ':~:text=This%20domain,examples&text=in%20literature&text=More%20information...';
const hash = '#:~:text=Яндекс';

const init = () => {
  debugger
  const fragmentDirectives = utils.getFragmentDirectives(hash);
  const parsedFragmentDirectives = utils.parseFragmentDirectives(
    fragmentDirectives,
  );
  const processedFragmentDirectives = utils.processFragmentDirectives(
    parsedFragmentDirectives,
  );
  const createdMarks = processedFragmentDirectives['text'];
  utils.applyTargetTextStyle();
  const firstFoundMatch = createdMarks.find((marks) => marks.length)[0];
  if (firstFoundMatch) {
    console.log()
    window.setTimeout(() => utils.scrollElementIntoView(firstFoundMatch));
  }
};

init();
