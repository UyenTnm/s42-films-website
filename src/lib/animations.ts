import gsap from "gsap";

/**
 * Standard S•42 animation easing curves
 */
export const EASINGS = {
  cinematic: "power4.out",
  smooth: "power2.out",
  brutal: "expo.out",
  slowReveal: "power3.inOut",
};

/**
 * Reveal element with fade and subtle vertical translate
 */
export function fadeInUp(
  target: gsap.DOMTarget,
  options: {
    delay?: number;
    duration?: number;
    distance?: number;
    ease?: string;
  } = {}
) {
  const {
    delay = 0,
    duration = 1.2,
    distance = 40,
    ease = EASINGS.cinematic,
  } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, y: distance },
    { opacity: 1, y: 0, duration, delay, ease }
  );
}

/**
 * Stagger reveal list of elements
 */
export function staggerReveal(
  targets: gsap.DOMTarget,
  options: {
    stagger?: number;
    duration?: number;
    delay?: number;
    distance?: number;
    ease?: string;
  } = {}
) {
  const {
    stagger = 0.1,
    duration = 1.0,
    delay = 0,
    distance = 30,
    ease = EASINGS.cinematic,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y: distance },
    { opacity: 1, y: 0, duration, delay, stagger, ease }
  );
}

/**
 * Split text character or line reveal simulation
 */
export function lineMaskReveal(
  target: gsap.DOMTarget,
  options: { delay?: number; duration?: number } = {}
) {
  const { delay = 0, duration = 1.4 } = options;
  return gsap.fromTo(
    target,
    { yPercent: 100, opacity: 0 },
    { yPercent: 0, opacity: 1, duration, delay, ease: EASINGS.cinematic }
  );
}
