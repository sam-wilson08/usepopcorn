import { useState } from "react";
import "../src/textExpander.css";

export default function TextApp() {
  return (
    <div>
      <TextExpander>
        Space travel is the ultimate adventure! Imagine soaring past the stars
        and exploring new worlds. It's the stuff of dreams and science fiction,
        but believe it or not, space travel is a real thing. Humans and robots
        are constantly venturing out into the cosmos to uncover its secrets and
        push the boundaries of what's possible.
      </TextExpander>
    </div>
  );
}

function TextExpander({
  children,
  collapsedNumWords = 30,
  expandButtonText = "Show more",
  collapseButtonText = "Show less",
  buttonColor = "blue",
  expanded = false,
  className=""
}) {
  const [expand, setExpand] = useState(expanded);
  const message = expand ? collapseButtonText : expandButtonText;

  function expandHandler() {
    setExpand(!expand);
  }

  const textStyle = {
    color: buttonColor,
    cursor: "pointer",
  };

  return (
    <div className={className}>
      {expand ? (
        <p>{children}</p>
      ) : (
        <p>
          {children.length <= collapsedNumWords
            ? children
            : children.slice(0, 100) + "..."}
        </p>
      )}
      <p style={textStyle} onClick={expandHandler}>
        {message}
      </p>
    </div>
  );
}
