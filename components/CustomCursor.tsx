import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (mouse)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setIsVisible(true);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      const dotSpeed = 0.5;
      const outlineSpeed = 0.15;

      dotX += (mouseX - dotX) * dotSpeed;
      dotY += (mouseY - dotY) * dotSpeed;
      
      outlineX += (mouseX - outlineX) * outlineSpeed;
      outlineY += (mouseY - outlineY) * outlineSpeed;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMouseMove);

    // Hover effects
    const handleMouseEnter = () => outlineRef.current?.classList.add("scale-[1.5]", "opacity-50");
    const handleMouseLeave = () => outlineRef.current?.classList.remove("scale-[1.5]", "opacity-50");
    
    const handleTextEnter = () => {
      if (outlineRef.current) {
        outlineRef.current.classList.add("w-1", "h-8", "rounded-sm", "bg-primary", "border-none", "opacity-70");
      }
    };
    const handleTextLeave = () => {
      if (outlineRef.current) {
        outlineRef.current.classList.remove("w-1", "h-8", "rounded-sm", "bg-primary", "border-none", "opacity-70");
      }
    };

    const addListeners = () => {
      document.querySelectorAll("a, button, input, .interactive").forEach(el => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
      document.querySelectorAll("p, h1, h2, h3, span, li").forEach(el => {
        el.addEventListener("mouseenter", handleTextEnter);
        el.addEventListener("mouseleave", handleTextLeave);
      });
    };

    // Re-run listener attachment periodically or on mutation could be better, 
    // but for this simple app, a delayed one-off or periodic check works.
    setTimeout(addListeners, 1000);
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="pointer-events-none fixed top-0 left-0 w-2 h-2 bg-primary rounded-full z-[9999]"
      />
      <div 
        ref={outlineRef} 
        className="pointer-events-none fixed top-0 left-0 w-10 h-10 border-2 border-primary rounded-full z-[9999] transition-all duration-150 ease-out"
      />
    </>
  );
};

export default CustomCursor;