import React, { useEffect, useRef, useState } from "react";
import { stopPropagation } from "../../Utils";

export default function Textarea(props: {
  value: string;
  setValue: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: any) => void;
  className: string;
  placeholder: string;
  minRows?: number;
  maxRows?: number;
}) {
  const minRows = props.minRows || 1;
  const maxRows = props.maxRows || 4;

  const ref = useRef<HTMLTextAreaElement>(null);
  const [rows, setRows] = useState(minRows);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.setValue(event.target.value);
  };

  useEffect(() => {
    if (!ref.current) return;

    const textareaLineHeight = 20;

    const previousRows = ref.current.rows;
    ref.current.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(ref.current.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      ref.current.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      ref.current.rows = maxRows;
      ref.current.scrollTop = ref.current.scrollHeight;
    }

    setRows(currentRows < maxRows ? currentRows : maxRows);
  }, [props.value]);

  return (
    <textarea
      ref={ref}
      value={props.value}
      rows={rows}
      placeholder={props.placeholder}
      onBlur={(e) => (props.onBlur ? props.onBlur(e) : () => {})}
      onChange={handleChange}
      className={props.className}
      onKeyDown={props.onKeyDown}
      onKeyPress={stopPropagation}
      onKeyUp={stopPropagation}
    />
  );
}
