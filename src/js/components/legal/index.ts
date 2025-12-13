export function initFooterYear() {
	const year_field = document.querySelector("#currentYear");
	const currentYear = new Date().getFullYear();
	if (!year_field) return;
	year_field.textContent = `${currentYear}`;
}
