"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollEffect } from "./ScrollEffectContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ParallaxLayer({
  speed = 0.5,
  children,
  className,
}: {
  speed?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div style={{ y }} className="relative w-full h-full">
        {children}
      </motion.div>
    </div>
  );
}

export function ClipPathReveal({
  shape = "inset",
  children,
  className,
}: {
  shape?: "circle" | "inset";
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.3"],
  });

  const clipPath =
    shape === "circle"
      ? useTransform(scrollYProgress, [0, 1], [
          "circle(0% at 50% 50%)",
          "circle(100% at 50% 50%)",
        ])
      : useTransform(scrollYProgress, [0, 1], [
          "inset(0% 0% 100% 0%)",
          "inset(0% 0% 0% 0%)",
        ]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath }}>{children}</motion.div>
    </div>
  );
}

export function StaggeredTextReveal({
  text,
  className,
  staggerDelay = 0.03,
}: {
  text: string;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
        hidden: {},
      }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function ZoomOutCover({
  children,
  className,
  initialScale = 1.15,
}: {
  children: ReactNode;
  className?: string;
  initialScale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [initialScale, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity }}>{children}</motion.div>
    </div>
  );
}

export function StickyPinSection({
  children,
  className,
  pinDuration = "200vh",
}: {
  children: ReactNode;
  className?: string;
  pinDuration?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    stRef.current = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: pinDuration,
      pin: true,
      pinSpacing: true,
    });

    return () => {
      stRef.current?.kill();
    };
  }, [pinDuration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function SlideInFromSide({
  index = 0,
  children,
  className,
  rotate = 0,
}: {
  index?: number;
  children: ReactNode;
  className?: string;
  rotate?: number;
}) {
  const direction = index % 2 === 0 ? -80 : 80;

  return (
    <motion.div
      initial={{ opacity: 0, x: direction, rotate }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgressLine({
  color,
  className,
  height = 2,
}: {
  color: string;
  className?: string;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{
          scaleX,
          height,
          backgroundColor: color,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}

export function FadeScaleSection({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BorderDrawReveal({
  children,
  className,
  color,
  padding = 8,
}: {
  children: ReactNode;
  className?: string;
  color: string;
  padding?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        clipPath: `inset(${padding}% ${padding}% ${padding}% ${padding}% round 2px)`,
      }}
      whileInView={{
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0% round 2px)",
      }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={{ border: `2px solid ${color}` }}
    >
      {children}
    </motion.div>
  );
}

export function HorizontalScrollSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroll = scrollRef.current;
    if (!container || !scroll) return;

    const totalWidth = scroll.scrollWidth - container.offsetWidth;

    const tween = gsap.to(scroll, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
        pinSpacing: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "hidden" }}
    >
      <div
        ref={scrollRef}
        className="flex gap-3"
        style={{ width: "max-content" }}
      >
        {children}
      </div>
    </div>
  );
}

export function SectionReveal({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const { effectType, primaryColor } = useScrollEffect();

  switch (effectType) {
    case "modern":
      return (
        <ClipPathReveal shape="inset" className={className}>
          {children}
        </ClipPathReveal>
      );
    case "minimalist":
      return (
        <FadeScaleSection className={className} delay={index * 0.1}>
          {children}
        </FadeScaleSection>
      );
    case "rustic":
      return (
        <SlideInFromSide
          index={index}
          rotate={index % 2 === 0 ? -1.5 : 1.5}
          className={className}
        >
          {children}
        </SlideInFromSide>
      );
    case "traditional":
      return (
        <motion.div
          initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
          whileInView={{
            opacity: 1,
            clipPath: "circle(100% at 50% 50%)",
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={className}
        >
          {children}
        </motion.div>
      );
    default:
      return (
        <FadeScaleSection className={className}>
          {children}
        </FadeScaleSection>
      );
  }
}

export function CardReveal({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const { effectType, primaryColor } = useScrollEffect();

  switch (effectType) {
    case "modern":
      return (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={className}
        >
          {children}
        </motion.div>
      );
    case "minimalist":
      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.12 }}
          className={className}
        >
          {children}
        </motion.div>
      );
    case "rustic":
      return (
        <SlideInFromSide
          index={index}
          rotate={index % 2 === 0 ? -2 : 2}
          className={className}
        >
          {children}
        </SlideInFromSide>
      );
    case "traditional":
      return (
        <motion.div
          initial={{ opacity: 0, clipPath: "circle(0% at 50% 50%)" }}
          whileInView={{
            opacity: 1,
            clipPath: "circle(100% at 50% 50%)",
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={className}
        >
          {children}
        </motion.div>
      );
    default:
      return <div className={className}>{children}</div>;
  }
}

export function HeaderReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { effectType, primaryColor } = useScrollEffect();

  switch (effectType) {
    case "modern":
      return (
        <ClipPathReveal shape="inset" className={className}>
          {children}
        </ClipPathReveal>
      );
    case "minimalist":
      return (
        <div className={className}>
          <FadeScaleSection>{children}</FadeScaleSection>
          <ScrollProgressLine
            color={primaryColor}
            className="max-w-xs mx-auto mt-4"
          />
        </div>
      );
    case "rustic":
      return (
        <FadeScaleSection className={className}>
          {children}
        </FadeScaleSection>
      );
    case "traditional":
      return (
        <BorderDrawReveal
          color={primaryColor}
          className={className}
          padding={3}
        >
          {children}
        </BorderDrawReveal>
      );
    default:
      return <div className={className}>{children}</div>;
  }
}
