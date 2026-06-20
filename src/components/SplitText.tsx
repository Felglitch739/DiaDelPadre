import React from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
}

export default function SplitText({
  children,
  className = "",
  wordClassName = "",
  charClassName = "",
}: SplitTextProps) {
  const words = children.split(" ");

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className={`inline-block whitespace-nowrap ${wordClassName}`}
          style={{ marginRight: wordIndex === words.length - 1 ? "0" : "0.25em" }}
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className={`inline-block split-char ${charClassName}`}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
