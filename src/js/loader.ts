import { openNav } from "./menu";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let resolveLoaded: (value: boolean) => void;
export const loaded = new Promise<boolean>((resolve) => {
	resolveLoaded = resolve;
});

interface Progress {
	value: number;
}

document.addEventListener("DOMContentLoaded", async function (): Promise<void> {
	const loader: HTMLElement | null = document.getElementById("loader");
	const loaderPercent: HTMLElement | null =
		document.getElementById("loader-percent");

	if (!loader || !loaderPercent) {
		console.error("Loader elements not found. Script stopped.");
		return;
	}

	let progress: Progress = { value: 0 };

	const fakeLoading = gsap.to(progress, {
		value: 90,
		duration: 3,
		ease: "power1.out",
		onUpdate: () => {
			loaderPercent.textContent = Math.floor(progress.value) + "%";
		},
	});

	window.onload = () => {
		fakeLoading.kill();
		gsap.to(progress, {
			value: 100,
			duration: 1,
			ease: "power1.out",
			onUpdate: () => {
				loaderPercent.textContent = Math.floor(progress.value) + "%";
			},
			onComplete: () => {
				gsap.to(loader, {
					yPercent: 100,
					duration: 0.6,
					ease: "power1.inOut",
					onComplete: () => {
						loader.remove();
						resolveLoaded(true);
					},
				});
			},
		});
	};

	requestAnimationFrame(() => {
		ScrollTrigger.refresh();
	});
});
