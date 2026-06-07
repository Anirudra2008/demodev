import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { ArrowRight, Clock, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from "lenis";
import IntroAnimation from "./components/IntroAnimation";

gsap.registerPlugin(ScrollToPlugin);

/* ─────────────────── live IST clock hook ─────────────────── */
function useISTTime() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(ist);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

/* ───────────────────── TextRoll component ───────────────────── */
function TextRoll({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`flex flex-col overflow-hidden h-[20px] leading-[20px] ${className}`}
    >
      <span className="group-hover:-translate-y-1/2 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        <span className="block h-[20px]">{text}</span>
        <span className="block h-[20px]">{text}</span>
      </span>
    </span>
  );
}

/* ──────────────────────── Starburst SVG ─────────────────────── */
function StarburstIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
    >
      <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
    </svg>
  );
}

/* ══════════════════════ GALLERY SLIDER ══════════════════════ */
const GALLERY_CARDS = [
  {
    id: 1,
    label: "Dermatologist",
    descriptor: "Expert skin diagnosis & care",
    image: "/gallery-dermatologist.jpg",
    alt: "Dermatologist treatment",
  },
  {
    id: 2,
    label: "Hair",
    descriptor: "Advanced scalp & hair restoration",
    image: "/gallery-hair.jpg",
    alt: "Hair treatment",
  },
  {
    id: 3,
    label: "Lasers",
    descriptor: "Precision laser skin resurfacing",
    image: "/gallery-lasers.jpg",
    alt: "Laser skin treatment",
  },
  {
    id: 4,
    label: "Botox",
    descriptor: "Refined wrinkle & line correction",
    image: "/gallery-botox.jpg",
    alt: "Botox treatment",
  },
  {
    id: 5,
    label: "Aesthetics",
    descriptor: "Luxury facial aesthetic treatments",
    image: "/gallery-aesthetics.jpg",
    alt: "Aesthetics treatment",
  },
  {
    id: 6,
    label: "Weight Loss",
    descriptor: "Medical weight management programs",
    image: "/gallery-weight-loss.jpg",
    alt: "Weight loss treatment",
  },
  {
    id: 7,
    label: "Antiaging & Glutathione IV",
    descriptor: "Luxury wellness IV infusion therapy",
    image: "/gallery-iv-antiaging.jpg",
    alt: "Antiaging and Glutathione IV treatment",
  },
];

function GallerySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const trackRef = useRef<HTMLDivElement>(null);

  const totalCards = GALLERY_CARDS.length;

  /* Responsive visible count */
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w >= 1200) setVisibleCount(3);
      else if (w >= 768) setVisibleCount(2);
      else setVisibleCount(1);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  /* Extended cards: clone first `visibleCount` at the end for seamless loop */
  const extendedCards = useMemo(
    () => [...GALLERY_CARDS, ...GALLERY_CARDS.slice(0, visibleCount)],
    [visibleCount],
  );

  /* Clamp index on resize */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex((prev) => Math.min(prev, totalCards));
  }, [visibleCount, totalCards]);

  /* Ref to always hold latest index — avoids stale closures in the interval */
  const currentIndexRef = useRef(currentIndex);
  const transitionEnabledRef = useRef(transitionEnabled);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    transitionEnabledRef.current = transitionEnabled;
  }, [transitionEnabled]);

  /* Auto-scroll: steady 1s tick using a ref-based interval.
     The interval never resets on state changes — it ticks continuously
     so there is zero dead time at the loop boundary. */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= totalCards) return prev; // snap-back is in progress
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalCards]);

  /* Seamless loop: when reaching clone boundary, snap back to 0 instantly */
  useEffect(() => {
    if (currentIndex < totalCards) return;
    const track = trackRef.current;
    let snapped = false;
    const doSnap = () => {
      if (snapped) return;
      snapped = true;
      setTransitionEnabled(false);
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    };
    if (track) {
      track.addEventListener("transitionend", doSnap, { once: true });
    }
    /* Fallback: tighter than before — 520ms matches the 500ms CSS transition */
    const fallback = setTimeout(doSnap, 520);
    return () => {
      if (track) track.removeEventListener("transitionend", doSnap);
      clearTimeout(fallback);
    };
  }, [currentIndex, totalCards]);

  /* Navigate to specific slide (dot clicks) */
  const goTo = useCallback(
    (idx: number) =>
      setCurrentIndex(Math.max(0, Math.min(idx, totalCards - 1))),
    [totalCards],
  );

  /* Render parameters */
  const transformStyle = `translateX(${-(currentIndex * (100 / visibleCount))}%)`;
  const shouldTransition = transitionEnabled;
  const dotIndex = currentIndex % totalCards;

  return (
    <div className="gallery-slider-root">
      <div className="gallery-slider-outer">
        <div
          className="gallery-track-viewport"
        >
          <div
            className="gallery-track"
            ref={trackRef}
            style={{
              transform: transformStyle,
              transition: shouldTransition
                ? "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
            }}
          >
            {extendedCards.map((card, idx) => (
              <div key={`${card.id}-${idx}`} className="gallery-card-slot">
                <div className="gallery-card">
                  {/* Image area — 65% */}
                  <div className="gallery-card-img-wrap">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="lazy"
                      className="gallery-card-img"
                    />
                  </div>
                  {/* Text area — 35% */}
                  <div className="gallery-card-body">
                    <p className="gallery-card-label">{card.label}</p>
                    <p className="gallery-card-desc">{card.descriptor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOT INDICATORS — one per original card */}
      <div className="gallery-dots" role="tablist" aria-label="Slide position">
        {GALLERY_CARDS.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === dotIndex}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`gallery-dot${
              i === dotIndex ? " gallery-dot-active" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ REVIEWS SECTION ══════════════════════ */
function ReviewsSection() {
  const starBars = [
    { label: "5", pct: "90%" },
    { label: "4", pct: "5%" },
    { label: "3", pct: "2%" },
    { label: "2", pct: "1%" },
    { label: "1", pct: "2%" },
  ];

  return (
    <section id="reviews" aria-label="Customer Reviews Section">
      <div className="rv-container">
        {/* ── Summary Block ── */}
        <div className="rv-summary">
          <h2 className="rv-section-title">Reviews</h2>

          <div className="rv-rating-block">
            <span className="rv-rating-number">4.9</span>
            <span className="rv-stars-row" aria-label="5 out of 5 stars">
              ★★★★★
            </span>
          </div>

          <p className="rv-review-count">Based on 1,216 verified reviews</p>

          {/* Star distribution bars */}
          <div
            className="rv-bars"
            role="list"
            aria-label="Star rating distribution"
          >
            {starBars.map((bar) => (
              <div key={bar.label} className="rv-bar-row" role="listitem">
                <span className="rv-bar-label">
                  {bar.label}
                  <span className="rv-bar-label-star" aria-hidden="true">
                    ★
                  </span>
                </span>
                <div
                  className="rv-bar-track"
                  aria-label={`${bar.label} star: ${bar.pct}`}
                >
                  <div className="rv-bar-fill" style={{ width: bar.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="rv-grid">
          {/* Card 1 — Featured */}
          <article
            className="rv-card rv-card--featured"
            aria-label="Featured review by Happy Patient"
          >
            <span className="rv-quote-deco" aria-hidden="true">
              &ldquo;
            </span>
            <div className="rv-card-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="rv-card-quote">
              &ldquo;Very much clean, hygienic and soothing{" "}
              <strong>place</strong> with best <strong>doctors</strong> in their
              field.&rdquo;
            </p>
            <div className="rv-card-footer">
              <div className="rv-avatar">
                <img
                  src="https://i.pravatar.cc/60?img=12"
                  alt="Happy Patient profile photo"
                  loading="lazy"
                  width="60"
                  height="60"
                />
              </div>
              <div>
                <p className="rv-reviewer-name">Happy Patient</p>
                <p className="rv-reviewer-label">Google Review · Verified</p>
              </div>
            </div>
          </article>

          {/* Card 2 — Medium */}
          <article className="rv-card" aria-label="Review by N.">
            <span className="rv-quote-deco" aria-hidden="true">
              &ldquo;
            </span>
            <div className="rv-card-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="rv-card-quote">
              &ldquo;Excellent <strong>service</strong>, great value for{" "}
              <strong>money</strong> – I highly recommend this clinic!&rdquo;
            </p>
            <div className="rv-card-footer">
              <div
                className="rv-avatar rv-avatar--blue rv-avatar--letter"
                aria-label="Reviewer initial N"
              >
                N
              </div>
              <div>
                <p className="rv-reviewer-name">N.</p>
                <p className="rv-reviewer-label">Google Review · Verified</p>
              </div>
            </div>
          </article>

          {/* Card 3 — Medium */}
          <article className="rv-card" aria-label="Review by D.">
            <span className="rv-quote-deco" aria-hidden="true">
              &ldquo;
            </span>
            <div className="rv-card-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="rv-card-quote">
              &ldquo;Very nice <strong>doctor listens</strong> very patiently,
              doesn&apos;t prescribe unnecessary <strong>antibiotics</strong>
              .&rdquo;
            </p>
            <div className="rv-card-footer">
              <div
                className="rv-avatar rv-avatar--purple rv-avatar--letter"
                aria-label="Reviewer initial D"
              >
                D
              </div>
              <div>
                <p className="rv-reviewer-name">D.</p>
                <p className="rv-reviewer-label">Google Review · Verified</p>
              </div>
            </div>
          </article>

          {/* Card 4 — Medium */}
          <article className="rv-card" aria-label="Review by S.">
            <span className="rv-quote-deco" aria-hidden="true">
              &ldquo;
            </span>
            <div className="rv-card-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="rv-card-quote">
              &ldquo;The staff is incredibly <strong>professional</strong> and
              the results exceeded my expectations. Truly{" "}
              <strong>world-class</strong> treatment.&rdquo;
            </p>
            <div className="rv-card-footer">
              <div
                className="rv-avatar rv-avatar--green rv-avatar--letter"
                aria-label="Reviewer initial S"
              >
                S
              </div>
              <div>
                <p className="rv-reviewer-name">S.</p>
                <p className="rv-reviewer-label">Google Review · Verified</p>
              </div>
            </div>
          </article>

          {/* Card 5 — Medium */}
          <article className="rv-card" aria-label="Review by R.">
            <span className="rv-quote-deco" aria-hidden="true">
              &ldquo;
            </span>
            <div className="rv-card-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="rv-card-quote">
              &ldquo;Highly recommend Dr. Mehta — absolutely{" "}
              <strong>transformed</strong> my skin. The laser treatment was{" "}
              <strong>painless</strong> and effective.&rdquo;
            </p>
            <div className="rv-card-footer">
              <div
                className="rv-avatar rv-avatar--amber rv-avatar--letter"
                aria-label="Reviewer initial R"
              >
                R
              </div>
              <div>
                <p className="rv-reviewer-name">R.</p>
                <p className="rv-reviewer-label">Google Review · Verified</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const DROPLETS_DATA = [
  {
    id: 1,
    width: 22,
    height: 22,
    top: -18,
    left: "18%",
    duration: "4s",
    delay: "0s",
  },
  {
    id: 2,
    width: 14,
    height: 14,
    top: -28,
    left: "32%",
    duration: "3s",
    delay: "0.5s",
  },
  {
    id: 3,
    width: 18,
    height: 18,
    top: -22,
    left: "48%",
    duration: "5s",
    delay: "1s",
  },
  {
    id: 4,
    width: 10,
    height: 10,
    top: -35,
    left: "61%",
    duration: "3.5s",
    delay: "1.5s",
  },
  {
    id: 5,
    width: 26,
    height: 26,
    top: -12,
    right: "22%",
    duration: "6s",
    delay: "0.2s",
  },
  {
    id: 6,
    width: 12,
    height: 12,
    bottom: -20,
    left: "25%",
    duration: "4.5s",
    delay: "2s",
  },
  {
    id: 7,
    width: 20,
    height: 20,
    bottom: -28,
    left: "45%",
    duration: "5.5s",
    delay: "0.8s",
  },
  {
    id: 8,
    width: 8,
    height: 8,
    bottom: -18,
    left: "60%",
    duration: "3.2s",
    delay: "2.4s",
  },
  {
    id: 9,
    width: 16,
    height: 16,
    bottom: -14,
    right: "28%",
    duration: "4.8s",
    delay: "1.2s",
  },
  {
    id: 10,
    width: 11,
    height: 11,
    top: -30,
    right: "38%",
    duration: "3.8s",
    delay: "1.8s",
  },
];

/* ══════════════════════ DEPARTMENTS SECTION ══════════════════════ */
const DEPARTMENTS = [
  {
    id: "dermatologist",
    label: "Dermatologist",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <circle cx="32" cy="26" r="14" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="27" cy="24" r="2" fill="currentColor" />
        <circle cx="37" cy="24" r="2" fill="currentColor" />
        <path d="M27 32 Q32 38 37 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M18 50 C18 42 46 42 46 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "hair",
    label: "Hair",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <circle cx="32" cy="11" r="3.5" fill="currentColor" />
        <path d="M21 54 C19 42 17 28 23 16 C26 12 30 10 32 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M32 54 L32 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M43 54 C45 42 47 28 41 16 C38 12 34 10 32 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "lasers",
    label: "Lasers",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <circle cx="32" cy="32" r="9" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
        <line x1="32" y1="8" x2="32" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="46" x2="32" y2="56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="32" x2="18" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="46" y1="32" x2="56" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="15" y1="15" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="42" x2="49" y2="49" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="49" y1="15" x2="42" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="42" x2="15" y2="49" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "botox",
    label: "Botox",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <rect x="26" y="16" width="12" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" />
        <line x1="32" y1="9" x2="32" y2="16" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <line x1="32" y1="42" x2="32" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="54" r="2.5" fill="currentColor" />
        <line x1="26" y1="26" x2="30" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="32" x2="30" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="38" x2="30" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "aesthetics",
    label: "Aesthetics",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <path d="M32 10 L36 26 L54 26 L40 36 L45 52 L32 43 L19 52 L24 36 L10 26 L28 26 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "weightloss",
    label: "Weight Loss",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <line x1="10" y1="52" x2="54" y2="52" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="52" x2="32" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 28 L16 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 28 L48 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="16" cy="42" r="7" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="48" cy="42" r="7" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="32" cy="24" r="4" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: "antiaging",
    label: "Antiaging & Glutathione IV",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
        <path d="M24 8 Q32 4 40 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="22" y="8" width="20" height="28" rx="5" stroke="currentColor" strokeWidth="2.5" />
        <line x1="22" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="32" y1="36" x2="32" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="44" x2="38" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="54" r="4" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
];

function DepartmentsSection() {
  const [activeId, setActiveId] = useState<string>("dermatologist");
  return (
    <section id="departments" className="dept-section relative z-20">
      <div className="dept-container">
        <div className="dept-header">
          <p className="dept-eyebrow">What We Offer</p>
          <h2 className="dept-title">Our <span>Departments</span></h2>
          <p className="dept-subtitle">Expert care across every speciality</p>
        </div>
        <div className="dept-grid">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              className={`dept-card${activeId === dept.id ? " active" : ""}`}
              onClick={() => setActiveId(dept.id)}
              type="button"
            >
              <div className="dept-icon">{dept.icon}</div>
              <span>{dept.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════ APP ══════════════════════════ */
function App() {
  const istTime = useISTTime();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);

  useEffect(() => {
    // 1. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
    });

    // 2. Hook Lenis to GSAP ticker so they synchronize perfectly
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 3. Handle smooth scrolling on all anchor link clicks (including Book a Consultation)
    const handleAnchorClick = (e: MouseEvent) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: 0,
            duration: 1.5,
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", handleAnchorClick as EventListener);
    });

    return () => {
      gsap.ticker.remove(tick);
      links.forEach((link) => {
        link.removeEventListener("click", handleAnchorClick as EventListener);
      });
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const section = document.querySelector("#about");
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll("[data-animate]");
            elements.forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = "1";
                (el as HTMLElement).style.transform = "translateY(0)";
              }, i * 90);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* ──────────────────────── HERO ──────────────────────── */
  return (
    <>
      {/* ── Cinematic Intro Animation ── */}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <div
        className="min-h-screen bg-[#F8FAFC]"
        style={{
          opacity: showIntro ? 0 : 1,
          transition: "opacity 0.6s ease-out",
        }}
      >
      {/* ── Animated Background ── */}
      <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#F8FAFC]" />
        {/* Subtle animated gradient orbs */}
        <div
          className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-radial from-docIce/60 via-transparent to-transparent blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-radial from-docPastel/20 via-transparent to-transparent blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-radial from-docIce/40 via-transparent to-transparent blur-2xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "4s" }}
        />
        {/* Film grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "128px",
          }}
        />
      </div>

      {/* ═══════════════════ NAVIGATION ═══════════════════ */}
      <div className="glass-nav-wrapper sticky top-0 z-50">
        {/* GLASS BAR — the actual nav element, z-index: 20 */}
        <nav className="glass-nav-bar">
          {/* LEFT: Logo + nav links */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-docNavy rounded-full flex items-center justify-center glass-logo-badge">
                <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-tight">
                  MC
                </span>
              </div>
            </div>
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {["Treatments", "Doctors", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-[14px] glass-nav-link transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: Status, clock, CTA */}
          <div className="hidden md:flex items-center gap-4 lg:gap-5">
            <span className="hidden lg:block text-[13px] glass-status-text">
              Accepting patients for Q1 2026
            </span>
            <div className="flex items-center gap-1.5 text-[13px] glass-time-text">
              <Clock size={14} />
              <span>{istTime} IST</span>
            </div>
            {/* CTA Button with text roll */}
            <a
              href="#contact"
              className="group flex items-center gap-2 glass-cta-button text-white text-[13px] font-medium rounded-full pl-5 pr-2 py-2 transition-colors"
            >
              <TextRoll text="Book a consultation" />
              <span className="flex items-center justify-center w-6 h-6 bg-white rounded-full shrink-0">
                <ArrowRight
                  size={12}
                  className="text-docNavy -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                />
              </span>
            </a>
          </div>

          {/* MOBILE: Menu toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 bg-docNavy rounded-full text-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* DROPLETS — absolutely positioned, z-index: 15 */}
        {DROPLETS_DATA.map((drop) => {
          const style: React.CSSProperties = {
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            top: drop.top !== undefined ? `${drop.top}px` : undefined,
            bottom: drop.bottom !== undefined ? `${drop.bottom}px` : undefined,
            left: drop.left || undefined,
            right: drop.right || undefined,
            animationDuration: drop.duration,
            animationDelay: drop.delay,
          };
          return <div key={drop.id} className="glass-droplet" style={style} />;
        })}
      </div>

      {/* ═══════════════ MOBILE MENU OVERLAY ═══════════════ */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
          {/* Bottom sheet */}
          <div
            className="relative bg-white rounded-2xl mx-3 mb-3 p-6 pt-8 animate-[slideUp_0.5s_cubic-bezier(0.32,0.72,0,1)]"
            style={{
              animation: "slideUp 0.5s cubic-bezier(0.32,0.72,0,1) forwards",
            }}
          >
            {/* Time badge */}
            <div className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 mb-6">
              <Clock size={14} className="text-gray-600" />
              <span className="text-[13px] text-gray-600">{istTime} IST</span>
            </div>
            {/* Nav links */}
            <div className="flex flex-col gap-4 mb-8">
              {["Treatments", "Doctors", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-[28px] sm:text-[32px] font-medium text-gray-900"
                >
                  {item}
                </a>
              ))}
            </div>
            {/* CTA */}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="group inline-flex items-center gap-2 bg-docRoyal text-white text-[14px] font-medium rounded-full pl-5 pr-2 py-2.5"
            >
              <TextRoll text="Start your journey" />
              <span className="flex items-center justify-center w-7 h-7 bg-white rounded-full shrink-0">
                <ArrowRight
                  size={14}
                  className="text-docRoyal -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                />
              </span>
            </a>
          </div>
        </div>
      )}

      {/* ═══════════════════ HERO CONTENT ═══════════════════ */}
      <section className="relative z-20 flex flex-col min-h-[calc(100vh-80px)] overflow-hidden">
        {/* ── Doctor hero image — centered in right half ── */}
        <div
          className="hero-doctor-container"
          aria-hidden="true"
        >
          <img
            src="/doctor-hero.png"
            alt="Medicutis lead doctor"
            className="hero-doctor-img"
          />
        </div>

        {/* Spacer pushes content to bottom */}
        <div className="flex-1" />

        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20">
          {/* Label */}
          <p className="text-[13px] sm:text-[14px] text-gray-900 tracking-wide mb-5 sm:mb-8">
            Medicutis Clinic
          </p>

          {/* Headline — constrained to left ~55% on desktop so doctor doesn't overlap */}
          <h1
            className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 lg:max-w-[55%]"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 4.2rem)",
            }}
          >
            <span className="block">
              Advanced dermatology &amp;
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              aesthetics care
            </span>
            <span className="block">
              for those who demand
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              exceptional results.
            </span>
          </h1>

          {/* CTA Row */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 lg:max-w-[55%]">
            {/* Orange CTA button */}
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-docRoyal hover:bg-docNavy text-white text-[13px] sm:text-[14px] rounded-full pl-5 sm:pl-6 pr-2 py-2 transition-colors"
            >
              <TextRoll text="Book a consultation" />
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shrink-0">
                <ArrowRight
                  size={14}
                  className="text-docRoyal -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                />
              </span>
            </a>

            {/* Partner badge */}
            <div className="inline-flex items-center gap-2 bg-white rounded-[4px] px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow cursor-default">
              <StarburstIcon className="w-5 h-5 sm:w-6 sm:h-6 text-docSky" />
              <span className="text-[13px] sm:text-[14px] font-medium text-gray-900">
                Certified Clinic
              </span>
              <span className="text-[10px] sm:text-[11px] bg-docNavy text-white px-1.5 sm:px-2 py-0.5 rounded font-medium">
                Featured
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════ ABOUT ═════════════════════ */}
      <section
        id="about"
        className="relative z-20 bg-white mx-auto max-w-[1440px] px-4 pt-10 pb-[56px] sm:px-6 sm:pt-12 sm:pb-16 lg:px-[80px] lg:pt-[72px] lg:pb-[100px] overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-auto">
          {/* CELL A — Headline Block */}
          <div
            data-animate
            className="col-span-1 md:col-span-6 md:col-start-1 md:row-start-1 lg:col-span-7 lg:col-start-1 lg:row-start-1 pb-10"
          >
            <span className="font-dmSans text-[11px] tracking-[0.12em] text-docRoyal font-semibold mb-4 block">
              AESTHETIC DERMATOLOGY · DELHI NCR
            </span>
            <h2
              className="font-dmSerif leading-[1.08] text-docNavy font-normal"
              style={{ fontSize: "clamp(36px, 3.8vw, 58px)" }}
            >
              Expert-led dermatology, delivering results in{" "}
              <em
                className="not-italic text-docRoyal"
                style={{ fontStyle: "italic" }}
              >
                aesthetics
              </em>{" "}
              and beyond.
            </h2>
          </div>

          {/* CELL B — Stats Row */}
          <div
            data-animate
            className="col-span-1 md:col-span-6 md:col-start-1 md:row-start-2 lg:col-span-7 lg:col-start-1 lg:row-start-2 border-t border-b border-docPastel/35 overflow-hidden"
          >
            <div className="stats-track flex items-stretch w-max md:w-full">
              {/* Stat 1 */}
              <div className="flex-1 min-w-[200px] py-7 px-8 group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-center shrink-0">
                <span className="font-dmSerif text-[36px] text-docNavy transition-transform duration-300 group-hover:scale-105 inline-block origin-left">
                  12+
                </span>
                <span className="font-dmSans text-[12px] uppercase tracking-[0.08em] text-docNavy/60 mt-1">
                  Years of Excellence
                </span>
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-docPastel/35 self-stretch my-6 shrink-0" />
              {/* Stat 2 */}
              <div className="flex-1 min-w-[200px] py-7 px-8 group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-center shrink-0">
                <span className="font-dmSerif text-[36px] text-docNavy transition-transform duration-300 group-hover:scale-105 inline-block origin-left">
                  8,000+
                </span>
                <span className="font-dmSans text-[12px] uppercase tracking-[0.08em] text-docNavy/60 mt-1">
                  Patients Treated
                </span>
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-docPastel/35 self-stretch my-6 shrink-0" />
              {/* Stat 3 */}
              <div className="flex-1 min-w-[200px] py-7 px-8 group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-center shrink-0">
                <span className="font-dmSerif text-[36px] text-docNavy transition-transform duration-300 group-hover:scale-105 inline-block origin-left">
                  98%
                </span>
                <span className="font-dmSans text-[12px] uppercase tracking-[0.08em] text-docNavy/60 mt-1">
                  Satisfaction Rate
                </span>
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-docPastel/35 self-stretch my-6 shrink-0" />

              {/* ── DUPLICATES FOR SEAMLESS AUTO-SCROLL ON MOBILE ── */}
              {/* Stat 1 Duplicate */}
              <div className="flex-1 min-w-[200px] py-7 px-8 group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-center shrink-0 md:hidden">
                <span className="font-dmSerif text-[36px] text-docNavy transition-transform duration-300 group-hover:scale-105 inline-block origin-left">
                  12+
                </span>
                <span className="font-dmSans text-[12px] uppercase tracking-[0.08em] text-docNavy/60 mt-1">
                  Years of Excellence
                </span>
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-docPastel/35 self-stretch my-6 shrink-0 md:hidden" />
              {/* Stat 2 Duplicate */}
              <div className="flex-1 min-w-[200px] py-7 px-8 group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-center shrink-0 md:hidden">
                <span className="font-dmSerif text-[36px] text-docNavy transition-transform duration-300 group-hover:scale-105 inline-block origin-left">
                  8,000+
                </span>
                <span className="font-dmSans text-[12px] uppercase tracking-[0.08em] text-docNavy/60 mt-1">
                  Patients Treated
                </span>
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-docPastel/35 self-stretch my-6 shrink-0 md:hidden" />
              {/* Stat 3 Duplicate */}
              <div className="flex-1 min-w-[200px] py-7 px-8 group cursor-pointer hover:bg-slate-50/50 transition-all duration-300 flex flex-col justify-center shrink-0 md:hidden">
                <span className="font-dmSerif text-[36px] text-docNavy transition-transform duration-300 group-hover:scale-105 inline-block origin-left">
                  98%
                </span>
                <span className="font-dmSans text-[12px] uppercase tracking-[0.08em] text-docNavy/60 mt-1">
                  Satisfaction Rate
                </span>
              </div>
              {/* Divider */}
              <div className="w-[1px] bg-docPastel/35 self-stretch my-6 shrink-0 md:hidden" />
            </div>
          </div>

          {/* CELL C — Trust Badge Card */}
          <div
            data-animate
            className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-3 lg:col-span-2 lg:col-start-8 lg:row-start-1 bg-docIce/50 rounded-[20px] p-7 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(4,46,123,0.04)] transition-shadow duration-300"
          >
            <div className="w-8 h-8 shrink-0">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M16 2L4 7v9c0 7.18 5.18 13.9 12 15.93C23.82 29.9 29 23.18 29 16V7L16 2z"
                  fill="#004EE0"
                  fillOpacity="0.15"
                />
                <path
                  d="M16 2L4 7v9c0 7.18 5.18 13.9 12 15.93C23.82 29.9 29 23.18 29 16V7L16 2z"
                  stroke="#004EE0"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 16.5l3.5 3.5 6.5-7"
                  stroke="#004EE0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-8">
              <h3 className="font-dmSans font-bold text-[16px] text-docNavy">
                Certified &amp; Accredited
              </h3>
              <p className="font-dmSans font-normal text-[13px] text-docNavy/70 mt-2 leading-[1.6]">
                Board-certified dermatologists with verified clinical
                credentials.
              </p>
            </div>
          </div>

          {/* CELL D — Booking CTA Card */}
          <div
            data-animate
            className="col-span-1 md:col-span-3 md:col-start-4 md:row-start-3 lg:col-span-3 lg:col-start-10 lg:row-start-1 bg-docNavy rounded-[20px] p-7 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(4,46,123,0.15)] transition-shadow duration-300"
          >
            <div>
              <span className="font-dmSans font-semibold text-[13px] text-white/50 uppercase tracking-[0.1em] block">
                Ready to start?
              </span>
              <h3 className="font-dmSerif text-[20px] text-white leading-[1.3] mt-2">
                Book your consultation today
              </h3>
            </div>
            <a
              href="#contact"
              className="w-full bg-docRoyal hover:bg-docNavy text-white font-dmSans font-semibold text-[15px] py-[13px] rounded-full mt-6 text-center transition-colors duration-200 block border border-white/10"
            >
              Book Now &rarr;
            </a>
          </div>

          {/* CELL E — Body Text + CTA */}
          <div
            data-animate
            className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-4 lg:col-span-4 lg:col-start-1 lg:row-start-3 pt-4 flex flex-col justify-between"
          >
            <p className="font-dmSans font-normal text-[16px] leading-[1.8] text-docNavy/70">
              Through cutting-edge technology, clinical expertise and
              personalized care, we help our patients achieve their aesthetic
              goals with safety and precision at the forefront.
            </p>
            <a
              href="#doctors"
              className="group inline-flex items-center gap-[10px] text-docRoyal hover:text-docNavy transition-colors duration-200 mt-8"
            >
              <span className="font-dmSans font-semibold text-[15px]">
                Meet our specialists
              </span>
              <span className="w-9 h-9 bg-docRoyal group-hover:bg-docNavy rounded-full flex items-center justify-center text-white text-[16px] transition-all duration-200 group-hover:translate-x-[3px] shrink-0">
                &rarr;
              </span>
            </a>
          </div>

          {/* CELL F — Clinic Room Image Card */}
          <div
            data-animate
            className="col-span-1 md:col-span-3 md:col-start-4 md:row-start-4 lg:col-span-3 lg:col-start-5 lg:row-start-3 rounded-[20px] overflow-hidden relative min-h-[200px] md:min-h-[220px] lg:min-h-[280px] group cursor-pointer"
          >
            <img
              src="/clinic-interior.jpg"
              alt="Medicutis clinic interior with advanced equipment"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            />
            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-white/92 backdrop-blur-[8px] border border-white/60 rounded-full py-2 px-4 shadow-[0_4px_16px_rgba(0,0,0,0.10)]">
              <span className="font-dmSans font-semibold text-[12px] text-docNavy">
                &#10022; Advanced Equipment
              </span>
            </div>
          </div>

          {/* CELL G — Second Supporting Image Card */}
          <div
            data-animate
            className="col-span-1 md:col-span-3 md:col-start-1 md:row-start-5 lg:col-span-2 lg:col-start-8 lg:row-start-2 lg:row-span-2 rounded-[20px] overflow-hidden relative min-h-[200px] md:min-h-[220px] lg:min-h-0 group cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1579165466991-467135ad3110?w=600&q=80"
              alt="Close-up of precise clinical treatment and skincare tools"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4, 46, 123, 0.75) 0%, transparent 55%)",
              }}
            />
            <div className="absolute bottom-5 left-5">
              <span className="font-dmSans font-semibold text-[11px] uppercase tracking-[0.1em] text-white/70 block">
                PRECISION CARE
              </span>
              <h3 className="font-dmSerif text-[18px] text-white mt-1">
                Skin Treatments
              </h3>
            </div>
          </div>

          {/* CELL H — Doctor Portrait Card */}
          <div
            data-animate
            className="col-span-1 md:col-span-3 md:col-start-4 md:row-start-5 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:row-span-2 rounded-[24px] overflow-hidden relative min-h-[320px] md:min-h-[360px] lg:min-h-[520px] group cursor-pointer"
          >
            <img
              src="/doctor-portrait.jpg"
              alt="Dr. Sarah Mitchell - Lead Dermatologist at Medicutis"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover absolute inset-0 object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(4, 46, 123, 0.85) 0%, rgba(4, 46, 123, 0.2) 45%, transparent 70%)",
              }}
            />

            {/* Info Card */}
            <div className="absolute bottom-5 left-4 right-4 bg-white/10 backdrop-blur-[20px] saturate-[180%] border border-white/20 rounded-2xl py-4 px-5">
              <h3 className="font-dmSans font-bold text-[15px] text-white">
                Dr. Sarah Mitchell
              </h3>
              <p className="font-dmSans font-normal text-[12px] text-white/75 mt-0.5">
                Lead Dermatologist &amp; Aesthetic Specialist
              </p>
              <span className="bg-docRoyal/90 text-white font-dmSans font-semibold text-[11px] px-[12px] py-[5px] rounded-full inline-block mt-3 cursor-default">
                &#9679; Available Mon &ndash; Sat
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CASE STUDIES / TREATMENTS ═══════════════ */}
      <section
        id="treatments"
        className="relative z-20 bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28"
      >
        <div className="max-w-[1440px] mx-auto">
          {/* Badge row */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              2
            </span>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              Featured treatments
            </span>
          </div>

          {/* Heading */}
          <h2
            className="px-5 sm:px-8 lg:px-12 font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16"
            style={{
              fontSize: "clamp(1.75rem, 7vw, 4.2rem)",
            }}
          >
            Our treatments
          </h2>

          {/* Cards Grid */}
          <div className="px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
            {/* ── Card 1: Botox & Fillers ── */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-docNavy/90">
                <img
                  src="/botox-treatment.jpg"
                  alt="Botox and dermal fillers treatment"
                  className="w-full h-full object-cover"
                />
                {/* Hover button */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center h-9 bg-white rounded-full overflow-hidden w-9 group-hover:w-[148px] transition-all duration-300 ease-in-out">
                    <span className="flex items-center justify-center w-9 h-9 shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-docNavy -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </span>
                    <span className="text-[13px] font-medium text-docNavy whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      Learn more
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-docNavy/70 mt-4 leading-relaxed">
                Premium Botox and dermal fillers administered by board-certified
                dermatologists for natural, youthful results.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-docNavy mt-1">
                Botox &amp; Dermal Fillers
              </h3>
            </div>

            {/* ── Card 2: Laser Treatments ── */}
            <div className="group cursor-pointer">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-docNavy/90">
                <img
                  src="/laser-equipment.jpg"
                  alt="Advanced laser hair removal and skin treatment"
                  className="w-full h-full object-cover"
                />
                {/* Hover button */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center h-9 bg-docNavy rounded-full overflow-hidden w-9 group-hover:w-[168px] transition-all duration-300 ease-in-out">
                    <span className="flex items-center justify-center w-9 h-9 shrink-0">
                      <ArrowRight
                        size={14}
                        className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      />
                    </span>
                    <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      View treatment
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-docNavy/70 mt-4 leading-relaxed">
                State-of-the-art laser technology for hair removal, skin
                resurfacing, and pigmentation correction.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-docNavy mt-1">
                Laser &amp; Skin Resurfacing
              </h3>
            </div>

            {/* ── Card 3: Hair Restoration ── */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[329/246] rounded-2xl overflow-hidden bg-docNavy/90">
                <img
                  src="/hair-treatment.jpg"
                  alt="PRP hair restoration treatment"
                  className="w-full h-full object-cover"
                />
                {/* Hover button */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center h-9 bg-white rounded-full overflow-hidden w-9 group-hover:w-[148px] transition-all duration-300 ease-in-out">
                    <span className="flex items-center justify-center w-9 h-9 shrink-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-docNavy -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                    </span>
                    <span className="text-[13px] font-medium text-docNavy whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      Learn more
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-docNavy/70 mt-4 leading-relaxed">
                Advanced PRP therapy and hair restoration solutions for thinning
                hair and pattern baldness.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-docNavy mt-1">
                Hair Restoration &amp; PRP
              </h3>
            </div>

            {/* ── Card 4: Anti-Aging & IV Therapy ── */}
            <div className="group cursor-pointer">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-docNavy/90">
                <img
                  src="/iv-therapy.jpg"
                  alt="Glutathione IV therapy session"
                  className="w-full h-full object-cover"
                />
                {/* Hover button */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center h-9 bg-docNavy rounded-full overflow-hidden w-9 group-hover:w-[168px] transition-all duration-300 ease-in-out">
                    <span className="flex items-center justify-center w-9 h-9 shrink-0">
                      <ArrowRight
                        size={14}
                        className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300"
                      />
                    </span>
                    <span className="text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      View treatment
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] sm:text-[14px] text-docNavy/70 mt-4 leading-relaxed">
                Rejuvenating Glutathione IV drips and anti-aging treatments for
                radiant, youthful skin from within.
              </p>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-docNavy mt-1">
                Glutathione IV &amp; Anti-Aging
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ GALLERY ═══════════════════ */}
      <section
        id="gallery"
        className="relative z-20 bg-white py-20 sm:py-16 overflow-hidden"
        style={{
          paddingTop: "clamp(48px, 7vw, 100px)",
          paddingBottom: "clamp(48px, 7vw, 100px)",
        }}
      >
        <div className="max-w-[1440px] mx-auto">
          {/* Badge row */}
          <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              3
            </span>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5">
              Our specializations
            </span>
          </div>

          {/* Heading */}
          <div className="px-5 sm:px-8 lg:px-12 mb-10 sm:mb-14">
            <h2
              className="font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-3"
              style={{ fontSize: "clamp(1.75rem, 7vw, 4.2rem)" }}
            >
              Gallery
            </h2>
            <p className="text-[14px] sm:text-[15px] text-gray-500 font-normal">
              Our Specializations
            </p>
          </div>

          {/* Slider */}
          <div className="px-5 sm:px-8 lg:px-12">
            <GallerySlider />
          </div>
        </div>
      </section>

      {/* ═══════════════════ DEPARTMENTS ═══════════════════ */}
      <DepartmentsSection />

      {/* ═══════════════════ REVIEWS ═══════════════════ */}
      <ReviewsSection />

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer id="contact" className="relative z-20 bg-docNavy text-white">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-14">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16 mb-10">
            {/* Left: Brand */}
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                  <span className="text-docNavy text-[10px] font-bold tracking-tight">
                    MC
                  </span>
                </div>
                <span className="text-[17px] font-semibold">Medicutis</span>
              </div>
              <p className="text-[14px] leading-[1.6] text-white/70 mb-4">
                Premium dermatology and aesthetics clinic offering advanced
                treatments including lasers, Botox, hair restoration, weight
                management, and Glutathione IV therapy.
              </p>
              <div className="flex items-center gap-2 text-[13px] text-white/60">
                <Clock size={13} />
                <span>Mon - Sat: 8:00 AM - 8:30 PM | Sun: Closed</span>
              </div>
            </div>

            {/* Right: Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
              {/* Treatments */}
              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Treatments
                </h4>
                <ul className="space-y-2">
                  {[
                    "Laser Therapy",
                    "Botox & Fillers",
                    "Hair Restoration",
                    "Glutathione IV",
                    "Anti-Aging",
                    "Weight Loss",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#treatments"
                        className="text-[13px] text-white/70 hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Clinic */}
              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Clinic
                </h4>
                <ul className="space-y-2">
                  {[
                    "About Us",
                    "Our Doctors",
                    "Facilities",
                    "Patient Stories",
                    "Careers",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#about"
                        className="text-[13px] text-white/70 hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Contact */}
              <div>
                <h4 className="text-[12px] font-semibold uppercase tracking-wider text-white/50 mb-3">
                  Contact
                </h4>
                <ul className="space-y-2">
                  <li className="text-[13px] text-white/70">+91-85878-95276</li>
                  <li className="text-[13px] text-white/70">
                    info@medicutis.com
                  </li>
                  <li className="text-[13px] text-white/70">
                    Sector 15, Noida, UP
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[12px] text-white/40">
              &copy; 2025 Medicutis Clinic. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[12px] text-white/40 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-[12px] text-white/40 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Slide-up animation for mobile menu ── */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
    </>
  );
}

export default App;
