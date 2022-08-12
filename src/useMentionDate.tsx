import dayjs from 'dayjs';
import React, { Dispatch, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { appUrl, EntityActionType, GlobalContext } from './Utils';

export default function useMentionDate(props: {
  entityId: string,
  url: string
}) {

  const globalContext = useContext(GlobalContext);

  const query = new URLSearchParams({
    url: props.url,
    entity_id: props.entityId
  });

  return useQuery<Date | null, Error>(`useMentionDate:${query}:${globalContext.apiKey}`, async () => {
    if (!globalContext.apiKey) return null;
    if (!props.entityId) return null;
    if (!props.url) return null;

    return fetch(`${appUrl}/api/entities_mentions/find_by_url_and_entity?${query}`, {
      credentials: 'omit',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Api-Key': globalContext.apiKey,
      },
    }).then((res) => {

      if (res.status === 401) {
        chrome.runtime.sendMessage({ message: 'request-auth' });
      }

      if (!res.ok) throw new Error(res.statusText);

      return res.json();
    }).then((result) => {
      return dayjs(result.mention_date).toDate()
    }).catch((reason) => {
      return null
    });
  });
}
