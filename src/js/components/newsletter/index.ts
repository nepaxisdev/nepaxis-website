import { NotificationModal } from "../modals";

const validateNewsletterForm = (form: HTMLFormElement) => {
	// Implement or reuse a simple email validation check here
	const email = form.querySelector("#newsletterEmail") as HTMLInputElement;
	let isValid = true;

	// Example validation logic (simplified)
	if (!email.value.trim()) {
		// setError(email, "Email is required");
		isValid = false;
	} else {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.value.trim())) {
			// setError(email, "Enter a valid email");
			isValid = false;
		}
	}
	return isValid;
};

export function handleNewsLetter() {
	const newsletter: HTMLFormElement | null =
		document.querySelector("#newsletter") || null;
	if (!newsletter) {
		return;
	}

	newsletter.addEventListener("submit", async (event: SubmitEvent) => {
		event.preventDefault();
		const submitButton: HTMLButtonElement | null =
			document.querySelector("#newsletterSubmit") || null;
		const submitButtonText: HTMLSpanElement | HTMLDivElement | null =
			submitButton?.querySelector(".btn__text") || null;
		let originalText = "";
		if (submitButton) {
			submitButton.disabled = true;
			if (submitButtonText) {
				originalText = submitButtonText.textContent;
				submitButtonText.textContent = "Subscribing!";
			}
		}
		const isValid = validateNewsletterForm(newsletter);
		if (!isValid) return;

		const emailInput = newsletter.querySelector(
			"#newsletterEmail"
		) as HTMLInputElement;
		const email = emailInput.value.trim();
		try {
			const response = await fetch("/api/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email }),
			});
			const data = await response.json();
			if (response.ok) {
				await new NotificationModal(
					`
				<div class="modal__header">
					<h5 class="modal__title">Success! You're in the loop.</h5>
				</div>
				<div class="modal__content">
					<p>Welcome aboard! We hate inbox clutter as much as you do. Rest assured, we'll only send you [Specific Content, e.g., high-quality updates and exclusive tips]. Your email is safe with us; We respect your privacy and will never spam you.</p>
				</div>
		`
				).open();
			} else {
				await new NotificationModal(
					`
			<div class="modal__header">
				<h5 class="modal__title">There was an issue.</h5>
			</div>
			<div class="modal__content">
				<p>${data.message || data.detail}</p>
			</div>
		`
				).open();
			}
		} catch (error) {
			await new NotificationModal(
				`
					<div class="modal__header">
						<h5 class="modal__title">Something went wrong.</h5>
					</div>
					<div class="modal__content">
						<p class="font-serif mb-2">
							${error}
						</p>
						<div><small>We are working on this issue. If it persists after some time, please email us at: <a class="link" href="mailto:support@nepaxis.com">support@nepaxis.com</a></small></div>
					</div>
				`
			).open();
			console.error(error);
		} finally {
			if (submitButton) {
				submitButton.textContent = originalText;
				submitButton.disabled = false;
			}
		}
	});
}
