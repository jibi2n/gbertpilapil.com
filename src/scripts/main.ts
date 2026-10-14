import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// This script runs on every page. Pieces that only exist on the home page
// (the theme pickers, the typed line) are skipped when they aren't there.

const root = document.documentElement;
const motion = root.classList.contains('motion');
let lenis: Lenis | null = null;

/* ---------- The name spans its container edge to edge ---------- */

function fitText() {
  for (const el of document.querySelectorAll<HTMLElement>('[data-fit]')) {
    // Hidden (the Summary theme hides the big intro): nothing to measure yet.
    // Phones: the name is set at a normal size in CSS instead.
    if (el.offsetWidth === 0 || matchMedia('(max-width: 699px)').matches) {
      el.style.fontSize = '';
      continue;
    }
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

/* ---------- Themes ---------- */

const themes: { id: string; label: string; fonts: string[] }[] = JSON.parse(document.body.dataset.themes!);
// A page can have several pickers (the summary and the intro each have one).
const dotGroups = [...document.querySelectorAll<HTMLElement>('.theme-dots')].map((group) => ({
  group,
  dots: [...group.querySelectorAll<HTMLButtonElement>('.theme-dot')],
}));
const swipeAreas = [...document.querySelectorAll<HTMLElement>('[data-theme-swipe]')];
let current = Math.max(0, themes.findIndex((theme) => theme.id === root.dataset.theme));

function showTheme() {
  for (const name of document.querySelectorAll('.theme-name')) name.textContent = themes[current].label;
  for (const { dots } of dotGroups) {
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-checked', String(i === current));
      dot.tabIndex = i === current ? 0 : -1;
    });
  }
}

/** Switches theme. Going past either end wraps around to the other. */
function setTheme(index: number) {
  index = (index + themes.length) % themes.length;
  if (index === current) return;
  current = index;
  root.dataset.theme = themes[index].id;
  try {
    // For this tab only; a new tab starts on the business card again.
    sessionStorage.setItem('theme', themes[index].id);
  } catch {
    // Storage blocked: the theme just won't be remembered.
  }
  showTheme();
  fitText();
  // The Summary theme swaps which sections exist, so the page height changes.
  requestAnimationFrame(() => {
    setUpReveals();
    ScrollTrigger.refresh();
    lenis?.resize();
    // The mascot is hidden in some themes, so he re-checks which way to face when he reappears.
    faceCenter();
  });
}

showTheme();

/* The extra themes are an easter egg: the picker, the mascot and the swipe
   and arrow-key shortcuts stay off until the visitor finds the way in (the
   dot in the footer, or typing "mudkip"). Switching between the resume view
   and the portfolio with their own links works either way. */
let unlocked = root.classList.contains('themes-unlocked');

function unlockThemes() {
  unlocked = true;
  root.classList.add('themes-unlocked');
  try {
    localStorage.setItem('themes-unlocked', '1');
    // His tip explains what was just found, so make sure it shows.
    localStorage.removeItem('mascot-tip');
  } catch {
    // Private browsing: it will need finding again next visit.
  }
}

document.querySelector('.egg')?.addEventListener('click', () => {
  if (unlocked) {
    // Already found: the dot just steps to the next theme.
    setTheme(current + 1);
  } else {
    unlockThemes();
    // Land on the Mudkip theme, where the mascot explains the rest.
    setTheme(themes.findIndex((theme) => theme.id === 'mudkip'));
    setBubble(true, false);
  }
  window.scrollTo(0, 0);
});

// The other way in: type "mudkip" anywhere on the page.
const SECRET = 'mudkip';
let typedSoFar = '';
document.addEventListener('keydown', (event) => {
  if (unlocked || event.key.length !== 1) return;
  if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
  typedSoFar = (typedSoFar + event.key.toLowerCase()).slice(-SECRET.length);
  if (typedSoFar !== SECRET) return;
  unlockThemes();
  setTheme(themes.findIndex((theme) => theme.id === SECRET));
  setBubble(true, false);
  window.scrollTo(0, 0);
});
console.log('Psst. Type "mudkip" anywhere on this page.');

// Dots: click one, or use the arrow keys while one is focused.
for (const { group, dots } of dotGroups) {
  dots.forEach((dot, i) => dot.addEventListener('click', () => setTheme(i)));
  group.addEventListener('keydown', (event) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in step)) return;
    event.preventDefault();
    setTheme(current + step[event.key]);
    dots[current].focus();
  });
}

// Arrows either side of the dots.
for (const arrow of document.querySelectorAll<HTMLElement>('[data-theme-step]')) {
  arrow.addEventListener('click', () => setTheme(current + Number(arrow.dataset.themeStep)));
}

