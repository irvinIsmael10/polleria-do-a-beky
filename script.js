const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const headerActions = document.querySelector(".header-actions");
const heroActions = document.querySelector(".hero-actions");
const siteHeader = document.querySelector(".site-header");

if (headerActions && heroActions && siteHeader) {
  let isTicking = false;

  const updateHeaderActions = () => {
    const triggerPoint = siteHeader.getBoundingClientRect().bottom + 8;
    const shouldShowActions = heroActions.getBoundingClientRect().bottom <= triggerPoint;

    headerActions.classList.toggle("is-visible", shouldShowActions);
    isTicking = false;
  };

  const requestHeaderActionsUpdate = () => {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(updateHeaderActions);
  };

  updateHeaderActions();
  window.addEventListener("scroll", requestHeaderActionsUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderActionsUpdate);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
});

const animatedElements = [
  ...document.querySelectorAll(".benefit-card"),
  ...document.querySelectorAll(".visual-image, .benefit-media img"),
];

animatedElements.forEach((element) => {
  element.classList.add("animate-on-scroll");

  if (element.matches("img, .visual-image")) {
    element.classList.add("image-fade");
  }
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  animatedElements.forEach((element) => revealOnScroll.observe(element));
}
