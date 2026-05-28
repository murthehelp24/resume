"use client";

import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
  className?: string;
  textClassName?: string;
}

export function Typewriter({
  words,
  typingSpeed = 180,
  deletingSpeed = 100,
  delayBetweenWords = 2000,
  className = "",
  textClassName = "",
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isMounted || words.length === 0) return;

    let timer: NodeJS.Timeout;
    const currentFullText = words[currentWordIndex];

    if (isDeleting) {
      if (currentText === "") {
        // Asynchronously transition to the next word
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 300);
      } else {
        // Deleting text
        timer = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === currentFullText) {
        // Always trigger deleting transition to support continuous loop
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenWords);
      } else {
        // Typing text
        timer = setTimeout(() => {
          setCurrentText((prev) => currentFullText.slice(0, prev.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    currentWordIndex,
    words,
    typingSpeed,
    deletingSpeed,
    delayBetweenWords,
    isMounted,
  ]);

  // Prevent hydration mismatch by rendering a static placeholder on first server load
  if (!isMounted) {
    return <span className={`${className} ${textClassName}`}>{words[0]}</span>;
  }

  const lastSpaceIndex = Math.max(currentText.lastIndexOf(" "), currentText.lastIndexOf("\n"));

  return (
    <span className={`inline select-none ${className}`}>
      {lastSpaceIndex === -1 ? (
        <span className="whitespace-nowrap">
          <span className={`${textClassName} whitespace-pre-wrap`}>{currentText}</span>
          <span className="ml-[3px] inline-block w-[3px] h-[0.85em] bg-(--accent) animate-cursor-blink shadow-[0_0_8px_var(--accent)] align-baseline translate-y-[0.05em]" />
        </span>
      ) : (
        <>
          <span className={`${textClassName} whitespace-pre-wrap`}>
            {currentText.slice(0, lastSpaceIndex + 1)}
          </span>
          <span className="whitespace-nowrap">
            <span className={`${textClassName} whitespace-pre-wrap`}>
              {currentText.slice(lastSpaceIndex + 1)}
            </span>
            <span className="ml-[3px] inline-block w-[3px] h-[0.85em] bg-(--accent) animate-cursor-blink shadow-[0_0_8px_var(--accent)] align-baseline translate-y-[0.05em]" />
          </span>
        </>
      )}
    </span>
  );
}
