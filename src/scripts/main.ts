import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const root = document.documentElement;
const motion = root.classList.contains('motion');

/* ---------- The name spans its container edge to edge ---------- */

function fitText() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-fit]')) {
    const available = el.parentElement!.clientWidth;
    // Measure at a known size, then scale. The element is exactly as wide as its text.
    el.style.fontSize = '100px';
    el.style.fontSize = `${(available / el.offsetWidth) * 100 * 0.995}px`;
  }
}

fitText();
// Re-fit whenever the space changes: window resize, rotation, a scrollbar appearing.
const fitObserver = new ResizeObserver(fitText);
for (const el of document.querySelectorAll('[data-fit]')) fitObserver.observe(el.parentElement!);
document.fonts.addEventListener('loadingdone', fitText);

/* ---------- Theme slider ---------- */

const range = document.querySelector<HTMLInputElement>('#theme-range')!;
const themeName = document.querySelector<HTMLOutputElement>('.theme-name')!;
const themes: { id: string; label: string; fonts: string[] }[] = JSON.parse(range.dataset.themes!);
const lastStop = themes.length - 1;
let current = Math.max(0, themes.findIndex((theme) => theme.id === root.dataset.theme));

function showTheme(index: number) {
  themeName.value = themes[index].label;
  range.setAttribute('aria-valuetext', themes[index].label);
}

function setTheme(index: number) {
  index = Math.min(lastStop, Math.max(0, index));
  if (index === current) return;
  current = index;
  root.dataset.theme = themes[index].id;
  try {
    localStorage.setItem('theme', themes[index].id);
  } catch {
    // Private browsing: the theme just won't be remembered.
  }
  showTheme(index);
  fitText();
}

/** Glides the disk to its theme's stop after a drag or key press. */
function settle() {
  gsap.to(range, { value: current * 100, duration: motion ? 0.25 : 0, ease: 'power2.out', overwrite: true });
}

range.value = String(current * 100);
showTheme(current);

range.addEventListener('input', () => setTheme(Math.round(Number(range.value) / 100)));
range.addEventListener('change', settle);
range.addEventListener('keydown', (event) => {
  const step: Record<string, number> = {
    ArrowRight: current + 1,
    ArrowUp: current + 1,
    ArrowLeft: current - 1,
    ArrowDown: current - 1,
    Home: 0,
    End: lastStop,
  };
  if (!(event.key in step)) return;
  event.preventDefault();
  setTheme(step[event.key]);
  settle();
});

// Fetch the other themes' fonts as soon as someone reaches for the slider,
// so the first switch doesn't flash a fallback font.
function preloadThemeFonts() {
  for (const theme of themes) {
    for (const font of theme.fonts) document.fonts.load(`1em "${font}"`);
  }
}
range.addEventListener('pointerenter', preloadThemeFonts, { once: true });
range.addEventListener('focus', preloadThemeFonts, { once: true });
range.addEventListener('touchstart', preloadThemeFonts, { once: true, passive: true });

/* ---------- Image skeletons ---------- */

for (const img of document.querySelectorAll<HTMLImageElement>('.media.is-pending img')) {
  const done = () => img.parentElement!.classList.remove('is-pending');
  if (img.complete) done();
  else {
    img.addEventListener('load', done);
    img.addEventListener('error', done);
  }
}

/* ---------- Phone menu ---------- */

const menu = document.querySelector<HTMLElement>('#menu')!;
const menuButton = document.querySelector<HTMLButtonElement>('.nav-menu-btn')!;

function toggleMenu(open: boolean) {
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
}

menuButton.addEventListener('click', () => toggleMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('a')) toggleMenu(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menu.hidden) {
    toggleMenu(false);
    menuButton.focus();
  }
});

/* ---------- Motion: smooth scroll, intro sequence, scroll reveals ---------- */

if (motion) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Each piece of content rises into place as it scrolls into view. Items that
  // arrive together (a row of projects, say) follow one another in a quick stagger.
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal], [data-reveal-group] > *');
  gsap.set(reveals, { autoAlpha: 0, y: 56 });
  ScrollTrigger.batch(reveals, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true }),
  });
}

/** Hides the loading screen (if it is showing) and plays the intro. */
function start() {
  fitText();
  root.classList.remove('is-loading');
  if (!motion) return;
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .set('[data-intro-line]', { visibility: 'visible' })
    .from('[data-intro-line]', { yPercent: 110, duration: 1.1, stagger: 0.09 })
    .fromTo('[data-intro]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, '-=0.6');
}

// Wait for the fonts so the name doesn't jump, but never for long.
Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]).then(start);
