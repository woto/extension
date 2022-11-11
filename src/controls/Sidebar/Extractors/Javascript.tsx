import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Tab } from "../../../../main";
import { appUrl, GlobalContext } from "../../../Utils";
import DotFlasing from "../../DotFlashing";

export default function Javascript(props: {
  setIsBusy: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab: Tab | null;
  q: string;
  refetchClicked: boolean;
  setRefetchClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const globalContext = useContext(GlobalContext);

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    `Javascript:${props.q}:${globalContext.apiKey}`,
    () => {
      const query = new URLSearchParams({
        q: props.q,
      });

      return fetch(`${appUrl}/api/tools/npmjs?${query}`, {
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

  return (
    <div className="py-3 space-y-7 break-all">
      {data?.map((element: any, idx: number) => (
        <div key={idx}>
          <p className="text-sm font-medium mb-1">{element.name}</p>

          <p className="text-sm mb-1">{element.description}</p>

          {element?.links?.repository && (
            <p className="text-sm mb-1">
              <a href={element?.links?.repository}>
                {element?.links?.repository}
              </a>
            </p>
          )}

          {/* { element?.links?.homepage &&
            <p className="text-sm mb-1">
              <a href={element?.links?.homepage}>
                { element?.links?.homepage }
              </a>
            </p>
          } */}

          <p className="text-sm mb-1">
            {element?.maintainers?.map((maintainer: any) => {
              {
                maintainer.username;
              }
            })}
          </p>

          <p className="text-sm mb-1">{element.downloads}</p>
        </div>
      ))}
    </div>
  );
}
