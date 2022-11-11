import React from "react";

export default function Tags(props: { children: React.ReactNode }) {
  // console.log(props.children);

  return <ul className="mt-2 leading-7">{props.children}</ul>;
}
