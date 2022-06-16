import React, { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import DotFlasing from '../../DotFlashing';

export default function YandexXML(props: {
  apiKey: string,
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
  currentTab: Tab | null,
  q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`YandexXML ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`http://localhost:3000/api/tools/yandex_xml?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/xml',
        'Api-Key': props.apiKey,
      },
    }).then((result) => {
      if (!result.ok) throw new Error(result.statusText);
      props.setIsBusy(false);
      return result.text();
    }).then((result) => {
      let parser = new DOMParser();
      let xml = parser.parseFromString(result, "application/xml");
      return xml.querySelectorAll('doc');
    }).catch((reason) => {
      // console.log(reason);
      props.setIsBusy(false);
    });
  });

  if (isLoading) return <DotFlasing />;

  if (error) return `An error has occurred: ${(error as Record<string, string>).message}`;

  return (
    <div className="overflow-auto p-3 space-y-7 break-all">
      { Array.from(data!).map((item, idx) => {
        return (
          <div key={idx}>
            <p className="font-medium text-sm mb-1">{item.querySelector('title')?.textContent!}</p>
            <a href={item.querySelector('url')?.textContent!}>
              <p className="text-sm mb-1">{decodeURI(item.querySelector('url')?.textContent!)}</p>
            </a>
            <p className="text-sm mb-1">{item.querySelector('headline')?.textContent!}</p>
            <p className="text-sm mb-1">{item.querySelector('passages')?.textContent!}</p>
          </div>
        )
      }) }
    </div>
  );
}