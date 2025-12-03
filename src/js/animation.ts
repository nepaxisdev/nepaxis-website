import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { loaded } from "./loader";

gsap.registerPlugin(
  Draggable,
  Flip,
  DrawSVGPlugin,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  InertiaPlugin
);
if (window.outerWidth > 991) {
  const smooth: ScrollSmoother = ScrollSmoother.create({
    smooth: 1,
    effects: true,
    smoothTouch: 0,
  });
  document.addEventListener("DOMContentLoaded", () => {
    const internalLinks = document.querySelectorAll("a[data-scroll-to]");
    internalLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const linkAddress = link.getAttribute("href");
        smooth.scrollTo(linkAddress, true, "top 100px");
      });
    });
  });
}

// function setFooterOffset() {
//   const footerHeight = document.querySelector("footer")!.offsetHeight;
//   const smoothContent: HTMLElement | null =
//     document.querySelector(".smooth-content") || null;
//   if (!smoothContent) return;
//   smoothContent!.style.setProperty("--footer-offset", `${footerHeight}px`);
// }

function loadDraggable() {
  const windows = gsap.utils.toArray<HTMLElement>(".window");

  windows.forEach((windowItem: HTMLElement) => {
    Draggable.create(windowItem, {
      bounds: ".window-wrapper",
    });
  });
}

function lazyLoadImages(): void {
  gsap.utils
    .toArray<HTMLImageElement>(".lazy")
    .forEach((image: HTMLImageElement) => {
      const newSRC: string | null = image.dataset.src || null;
      if (!newSRC) return;

      const newImage: HTMLImageElement = document.createElement("img");

      const loadImage = (): void => {
        newImage.onload = () => {
          newImage.onload = null;
          image.src = newSRC;
          gsap.set(newImage, {
            position: "absolute",
            top: image.offsetTop,
            left: image.offsetLeft,
            width: image.offsetWidth,
            height: image.offsetHeight,
          });
          if (image.parentNode) {
            image.parentNode.appendChild(newImage);
          }

          gsap.to(newImage, {
            opacity: 0,
            onComplete: () => {
              if (newImage.parentNode) {
                newImage.parentNode.removeChild(newImage);
              }
            },
          });

          if (st) {
            st.kill();
          }
        };
        newImage.src = newSRC;
      };

      let st: ScrollTrigger | null = ScrollTrigger.create({
        trigger: image,
        start: "-50% bottom",
        onEnter: loadImage,
        onEnterBack: loadImage,
      });
    });
}

window.addEventListener("load", (): void => {
  // setFooterOffset();
  lazyLoadImages();
  let sectionTheme: string = "dark";
  const mainNav: HTMLElement | null =
    document.querySelector<HTMLElement>("#headerNav");
  if (!mainNav) return;
  const sections: NodeListOf<HTMLElement> =
    document.querySelectorAll<HTMLElement>("[data-section]");
  if (window.outerWidth > 767) {
    loadDraggable();
  }
  sections.forEach((section: HTMLElement) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 2%",
      end: "bottom 2%",
      onEnter: () => {
        const theme = section.getAttribute("data-section");
        if (theme) {
          sectionTheme = theme;
        }
      },
      onToggle: (self: ScrollTrigger) => {
        if (self.isActive) {
          const theme = section.getAttribute("data-section");
          if (theme) {
            sectionTheme = theme;
          }
          switch (sectionTheme) {
            case "light":
              mainNav.setAttribute("data-logo-active", "dark");
              break;
            case "dark":
              mainNav.setAttribute("data-logo-active", "light");
              break;
            case "invert":
              mainNav.setAttribute("data-logo-active", "invert");
              break;
            default:
              break;
          }
        }
      },
    });
  });

  ScrollTrigger.create({
    trigger: ".approach__section",
    start: "top 90%",
    end: "bottom top",
    toggleActions: "play pause resume pause",
    onEnter: () => {
      gsap.to(".approach__image", {
        rotate: "random(-30, 30)",
        duration: 30,
        scale: "random(1.1, 1.3)",
        opacity: "random(0.4, 0.6)",
        ease: "ease",
        yoyo: true,
      });
    },
  });

  ScrollTrigger.getAll().forEach((st: ScrollTrigger) => st.disable());

  loaded.then(() => {
    ScrollTrigger.getAll().forEach((st: ScrollTrigger) => st.enable());
    ScrollTrigger.refresh();
  });
});
