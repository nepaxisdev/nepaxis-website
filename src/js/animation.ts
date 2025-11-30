import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { loaded } from "./loader";

gsap.registerPlugin(
	Draggable,
	Flip,
	DrawSVGPlugin,
	ScrollTrigger,
	ScrollSmoother,
	SplitText
);

const smooth: ScrollSmoother = ScrollSmoother.create({
	smooth: 1,
	effects: true,
});

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
window.addEventListener("load", (): void => {
	lazyLoadImages();
	let sectionTheme: string = "dark";
	const mainNav: HTMLElement | null =
		document.querySelector<HTMLElement>("#headerNav");
	if (!mainNav) return;
	const sections: NodeListOf<HTMLElement> =
		document.querySelectorAll<HTMLElement>("[data-section]");
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

	ScrollTrigger.getAll().forEach((st: ScrollTrigger) => st.disable());

	loaded.then(() => {
		ScrollTrigger.getAll().forEach((st: ScrollTrigger) => st.enable());
		ScrollTrigger.refresh();
	});
});
