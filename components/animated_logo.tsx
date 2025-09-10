// components/AnimatedSVG.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedSVG: React.FC = () => {
  const svgRef = useRef<HTMLImageElement | null>(null); // Changed type here
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const animation = gsap.to(svg, {
      scale: 0.3,
      x: -window.innerWidth / 2 + 40,
      y: -window.innerHeight / 2 + 40,
      ease: "power1.out",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=300",
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
    });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[100vh]">

      <div className="fixed inset-0 flex justify-center items-center z-0 pointer-events-none">
        <img
          ref={svgRef}
          src="/logo_black.svg" // Your SVG path here
          alt="My Logo"
        />
      </div>

      <div className="h-[150vh]"></div>
    </div>
  );
};

export default AnimatedSVG;