// My name in the top bar goes home: back to the business card. On another
// page it leaves a note for the home page to open on the card.
document.querySelector('[data-home]')?.addEventListener('click', (event) => {
  if (document.querySelector('.summary')) {
    event.preventDefault();
    setTheme(themes.findIndex((theme) => theme.id === 'summary'));
    window.scrollTo(0, 0);
  } else {
    try {
      sessionStorage.setItem('theme', 'summary');
    } catch {
      // Storage blocked: the home page opens on its default, the card, anyway.
    }
  }
});

// Buttons that jump straight to one theme, like "See the full site".
for (const button of document.querySelectorAll<HTMLElement>('[data-set-theme]')) {
  button.addEventListener('click', () => {
    setTheme(themes.findIndex((theme) => theme.id === button.dataset.setTheme));
    window.scrollTo(0, 0);
  });
}

// Left and right arrow keys, while the top of the page is on screen and nothing else wants them.
if (swipeAreas.length > 0) {
  document.addEventListener('keydown', (event) => {
    if (!unlocked || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return;
    if (window.scrollY > window.innerHeight * 0.6) return;
    setTheme(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
}

// Swipe with a finger (or pen) on the top section. Every DRAG_STEP pixels of
// sideways travel moves one theme along, so a long swipe can pass through several.
// A mouse doesn't drag the page; it uses the arrows, dots or keys instead.
const DRAG_STEP = 70;
let dragX: number | null = null;
let wheelTravel = 0;
let wheelReadyAt = 0;

// Fetch the other themes' fonts as soon as someone reaches for the top section,
// so the first switch doesn't flash a fallback font.
function preloadThemeFonts() {
  for (const theme of themes) {
    for (const font of theme.fonts) document.fonts.load(`1em "${font}"`);
  }
}

for (const area of swipeAreas) {
  area.addEventListener('pointerdown', (event) => {
    if (!unlocked || event.pointerType === 'mouse' || (event.target as HTMLElement).closest('a, button')) return;
    dragX = event.clientX;
  });
  // Sideways scrolling on a trackpad or tilt wheel does the same.
  area.addEventListener(
    'wheel',
    (event) => {
      if (!unlocked || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (performance.now() < wheelReadyAt) return;
      wheelTravel += event.deltaX;
      if (Math.abs(wheelTravel) < DRAG_STEP) return;
      setTheme(current + (wheelTravel > 0 ? 1 : -1));
      wheelTravel = 0;
      // One flick of a trackpad sends a long tail of events; ignore it.
      wheelReadyAt = performance.now() + 700;
    },
    { passive: false },
  );
  area.addEventListener('pointerenter', preloadThemeFonts, { once: true });
  area.addEventListener('touchstart', preloadThemeFonts, { once: true, passive: true });
}
window.addEventListener('pointermove', (event) => {
  if (dragX === null) return;
  const moved = event.clientX - dragX;
  if (Math.abs(moved) < DRAG_STEP) return;
  setTheme(current + (moved < 0 ? 1 : -1));
  dragX = event.clientX;
});
function endDrag() {
  dragX = null;
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

/* ---------- Fold-away details (phones) ---------- */

// A [data-toggle] button opens and closes the [data-collapsible] item around
// it. CSS decides what that hides, and only does so on phones.
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-toggle]')) {
  const item = button.closest<HTMLElement>('[data-collapsible]')!;
  button.addEventListener('click', () => {
    button.setAttribute('aria-expanded', String(item.classList.toggle('is-open')));
  });
  // A tap anywhere on the item counts, while the button is showing (phones).
  item.addEventListener('click', (event) => {
    if (!(event.target as Element).closest('a, button') && button.offsetParent) button.click();
  });
}

/* ---------- Business card (Summary theme) ---------- */

const card = document.querySelector<HTMLElement>('[data-card]');
const flipButton = document.querySelector<HTMLButtonElement>('[data-card-flip]');
if (card && flipButton) {
  const [front, back] = card.querySelectorAll<HTMLElement>('.card-face');
  const flip = () => {
    const flipped = card.classList.toggle('is-flipped');
    // Once it has been turned, it no longer needs to show that it can be.
    card.classList.add('was-flipped');
    // Only the face showing can be tabbed into.
    front.inert = flipped;
    back.inert = !flipped;
    flipButton.setAttribute('aria-pressed', String(flipped));
  };
  flipButton.addEventListener('click', flip);
  // Clicking the card flips it too, unless the click was on a link or button in it.
  card.addEventListener('click', (event) => {
    if (!(event.target as Element).closest('a, button')) flip();
  });
}

// Copy buttons: put their text on the clipboard and say so for a moment.
const copyStatus = document.querySelector<HTMLElement>('[data-copy-status]');
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy!);
    } catch {
      // No clipboard access (an old browser, or not https): the mailto link still works.
      return;
    }
    button.classList.add('is-copied');
    if (copyStatus) copyStatus.textContent = 'Email address copied';
    setTimeout(() => {
      button.classList.remove('is-copied');
      if (copyStatus) copyStatus.textContent = '';
    }, 1600);
  });
}

