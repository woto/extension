import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Tab } from "../../../../main";
import { appUrl, GlobalContext } from "../../../Utils";
import DotFlasing from "../../DotFlashing";

export default function GoogleCustomSearch(props: {
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab: Tab | null;
  q: string;
  refetchClicked: boolean;
  setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const globalContext = useContext(GlobalContext);

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    `GoogleCustomSearch:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/google_custom_search?${query}`, {
        credentials: "omit",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Api-Key": globalContext.apiKey,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            chrome.runtime.sendMessage({ message: "request-auth" });
          }

          if (!res.ok) throw new Error(res.statusText);

          return res.json();
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
    { enabled: false }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    props.setIsBusy(isFetching);
  }, [isFetching]);

  useEffect(() => {
    props.setRefetchClicked(false);
    refetch().then();
  }, [props.refetchClicked]);

  if (isLoading) return <DotFlasing />;

  if (error)
    return `An error has occurred: ${
      (error as Record<string, string>).message
    }`;

  const decodedURI = (text?: string | null) => {
    try {
      if (text == null) throw new Error();
      return decodeURI(text);
    } catch (err) {
      return text;
    }
  };

  return (
    <div className="py-3 space-y-7 break-all">
      {data &&
        data.items &&
        data.items.length > 0 &&
        data.items.map((element: any, idx: number) => (
          <div key={idx}>
            <p className="font-medium text-sm mb-1">{element.title}</p>

            <a href={element.link}>
              <p className="text-sm mb-1">{decodedURI(element.link)}</p>
            </a>

            <p className="text-sm mb-1">{element.snippet}</p>

            <img src={element.pagemap?.cse_thumbnail?.[0]?.src} />
          </div>
        ))}
    </div>
  );
}
