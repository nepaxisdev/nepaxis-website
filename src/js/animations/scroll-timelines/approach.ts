import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(SplitText, ScrollTrigger, ScrambleTextPlugin);

export function initApproachSectionAnimations() {
	SplitText.create(".approach__text", {
		type: "lines",
		autoSplit: true,
		linesClass: "line",
		onSplit: (splitText) => {
			const lines = splitText.lines;
			return gsap.to(lines, {
				stagger: 1,
				duration: 1.5,
				ease: "none",
				backgroundSize: "100%",
				scrollTrigger: {
					trigger: lines,
					start: "center 80%",
					end: "center 20%",
					scrub: true,
				},
			});
		},
	});
	gsap.set(".approach__title", {
		opacity: 0,
	});
	let approachSectionTimeline = gsap.timeline({
		scrollTrigger: {
			trigger: ".approach__section",
			start: "top 90%",
			end: "top 20%",
			toggleActions: "play none none none",
			scrub: true,
		},
	});

	const mm = gsap.matchMedia();
	mm.add("(min-width:992px)", () => {
		approachSectionTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: ".approach__section",
				start: "top 90%",
				end: "bottom 30%",
				toggleActions: "play none none none",
				scrub: true,
			},
		});
	});

	approachSectionTimeline.addLabel("start").to(".approach__title", {
		duration: 0.8,
		opacity: 1,
		scrambleText: {
			text: "{original}",
			chars: "upperAndLowerCase",
			revealDelay: 0.5,
			speed: 0.8,
		},
	});
	approachSectionTimeline.fromTo(
		".approach__subtitle",
		{
			opacity: 0,
			yPercent: 50,
			duration: 0.7,
			ease: "power1.out",
		},
		{
			opacity: 1,
			yPercent: 0,
		},
		"start+=0.5"
	);

	const approachItems = gsap.utils.toArray(".approach__item") as Element[];

	approachItems.forEach((item, index) => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: item,
				start: `top ${100 + approachItems.length * 10 - index * 12}%`,
				end: `bottom ${100 + approachItems.length * 10 - index * 10}%`,
				toggleActions: "play pause resume reset",
				scrub: true,
			},
		});

		tl.from(item, {
			yPercent: 50,
			opacity: 0.2,
			ease: "back.out",
			duration: 3,
		}).addLabel("start");
	});
}
