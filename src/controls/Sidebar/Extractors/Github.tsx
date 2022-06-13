import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Tab } from '../../../../main';
import DotFlasing from '../../DotFlashing';

export default function Github(props: {
    apiKey: string,
    setIsBusy: React.Dispatch<React.SetStateAction<boolean>>,
    currentTab: Tab | null,
    q: string
}) {
  const {
    isLoading, error, data, isFetching,
  } = useQuery(`Github ${props.q}`, () => {
    props.setIsBusy(true);

    const query = new URLSearchParams({
      q: props.q,
    });

    return fetch(`http://localhost:3000/api/tools/github?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': props.apiKey,
      },
    }).then((result) => {
      if (!result.ok) throw new Error(result.statusText);
      props.setIsBusy(false);
      return result.json();
    }).catch((reason) => {
      // console.log(reason);
      props.setIsBusy(false);
    });
  });

  if (isLoading) return <DotFlasing />;

  if (error) return `An error has occurred: ${(error as Record<string, string>).message}`;

  return (
    <div className="p-3 space-y-3 break-all text-sm">
      <p dangerouslySetInnerHTML={{ __html: data?.readme }} />
    </div>
  );
}
