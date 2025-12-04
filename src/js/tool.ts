import "../scss/styles.scss";

const reg_tests = {
	px: /^\d+(?:px)?$/,
	rem: /^\d+(?:rem)?$/,
};

function getDecimalPlaces(num: number): number {
	const parts = String(num).split(".");
	if (parts.length === 1) return num;
	const decimalPart = parts[1];
	if (decimalPart.length <= 2) {
		if (Number(decimalPart.charAt(-1)) === 0)
			return parseFloat(parts[0] + "." + decimalPart.slice(0, 1));
	}
	return parseFloat(num.toFixed(2));
}

function mapTable(tableOutput: HTMLTableElement, fontSize: number): void {
	const tBody = tableOutput.querySelector("tbody");
	if (tBody) {
		tBody.innerHTML = "";
	}
	for (let i = 1; i <= 200; i += 2) {
		tBody?.insertAdjacentHTML(
			"beforeend",
			`<tr>
			<td class="text-center" style="background-color:hsl(0 0% 5%);inline-size:2rem">${i}</td>
			<td>
				<div class="fl-row al-center gap-1" data-clipboard-text="${i}px">
					<span>${i}<span class="unit">px</span></span>
					<span class="sr-only">Copy ${i} pixels to clipboard</span>	
					<span class="copy-area fl-row al-center jc-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="copy-icon neutral-500" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
							<span class="tooltip">Copied!</span>
					</span>
				</div>
			</td>
			<td>
			<div class="fl-row al-center gap-1" data-clipboard-text="${getDecimalPlaces(
				i / fontSize
			)}rem">
				<span>${getDecimalPlaces(i / fontSize)}<span class="unit">rem</span> </span>
				<span class="sr-only">Copy ${i} pixels as rem to clipboard</span>	
				<span class="copy-area fl-row al-center jc-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="copy-icon neutral-500" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
						<span class="tooltip">Copied!</span>
				</span>
			</div>
			</td>
			<td class="text-center" style="background-color:hsl(0 0% 5%);inline-size:2rem">${
				i + 1
			}</td>
			<td>
				<div class="fl-row al-center gap-1" data-clipboard-text="${i + 1}px">
					<span>${i + 1}<span class="unit">px</span></span>
					<span class="sr-only">Copy ${i + 1} pixels to clipboard</span>	
					<span class="copy-area fl-row al-center jc-center">
							<svg xmlns="http://www.w3.org/2000/svg" class="copy-icon neutral-500" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
							<span class="tooltip">Copied!</span>
					</span>
				</div>
			</td>
			<td>
			<div class="fl-row al-center gap-1" data-clipboard-text="${getDecimalPlaces(
				(i + 1) / fontSize
			)}rem">
				<span>${getDecimalPlaces(
					(i + 1) / fontSize
				)}<span class="unit">rem</span> </span>
				<span class="sr-only">Copy ${i + 1} pixels as rem to clipboard</span>	
				<span class="copy-area fl-row al-center jc-center">
						<svg xmlns="http://www.w3.org/2000/svg" class="copy-icon neutral-500" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy-icon lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
						<span class="tooltip">Copied!</span>
				</span>
			</div>
			</td>
		</tr>`
		);
	}
}
function initializeCopier() {
	const copyButtons = document.querySelectorAll<HTMLElement>(
		"[data-clipboard-text]"
	);
	copyButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const textToCopy = button.getAttribute("data-clipboard-text");
			if (textToCopy) {
				navigator.clipboard.writeText(textToCopy).then(() => {
					const tooltip = button.querySelector<HTMLElement>(".tooltip");
					if (tooltip) {
						tooltip.classList.add("visible");
						setTimeout(() => {
							tooltip.classList.remove("visible");
						}, 1000);
					}
				});
			}
		});
	});
}
document.addEventListener("DOMContentLoaded", () => {
	let fontSizeInput: HTMLInputElement = document.querySelector(
		"#bodySize"
	) as HTMLInputElement;
	let tableOutput: HTMLTableElement = document.querySelector(
		"#fontMap"
	) as HTMLTableElement;
	let fontSize: number = fontSizeInput.value
		? parseInt(fontSizeInput.value)
		: 16;
	const updateButton: HTMLButtonElement = document.querySelector(
		"#updateButton"
	) as HTMLButtonElement;

	updateButton.addEventListener("click", (e) => {
		e.preventDefault();
		fontSize = fontSizeInput.value ? parseInt(fontSizeInput.value) : 16;
		mapTable(tableOutput, fontSize);
		initializeCopier();
	});
	mapTable(tableOutput, fontSize);
	initializeCopier();

	const valueInputWrappers =
		document.querySelectorAll<HTMLInputElement>("[data-unit]");

	valueInputWrappers.forEach((item) => {
		const input = item.querySelector<HTMLInputElement>("input")!;
		const unit: string | null = item.getAttribute("data-unit");
		input.addEventListener("keyup", (e) => {
			e.preventDefault();
			const value = input.value;
			if (isNaN(Number(value))) {
				if (unit) {
					if (reg_tests[unit as keyof typeof reg_tests].test(value)) {
						input.value = parseFloat(value).toString();
						input.setCustomValidity("");
						input.closest(".form__input")!.classList.remove("input-error");
					} else {
						input.closest(".form__input")!.classList.add("input-error");
						input.setCustomValidity("");
					}
				}
			} else {
				input.value = value;
				input.setCustomValidity("");
				input.closest(".form__input")!.classList.remove("input-error");
			}
		});
	});
});
