document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector("#contactForm") as HTMLFormElement | null;
	if (!form) return;

	const submitBtn = form.querySelector(
		'button[type="submit"]'
	) as HTMLButtonElement | null;
	let originalText = "";

	// Utility: show error on a field
	const setError = (
		field: HTMLInputElement | HTMLTextAreaElement,
		message: string
	) => {
		const group = field.closest(".form__group");
		if (!group) return;

		group.classList.add("error");

		const errorEl = group.querySelector(".error-message") as HTMLElement | null;
		if (errorEl) errorEl.textContent = message;
	};

	// Utility: clear all errors
	const clearErrors = () => {
		const groups = form.querySelectorAll(".form__group.error");
		groups.forEach((g) => g.classList.remove("error"));

		const messages = form.querySelectorAll(".error-message");
		messages.forEach((m) => (m.textContent = ""));
	};

	const validateForm = () => {
		clearErrors();

		const fullName = form.querySelector("#fullName") as HTMLInputElement;
		const companyName = form.querySelector("#companyName") as HTMLInputElement;
		const email = form.querySelector("#email") as HTMLInputElement;
		const phoneNumber = form.querySelector("#phoneNumber") as HTMLInputElement;
		const message = form.querySelector("#message") as HTMLTextAreaElement;

		let isValid = true;

		// Required fields
		if (!fullName.value.trim()) {
			setError(fullName, "Full Name is required");
			isValid = false;
		}

		if (!companyName.value.trim()) {
			setError(companyName, "Company Name is required");
			isValid = false;
		}

		if (!email.value.trim()) {
			setError(email, "Email is required");
			isValid = false;
		} else {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email.value.trim())) {
				setError(email, "Enter a valid email");
				isValid = false;
			}
		}

		// Optional phone number
		if (phoneNumber.value.trim()) {
			const phoneRegex = /^[0-9+\-\s()]{7,}$/;
			if (!phoneRegex.test(phoneNumber.value.trim())) {
				setError(phoneNumber, "Enter a valid phone number");
				isValid = false;
			}
		}

		// Optional message, but if present validate minimum length
		if (message.value.trim() && message.value.trim().length < 5) {
			setError(message, "Message must be at least 5 characters");
			isValid = false;
		}

		return isValid;
	};

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		console.log("Trying to submit");
		const isValid = validateForm();
		if (!isValid) return;

		const formData = new FormData(form);
		formData.append("access_key", "5e3a9806-0470-49b0-ab74-d7109400cdc6");

		if (submitBtn) {
			originalText = submitBtn.textContent || "";
			submitBtn.textContent = "Sending...";
			submitBtn.disabled = true;
		}

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (response.ok) {
				form.reset();
			} else {
				// Generic full form error — you can put this anywhere if needed
				alert("Submission error: " + data.message);
			}
		} catch {
			alert("Something went wrong.");
		} finally {
			if (submitBtn) {
				submitBtn.textContent = originalText;
				submitBtn.disabled = false;
			}
		}
	});
});