/* ---------- Light and dark mode (Professional theme) ---------- */

const modeToggle = document.querySelector<HTMLButtonElement>('.mode-toggle')!;

function setMode(dark: boolean) {
  root.dataset.mode = dark ? 'dark' : 'light';
  // The button names what a click will do, and its icon shows the same.
  modeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  try {
    localStorage.setItem('mode', root.dataset.mode);
  } catch {
    // Private browsing: the mode just won't be remembered.
  }
}

modeToggle.setAttribute('aria-label', root.dataset.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
modeToggle.addEventListener('click', () => {
  const dark = root.dataset.mode !== 'dark';
  // Without view transitions (or with motion off) the colors simply fade.
  if (!motion || !document.startViewTransition) return setMode(dark);
  // The sunrise/sunset itself is CSS: see "Light/dark transition" in global.css.
  const classes = ['mode-switching', dark ? 'mode-to-dark' : 'mode-to-light'];
  root.classList.add(...classes);
  document.startViewTransition(() => setMode(dark)).finished.finally(() => root.classList.remove(...classes));
});

/* ---------- "I'm a ..." typed out under the name ---------- */

const typed = document.querySelector<HTMLElement>('.typed');
const roles: string[] = typed ? JSON.parse(typed.dataset.roles!) : [];

// With motion turned off the first word simply stays put.
if (typed && motion && roles.length > 1) {
  let role = 0;
  let length = roles[0].length;
  let deleting = true;

  const tick = () => {
    length += deleting ? -1 : 1;
    typed.textContent = roles[role].slice(0, length);
    let delay = deleting ? 45 : 95;
    if (!deleting && length === roles[role].length) {
      // Finished typing: hold the word, then start deleting it.
      deleting = true;
      delay = 1700;
    } else if (deleting && length === 0) {
      // Finished deleting: move to the next word.
      deleting = false;
      role = (role + 1) % roles.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  };
  // Let the intro animation finish and the first word be read before it starts.
  setTimeout(tick, 3200);
}

/* ---------- Mascot: click for his tip, drag him anywhere ---------- */

const mascot = document.querySelector<HTMLElement>('.mascot')!;
const mascotButton = mascot.querySelector<HTMLButtonElement>('.mascot-btn')!;
const bubble = mascot.querySelector<HTMLElement>('.mascot-bubble')!;

function setBubble(open: boolean, remember = true) {
  bubble.hidden = !open;
  mascotButton.setAttribute('aria-expanded', String(open));
  if (!remember) return;
  try {
    localStorage.setItem('mascot-tip', open ? 'open' : 'closed');
  } catch {
    // Private browsing: the choice just won't be remembered.
  }
}

/** He looks toward the middle of the screen, and his bubble opens toward where there is room. */
function faceCenter() {
  const box = mascot.getBoundingClientRect();
  mascot.classList.toggle('is-left', box.left + box.width / 2 < root.clientWidth / 2);
  mascot.classList.toggle('is-top', box.top < 180);
}

function moveMascot(left: number, top: number) {
  const box = mascot.getBoundingClientRect();
  mascot.style.left = `${Math.min(Math.max(0, left), root.clientWidth - box.width)}px`;
  mascot.style.top = `${Math.min(Math.max(0, top), window.innerHeight - box.height)}px`;
  mascot.style.right = mascot.style.bottom = 'auto';
  faceCenter();
}

let savedTip: string | null = null;
try {
  savedTip = localStorage.getItem('mascot-tip');
} catch {
  // Private browsing: start with the tip showing.
}
// His tip is about switching themes, so it starts closed on pages with no picker.
if (dotGroups.length === 0) setBubble(false, false);
else setBubble(savedTip !== 'closed');
faceCenter();
// The tip tucks itself away after a few seconds so it doesn't sit on top of the
// page. Clicking him brings it back. (Not remembered: it shows again next visit.)
const tipTimer = setTimeout(() => setBubble(false, false), 9000);

let grab: { x: number; y: number; left: number; top: number; moved: boolean } | null = null;
let justDragged = false;

mascotButton.addEventListener('pointerdown', (event) => {
  const box = mascot.getBoundingClientRect();
  grab = { x: event.clientX, y: event.clientY, left: box.left, top: box.top, moved: false };
  mascotButton.setPointerCapture(event.pointerId);
});
mascotButton.addEventListener('pointermove', (event) => {
  if (!grab) return;
  const dx = event.clientX - grab.x;
  const dy = event.clientY - grab.y;
  // A few pixels of wobble is still a click, not a drag.
  if (!grab.moved && Math.hypot(dx, dy) < 6) return;
  grab.moved = true;
  moveMascot(grab.left + dx, grab.top + dy);
});
function release() {
  justDragged = grab?.moved ?? false;
  grab = null;
}
mascotButton.addEventListener('pointerup', release);
mascotButton.addEventListener('pointercancel', release);
mascotButton.addEventListener('click', () => {
  // The browser fires a click at the end of a drag; that one shouldn't toggle the tip.
  if (justDragged) {
    justDragged = false;
    return;
  }
  clearTimeout(tipTimer);
  setBubble(mascotButton.getAttribute('aria-expanded') !== 'true');
});
// Keep him on screen if the window shrinks after he has been moved.
window.addEventListener('resize', () => {
  if (mascot.style.left) moveMascot(parseFloat(mascot.style.left), parseFloat(mascot.style.top));
});

/* ---------- Project detail panels ---------- */

for (const opener of document.querySelectorAll<HTMLElement>('[data-project-open]')) {
  opener.addEventListener('click', () => {
    const panel = document.querySelector<HTMLDialogElement>(`#project-${opener.dataset.projectOpen}`);
    if (!panel) return;
    panel.showModal();
    panel.querySelector('.panel-body')!.scrollTop = 0;
    // The page behind stays put while the panel is open.
    lenis?.stop();
  });
}

for (const panel of document.querySelectorAll<HTMLDialogElement>('dialog.panel')) {
  panel.addEventListener('click', (event) => {
    // Close from the button, or from a click on the dimmed area outside the sheet.
    if (event.target === panel || (event.target as HTMLElement).closest('[data-panel-close]')) panel.close();
  });
  // Fires for the button, the Escape key and the dimmed area alike.
  panel.addEventListener('close', () => lenis?.start());
}

/* ---------- Links to other sites open in a new tab ---------- */

// Done here rather than on each link so it also covers links added later.
for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')) {
  if (link.host === location.host) continue;
  link.target = '_blank';
  // Stops the other site from being able to control this tab.
  link.rel = 'noopener noreferrer';
}

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

let revealsReady = false;

/**
 * Each piece of content rises into place as it scrolls into view. Items that
 * arrive together (a row of projects, say) follow one another in a quick stagger.
 * Set up the first time the full site is on screen: while the Summary theme
 * hides those sections there is nothing to measure.
 */
function setUpReveals() {
  if (!motion || revealsReady) return;
  const reveals = gsap.utils
    .toArray<HTMLElement>('[data-reveal], [data-reveal-group] > *')
    .filter((el) => el.offsetParent !== null);
  if (reveals.length === 0) return;
  revealsReady = true;
  gsap.set(reveals, { autoAlpha: 0, y: 56 });
  ScrollTrigger.batch(reveals, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, overwrite: true }),
  });
}

