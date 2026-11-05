import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { runIntro } from './intro';

gsap.registerPlugin(ScrollTrigger);

const canHover = matchMedia('(hover: hover)').matches;

// Scroll suave, sincronizado con ScrollTrigger. En pantallas táctiles queda el scroll nativo.
const lenis = new Lenis({ autoRaf: false });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);

if (document.documentElement.classList.contains('intro-active')) {
  lenis.stop();
  window.scrollTo(0, 0);
}

runIntro({
  onDone: () => {
    lenis.start();
    ScrollTrigger.refresh();
  },
});

document.querySelector('a[href="#top"]')?.addEventListener('click', (e) => {
  e.preventDefault();
  lenis.scrollTo(0, { duration: 1.4 });
});

// Header: aparece al pasar el hero
const header = document.querySelector('[data-header]');
ScrollTrigger.create({
  trigger: '[data-hero]',
  start: 'bottom 80px',
  onEnter: () => header?.classList.add('is-solid'),
  onLeaveBack: () => header?.classList.remove('is-solid'),
});

{
  // Hero: parallax de la foto y fade del contenido
  gsap.to('[data-hero-media] img', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__content', {
    autoAlpha: 0,
    y: -60,
    ease: 'none',
    scrollTrigger: { trigger: '[data-hero]', start: '40% top', end: 'bottom top', scrub: true },
  });

  // Retrato: la foto sube apenas con el scroll
  gsap.from('.retrato__img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: { trigger: '.retrato', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  // Bloques que aparecen al entrar en pantalla
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%' },
    });
  });

  // Fotos que se descubren de abajo hacia arriba
  gsap.utils.toArray<HTMLElement>('[data-reveal-img]').forEach((el) => {
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: 'top 90%' } })
      .fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' })
      .from(el.querySelector('img'), { scale: 1.3, duration: 1.6, ease: 'expo.out' }, 0.15);
  });

  // Contacto: parallax de la foto y el logo que sube
  gsap.to('[data-contact-media]', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: { trigger: '.contacto', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
  gsap.from('.contacto__logo', {
    yPercent: 60,
    autoAlpha: 0,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.contacto', start: 'top 40%' },
  });
}

if (canHover) {
  // Botones magnéticos
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.3);
    });
    btn.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

// Botón de mail: en la compu, mailto: abre Outlook (u otro programa que casi nadie configura).
// Con mouse lo mandamos a redactar en Gmail web; en el celu queda mailto:, que abre la app de mail.
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll<HTMLAnchorElement>('a[data-gmail]').forEach((a) => {
    a.href = a.dataset.gmail!;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}
