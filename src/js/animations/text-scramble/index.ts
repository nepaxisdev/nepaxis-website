import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { loaded } from "../../components/loader";

export function initTextScramble() {
  gsap.registerPlugin(ScrambleTextPlugin);
  const texts = document.querySelectorAll(".scramble__item");
  const scrambleEffect = gsap.to(".scramble__item", {
    duration: 1,
    paused: true,
    scrambleText: {
      text: "Empowering Your Digital Journey",
      chars: "XO",
      revealDelay: 0.5,
      speed: 0.3,
    },
  });

  loaded.then(() => {
    scrambleEffect.paused(false);
  });
}
