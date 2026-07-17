import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenis;

if (!reduceMotion) {
  lenis = new Lenis({ duration: 1.3, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const softFrom = { autoAlpha: 0, y: 24, filter: "blur(7px)" };
  const softTo = { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.15, ease: "power2.out" };

  if (document.querySelector(".hero")) {
    const hero = gsap.timeline({ defaults: { ease: "power2.out" } });
    hero
      .from(".hero h1", { autoAlpha: 0, y: 28, filter: "blur(8px)", duration: 1.15 })
      .from(".hero__lead", { autoAlpha: 0, y: 20, filter: "blur(5px)", duration: 1 }, "-=.62")
      .from(".hero__portrait img", { autoAlpha: 0, x: 42, filter: "blur(8px)", duration: 1.35, ease: "power3.out" }, "-=.42")
      .from(".hero .button", { autoAlpha: 0, y: 18, duration: .85 }, "-=.48")
      .from([".eyebrow", ".hero__type", ".hero__note"], { autoAlpha: 0, y: 14, duration: .75, stagger: .1 }, "-=.38")
      .from(".portrait-name", { autoAlpha: 0, y: 12, duration: .75 }, "-=.5")
      .from(".hero__markers span", { autoAlpha: 0, y: 14, duration: .75, stagger: .12 }, "-=.5");

    gsap.to(".hero__portrait img", { yPercent: 5, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 } });
  }

  gsap.utils.toArray("main .section, .final").forEach((section) => {
    const text = [...section.querySelectorAll(":scope .section-tag, :scope h2, :scope .split-head > p, :scope .lead")]
      .filter((element) => !element.matches(".text-reveal, .char-reveal"));
    if (!text.length) return;
    gsap.fromTo(text, softFrom, {
      ...softTo,
      stagger: .13,
      scrollTrigger: { trigger: section, start: "top 82%", once: true },
    });
  });

  gsap.set(".reveal", { autoAlpha: 0, y: 28, filter: "blur(6px)" });
  ScrollTrigger.batch(".reveal", {
    start: "top 90%",
    once: true,
    interval: .12,
    batchMax: 6,
    onEnter: (items) => gsap.to(items, { ...softTo, stagger: .12, overwrite: true }),
  });

  gsap.utils.toArray(".models, .evolution-track, .registration__meta, .form, .thanks-card").forEach((element) => {
    gsap.fromTo(element, { autoAlpha: 0, y: 22 }, {
      autoAlpha: 1,
      y: 0,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  });

  gsap.utils.toArray(".text-reveal").forEach((element) => {
    const split = new SplitType(element, { types: "words" });
    gsap.fromTo(split.words, { autoAlpha: 0, yPercent: 75, filter: "blur(5px)" }, {
      autoAlpha: 1,
      yPercent: 0,
      filter: "blur(0px)",
      duration: .78,
      stagger: element.matches(".statement") ? .025 : .055,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 86%", once: true },
    });
  });

  gsap.utils.toArray(".char-reveal").forEach((element) => {
    const split = new SplitType(element, { types: "words, chars" });
    gsap.fromTo(split.chars, { autoAlpha: 0, y: 18 }, {
      autoAlpha: 1,
      y: 0,
      duration: .5,
      stagger: .018,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 86%", once: true },
    });
  });
}

const range = document.querySelector("[data-range]");
const format = new Intl.NumberFormat("ru-RU");
range?.addEventListener("input", () => {
  document.querySelector("[data-members]").textContent = range.value;
  document.querySelector("[data-revenue]").textContent = `${format.format(Number(range.value) * 2900)} ₽`;
  range.style.setProperty("--progress", `${((range.value - 100) / 400) * 100}%`);
});
range?.dispatchEvent(new Event("input"));

const registration = document.querySelector("#registration");
document.querySelectorAll('a[href="#registration"]').forEach((link) => link.addEventListener("click", (event) => {
  if (!registration) return;
  event.preventDefault();
  if (lenis) {
    lenis.scrollTo(registration, { offset: 0, duration: 1.05, lock: true });
  } else {
    registration.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
}));

const cookie = document.querySelector("[data-cookie]");
if (cookie && localStorage.getItem("web2207-cookie-consent") !== "accepted") cookie.hidden = false;
cookie?.querySelectorAll("[data-cookie-accept]").forEach((button) => button.addEventListener("click", () => { localStorage.setItem("web2207-cookie-consent", "accepted"); cookie.hidden = true; }));

const getcourseWidget = document.querySelector(".getcourse-widget");
if (getcourseWidget) {
  const bindThankYouRedirect = (iframe) => {
    if (iframe.dataset.thankYouRedirectBound) return;
    iframe.dataset.thankYouRedirectBound = "true";

    let widgetReady = false;
    const markInteraction = () => {
      if (document.activeElement === iframe) widgetReady = true;
    };
    window.addEventListener("blur", markInteraction);
    const fallbackArm = window.setTimeout(() => { widgetReady = true; }, 4000);

    iframe.addEventListener("load", () => {
      if (!widgetReady) {
        widgetReady = true;
        window.clearTimeout(fallbackArm);
        return;
      }
      getcourseWidget.classList.add("is-redirecting");
      window.location.replace("/thanks/");
    });
  };

  getcourseWidget.querySelectorAll("iframe").forEach(bindThankYouRedirect);
  new MutationObserver((mutations) => mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
    if (!(node instanceof Element)) return;
    if (node.matches("iframe")) bindThankYouRedirect(node);
    node.querySelectorAll?.("iframe").forEach(bindThankYouRedirect);
  }))).observe(getcourseWidget, { childList: true, subtree: true });
}
