import { findAll } from "highlight-words-core";
import React from "react";

interface IHighlighter {
  activeClassName?: string;
  activeIndex?: number;
  activeStyle?: object;
  autoEscape?: boolean;
  className?: string;
  highlightClassName: string;
  highlightStyle?: object;
  sanitize?: any;
  searchWords: string[];
  textToHighlight: any;
  unhighlightClassName?: string;
  unhighlightStyle?: object;
  caseSensitive?: boolean;
}

/**
 * Highlights all occurrences of search terms (searchText) within a string (textToHighlight).
 * This function returns an array of strings and <span>s (wrapping highlighted words).
 */
export const Highlighter = ({
  activeClassName = "",
  activeIndex = -1,
  activeStyle,
  autoEscape,
  caseSensitive = false,
  className,
  highlightClassName = "",
  highlightStyle = {},
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightClassName = "",
  unhighlightStyle,
}: IHighlighter): JSX.Element => {
  const chunks = findAll({
    autoEscape,
    caseSensitive,
    sanitize,
    searchWords,
    textToHighlight,
  });
  let highlightCount = -1;
  let highlightClassNames = "";
  let highlightStyles;

  if (typeof textToHighlight === "object") return textToHighlight;

  return (
    <span className={className}>
      {chunks.map((chunk, index) => {
        const text = textToHighlight.substr(
          chunk.start,
          chunk.end - chunk.start
        );

        if (chunk.highlight) {
          highlightCount++;

          const isActive = highlightCount === +activeIndex;

          highlightClassNames = `${highlightClassName} ${
            isActive ? activeClassName : ""
          }`;
          highlightStyles =
            isActive === true && activeStyle != null
              ? Object.assign({}, highlightStyle, activeStyle)
              : highlightStyle;

          return (
            <mark
              className={highlightClassNames}
              key={index}
              style={highlightStyles}
            >
              {text}
            </mark>
          );
        } else {
          return (
            <span
              className={unhighlightClassName}
              key={index}
              style={unhighlightStyle}
            >
              {text}
            </span>
          );
        }
      })}
    </span>
  );
};

export default Highlighter;
