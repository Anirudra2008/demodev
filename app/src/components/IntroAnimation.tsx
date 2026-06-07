import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────────────────────────
   IntroAnimation — Full-screen cinematic intro overlay
   ─────────────────────────────────────────────────────────────── */

interface IntroAnimationProps {
  onComplete: () => void;
}

/* Generates random floating particle positions */
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));
}

const PARTICLES = generateParticles(40);

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  const [, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Lock scrolling during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = originalOverflow;
        onComplete();
      },
    });

    /* Phase 1 — Particle fade in + background glow */
    tl.fromTo(
      overlayRef.current,
      { opacity: 1 },
      { opacity: 1, duration: 0.05 }
    );

    tl.fromTo(
      innerGlowRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
      0.05
    );

    tl.fromTo(
      particlesRef.current?.children ? Array.from(particlesRef.current.children) : [],
      { opacity: 0, scale: 0 },
      {
        opacity: 0.6,
        scale: 1,
        duration: 0.4,
        stagger: { each: 0.012, from: "random" },
        ease: "back.out(1.4)",
      },
      0.1
    );

    /* Phase 2 — Pulse ring expands */
    tl.fromTo(
      pulseRingRef.current,
      { opacity: 0.8, scale: 0.2 },
      { opacity: 0, scale: 3, duration: 0.7, ease: "power2.out" },
      0.3
    );

    /* Phase 3 — Logo reveals with scale + rotation */
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.3, rotateY: -90, filter: "blur(12px)" },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power3.out",
      },
      0.2
    );

    /* Phase 4 — Decorative lines sweep in from center */
    tl.fromTo(
      lineLeftRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
      0.5
    );
    tl.fromTo(
      lineRightRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
      0.5
    );

    /* Phase 5 — Tagline text reveals */
    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 14, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out",
      },
      0.65
    );

    /* Phase 6 — Hold for a beat */
    tl.to({}, { duration: 0.35 });

    /* Phase 7 — Logo shrinks and fades */
    tl.to(logoRef.current, {
      scale: 0.8,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.3,
      ease: "power2.in",
    });
    tl.to(
      taglineRef.current,
      { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" },
      "<"
    );
    tl.to(
      [lineLeftRef.current, lineRightRef.current],
      { scaleX: 0, opacity: 0, duration: 0.25, ease: "power2.in" },
      "<"
    );

    /* Phase 8 — Particles scatter outward */
    tl.to(
      particlesRef.current?.children ? Array.from(particlesRef.current.children) : [],
      {
        opacity: 0,
        scale: 2,
        duration: 0.3,
        stagger: { each: 0.008, from: "center" },
        ease: "power2.in",
      },
      "<"
    );

    /* Phase 9 — Curtain split reveal */
    tl.to(curtainTopRef.current, {
      yPercent: -100,
      duration: 0.55,
      ease: "power4.inOut",
    });
    tl.to(
      curtainBottomRef.current,
      {
        yPercent: 100,
        duration: 0.55,
        ease: "power4.inOut",
      },
      "<"
    );

    /* Phase 10 — Full overlay fades and removes */
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
      document.body.style.overflow = originalOverflow;
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="intro-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "all",
      }}
    >
      {/* ── Top curtain half ── */}
      <div
        ref={curtainTopRef}
        className="intro-curtain intro-curtain--top"
      />

      {/* ── Bottom curtain half ── */}
      <div
        ref={curtainBottomRef}
        className="intro-curtain intro-curtain--bottom"
      />

      {/* ── Inner radial glow ── */}
      <div ref={innerGlowRef} className="intro-glow" />

      {/* ── Pulse ring ── */}
      <div ref={pulseRingRef} className="intro-pulse-ring" />

      {/* ── Floating particles ── */}
      <div ref={particlesRef} className="intro-particles">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="intro-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* ── Center content ── */}
      <div className="intro-center">
        {/* Decorative line — left */}
        <div
          ref={lineLeftRef}
          className="intro-line intro-line--left"
        />

        {/* Logo mark */}
        <div ref={logoRef} className="intro-logo">
          <div className="intro-logo-circle">
            <span className="intro-logo-text">MC</span>
          </div>
          <h1 className="intro-logo-name">Medicutis</h1>
        </div>

        {/* Tagline */}
        <p ref={taglineRef} className="intro-tagline">
          Advanced Dermatology &amp; Aesthetics
        </p>

        {/* Decorative line — right */}
        <div
          ref={lineRightRef}
          className="intro-line intro-line--right"
        />
      </div>
    </div>
  );
}