// Pages without an intro hand GSAP empty lists; that is expected, not worth a console warning.
gsap.config({ nullTargetWarn: false });

if (motion) {
  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({ anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  setUpReveals();
}

/** Hides the loading screen (if it is showing) and plays the intro. */
function start() {
  fitText();
  root.classList.remove('is-loading');
  if (!motion) return;
  const timeline = gsap.timeline({ defaults: { ease: 'power4.out' } });
  const nameLines = gsap.utils.toArray<HTMLElement>('[data-intro-line]');
  gsap.set(nameLines, { visibility: 'visible' });
  // The big name only slides up if it is on screen (the Summary theme hides it).
  const nameShowing = nameLines.some((el) => el.offsetParent !== null);
  if (nameShowing) timeline.from(nameLines, { yPercent: 110, duration: 1.1, stagger: 0.09 });
  // Only the pieces actually on screen are staggered; hidden ones just become ready.
  const pieces = gsap.utils.toArray<HTMLElement>('[data-intro]');
  const shown = pieces.filter((el) => el.offsetParent !== null || el.classList.contains('mascot'));
  gsap.set(pieces.filter((el) => !shown.includes(el)), { autoAlpha: 1 });
  timeline.fromTo(shown, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 }, nameShowing ? '-=0.6' : 0);
}

// Wait for the fonts so the name doesn't jump, but never for long.
Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]).then(start);
