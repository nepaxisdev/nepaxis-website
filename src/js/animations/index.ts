import { initSmoothScroll } from "./smooth-scroll";
import { initLazyLoadImages } from "./lazy-load";
import { initHeaderAnimations } from "./header-animations";
import { initASCIIAnimations } from "./ascii";
import { initShowMenuImages } from "./hover-image";
import { initApproachSectionAnimations } from "./scroll-timelines/approach";
import { initDraggable } from "./draggable";
import { initTextScramble } from "./text-scramble";
//start initializing animation modules

export function initAnimations() {
  // this is required throughout the timeline
  initSmoothScroll();
  initLazyLoadImages();
  initHeaderAnimations();

  // Temporarily here move this into individual scrollTrigger Animations to minimize performance load
  initShowMenuImages();
  initApproachSectionAnimations();
  initDraggable();
  // initHeroAnimations();

  document.fonts.ready.then(() => {
    initASCIIAnimations();
    initTextScramble();
  });
}

//we will defer playing section animations after load.

// todo
// function setFooterOffset() {
//   const footerHeight = document.querySelector("footer")!.offsetHeight;
//   const smoothContent: HTMLElement | null =
//     document.querySelector(".smooth-content") || null;
//   if (!smoothContent) return;
//   smoothContent!.style.setProperty("--footer-offset", `${footerHeight}px`);
// }
