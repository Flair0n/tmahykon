import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.children;
    gsap.fromTo(
      targets,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: animationDuration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger]);

  // Split children into spans for stagger effect
  const chars = typeof children === "string" ? children.split("") : children;
  return (
    <span ref={ref} style={{ display: "inline-block", whiteSpace: "pre-wrap" }}>
      {Array.isArray(chars)
        ? chars.map((c, i) => (
            <span key={i} style={{ display: "inline-block" }}>{c}</span>
          ))
        : chars}
    </span>
  );
};

export default ScrollFloat;
