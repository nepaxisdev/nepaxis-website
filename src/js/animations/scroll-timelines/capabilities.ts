import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);
export function initCapabilitiesTimeline() {
	const capabilitiesTimeline = gsap
		.timeline({
			scrollTrigger: {
				trigger: ".capabilities__section",
				start: "top 60%",
				toggleActions: "play pause resume play",
			},
		})
		.addLabel("start");
	capabilitiesTimeline.fromTo(
		".services__title",
		{
			opacity: 0,
		},
		{
			duration: 1,
			opacity: 1,
			scrambleText: {
				text: "{original}",
				chars: "upperCase",
				revealDelay: 0.35,
				speed: 0.7,
			},
		},
		"start"
	);
	capabilitiesTimeline.fromTo(
		".services__paragraph",
		{
			opacity: 0,
		},
		{
			duration: 0.8,
			opacity: 1,
			yPercent: -15,
			ease: "power1.out",
		},
		"start"
	);
	capabilitiesTimeline.fromTo(
		".services__button",
		{
			opacity: 0,
		},
		{
			duration: 0.8,
			opacity: 1,
			yPercent: -20,
			ease: "power1.out",
		},
		"start+=0.2"
	);
	const mm = gsap.matchMedia();

	mm.add("(max-width:767px", () => {
		const tableItems = gsap.utils.toArray(
			".capabilities__table--sm tr"
		) as HTMLElement[];
		tableItems.forEach((item) => {
			item.dataset.scrambled = "false";
			gsap.from(item, {
				opacity: 0,
				yPercent: 20,
				duration: 0.6,
				ease: "power1.out",
				scrollTrigger: {
					trigger: item,
					start: "top 60%",
					toggleActions: "play none none none",
					onEnter: () => {
						if (item.dataset.scrambled === "true") {
							return;
						}
						const itemText = item.querySelector(".floating__image-text");
						if (itemText) {
							gsap.to(itemText, {
								duration: 0.8,
								scrambleText: {
									text: "{original}",
									chars: "upperCase",
									revealDelay: 0.5,
									speed: 0.8,
								},
								onComplete: () => {
									item.dataset.scrambled = "true";
								},
							});
						}
					},
				},
				onComplete: () => {},
			});
		});
	});
	mm.add("(min-width:768px", () => {
		const tableItems = gsap.utils.toArray(
			".capabilities__table--md tr,.capabilities__table--md th"
		) as HTMLElement[];
		tableItems.forEach((item) => {
			item.dataset.scrambled = "false";
			gsap.from(item, {
				opacity: 0,
				yPercent: 20,
				duration: 0.6,
				ease: "power1.out",
				scrollTrigger: {
					trigger: item,
					start: "top 60%",
					toggleActions: "play none none none",
					onEnter: () => {
						if (item.dataset.scrambled === "true") {
							return;
						}
						const itemText = item.querySelector(".floating__image-text");
						if (itemText) {
							gsap.to(itemText, {
								duration: 0.8,
								scrambleText: {
									text: "{original}",
									chars: "upperCase",
									revealDelay: 0.5,
									speed: 0.8,
								},
								onComplete: () => {
									item.dataset.scrambled = "true";
								},
							});
						}
					},
				},
				onComplete: () => {},
			});
		});
	});

	capabilitiesTimeline.scrollTrigger?.disable(true);
}
