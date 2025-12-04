import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let resolveLoaded: (value: boolean) => void;

let bgEffectInterval: ReturnType<typeof setInterval>;
export const loaded = new Promise<boolean>((resolve) => {
	resolveLoaded = resolve;
});

interface Progress {
	value: number;
}

function initCanvas() {
	const canvas: HTMLCanvasElement | null =
		document.querySelector("#loading-matrix");

	if (!canvas) return;

	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const w = (canvas.width = window.innerWidth);
	const h = (canvas.height = window.innerHeight);
	const cols = Math.floor(w / 20) + 1;
	const ypos = Array(cols).fill(0);

	ctx.fillStyle = "";
	ctx.fillRect(0, 0, w, h);

	function matrix() {
		if (!ctx) return;

		ctx.fillStyle = "#1515156f";
		ctx.fillRect(0, 0, w, h);

		ctx.fillStyle = "#2c2c2c";
		ctx.font = "15pt 'Space Mono'";

		ypos.forEach((y, ind) => {
			const text = String.fromCharCode(Math.random() * 128);
			const x = ind * 20;
			ctx.fillText(text, x, y);
			if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
			else ypos[ind] = y + 20;
		});
	}

	bgEffectInterval = setInterval(matrix, 70);
}

document.addEventListener("DOMContentLoaded", async function (): Promise<void> {
	initCanvas();
	const loader: HTMLElement | null = document.getElementById("loader");
	const loaderPercent: HTMLElement | null =
		document.getElementById("loader-percent");

	if (!loader || !loaderPercent) {
		console.error("Loader elements not found. Script stopped.");
		resolveLoaded(true);
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
				clearInterval(bgEffectInterval);
				gsap.to(loader, {
					opacity: 0,
					duration: 1,
					ease: "ease",
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
