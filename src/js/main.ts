import "../scss/styles.scss";
import { initializeASCII } from "./ascii-data";
import { openNav } from "./menu";

// Initialize ASCII Art Animation
initializeASCII();
openNav();
document.addEventListener("DOMContentLoaded", () => {
	const time_fields = document.querySelectorAll("[data-timezone]");
	setInterval(() => {
		time_fields.forEach((emt) => {
			const timeZone = emt.getAttribute("data-timezone");
			const time = new Intl.DateTimeFormat("en-US", {
				timeZone: timeZone as string,
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
			}).format();
			emt.innerHTML = time;
		});
	}, 1000);
});
