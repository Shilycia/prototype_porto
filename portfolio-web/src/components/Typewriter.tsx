'use client';

import { useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;        // ms per character
  startDelay?: number;   // ms before typing begins (after entering viewport)
  cursor?: boolean;
}

export default function Typewriter({
  text,
  className = '',
  speed = 38,
  startDelay = 200,
  cursor = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Trigger when section enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  // Typewriter loop
  useEffect(() => {
    if (!started) return;

    let i = 0;
    setDisplayed('');
    setDone(false);

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [started, text, speed, startDelay]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {cursor && (
        <span
          className={`inline-block w-[2px] h-[1em] ml-[2px] align-middle bg-purple-400 rounded-sm ${
            done ? 'animate-pulse' : 'opacity-100'
          }`}
          style={{ verticalAlign: 'middle' }}
        />
      )}
    </span>
  );
}
