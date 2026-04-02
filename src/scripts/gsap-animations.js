import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Make all elements visible without animation
  gsap.set('[data-gsap]', { opacity: 1, y: 0, x: 0, scale: 1 });
} else {
  initAnimations();
}

function initAnimations() {
  // --- Hero ---
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero__content h1', { opacity: 0, y: 40, duration: 0.9 })
      .from('.hero__desc', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5')
      .from('.hero__actions', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
      .from('.hero__trust-item', { opacity: 0, y: 15, duration: 0.4, stagger: 0.1 }, '-=0.3');
  }

  // --- Age Navigator Cards: stagger slide-up ---
  gsap.utils.toArray('.age-nav__card').forEach((card, i) => {
    // Remove CSS animation
    card.style.animation = 'none';
    gsap.set(card, { opacity: 0, y: 50 });
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: i * 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // --- Philosophy Pillars: alternate left/right ---
  gsap.utils.toArray('.pillars__card').forEach((card, i) => {
    card.style.animation = 'none';
    const fromX = i % 2 === 0 ? -60 : 60;
    gsap.set(card, { opacity: 0, x: fromX });
    gsap.to(card, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // --- Stats Bar: counter animation ---
  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    gsap.utils.toArray('.stats-bar__item').forEach((item) => {
      item.style.animation = 'none';
      gsap.set(item, { opacity: 0, y: 20 });
    });

    ScrollTrigger.create({
      trigger: statsSection,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to('.stats-bar__item', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        });

        // Animate number values
        document.querySelectorAll('.stats-bar__value').forEach((el) => {
          const text = el.textContent.trim();
          const numMatch = text.match(/(\d+)/);
          if (numMatch) {
            const target = parseInt(numMatch[1], 10);
            const suffix = text.replace(numMatch[1], '');
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.5,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.val) + suffix;
              },
            });
          }
        });
      },
    });
  }

  // --- Developmental Windows: stagger ---
  gsap.utils.toArray('.dev-windows__card').forEach((card, i) => {
    card.style.animation = 'none';
    gsap.set(card, { opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 });
    gsap.to(card, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // --- Featured Articles: fade up with stagger ---
  gsap.utils.toArray('.featured__card, .topics__card, .daily-card').forEach((card) => {
    gsap.set(card, { opacity: 0, y: 30 });
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        once: true,
      },
    });
  });

  // --- Section headers: slide up ---
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.set(header, { opacity: 0, y: 25 });
    gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        once: true,
      },
    });
  });

  // --- About section visual ---
  const aboutVisual = document.querySelector('.about__visual');
  if (aboutVisual) {
    gsap.set(aboutVisual, { opacity: 0, y: 30 });
    gsap.to(aboutVisual, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: aboutVisual,
        start: 'top 85%',
        once: true,
      },
    });
  }

  // --- Newsletter / App Preview: scale up ---
  gsap.utils.toArray('.newsletter, .app-preview').forEach((section) => {
    gsap.set(section, { opacity: 0, scale: 0.96 });
    gsap.to(section, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true,
      },
    });
  });
}
