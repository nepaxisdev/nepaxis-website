type ToastOptions = {
	id?: string;
	duration?: number;
	type?: "success" | "error" | "info";
	maxStack?: number; // optional cap
};

const createElement = <T extends HTMLElement>(
	tag: string,
	options: Partial<T> = {},
	children: (HTMLElement | string)[] = []
): T => {
	const el = document.createElement(tag) as T;

	Object.assign(el, options);

	for (const child of children) {
		if (typeof child === "string")
			el.appendChild(document.createTextNode(child));
		else el.appendChild(child);
	}
	return el;
};

export abstract class BaseModal {
	protected container: HTMLElement;

	constructor() {
		this.container = this.createBase();
		document.body.appendChild(this.container);
	}

	protected createBase(): HTMLElement {
		const wrapper = document.createElement("div");
		wrapper.className = "modal";

		wrapper.innerHTML = `
            <div class="modal__overlay"></div>
            <div class="modal__dialog"></div>
        `;

		const overlay = wrapper.querySelector(".modal__overlay") as HTMLElement;
		overlay.addEventListener("click", () => this.onOverlayClick());

		return wrapper;
	}

	protected getContentElement(): HTMLElement {
		return this.container.querySelector(".modal__dialog") as HTMLElement;
	}

	protected onOverlayClick(): void {
		// Subclasses may override if needed
		this.close();
	}

	public open(): void {
		this.container.classList.add("modal--active");
	}

	public close(): void {
		this.container.classList.remove("modal--active");
		this.destroy();
	}

	protected destroy(): void {
		this.container.remove();
	}
}

export class ConfirmationModal extends BaseModal {
	private resolveFn: ((value: boolean) => void) | null;
	private text: string;
	private confirmText: string;
	private cancelText: string;

	constructor(
		text: string,
		confirmText: string = "Confirm",
		cancelText: string = "Cancel"
	) {
		super();

		this.text = text;
		this.confirmText = confirmText;
		this.cancelText = cancelText;

		this.resolveFn = null;

		this.build();
	}

	private build(): void {
		const content = this.getContentElement();
		content.innerHTML = `
            <p>${this.text}</p>
            <div class="modal__actions">
                <button class="modal__cancel">${this.cancelText}</button>
                <button class="modal__confirm">${this.confirmText}</button>
            </div>
        `;

		const cancelBtn = content.querySelector(".modal__cancel") as HTMLElement;
		const confirmBtn = content.querySelector(".modal__confirm") as HTMLElement;

		cancelBtn.addEventListener("click", () => this.handleCancel());
		confirmBtn.addEventListener("click", () => this.handleConfirm());
	}

	private handleConfirm(): void {
		if (this.resolveFn) this.resolveFn(true);
		this.close();
	}

	private handleCancel(): void {
		if (this.resolveFn) this.resolveFn(false);
		this.close();
	}

	public open(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			this.resolveFn = resolve;
			super.open();
		});
	}

	protected override onOverlayClick(): void {
		this.handleCancel();
	}
}

export class NotificationModal extends BaseModal {
	private message: string | HTMLElement;
	private dismissText: string;

	constructor(message: string, dismissText: string = "Dismiss") {
		super();

		this.message = message;
		this.dismissText = dismissText;

		this.build();
	}

	private build(): void {
		const content = this.getContentElement();
		content.innerHTML = `
            <div class="modal__body">${this.message}</div>
            <div class="fl-row jc-end al-center modal__actions">
                <button class="modal__dismiss btn--outline btn--inverse">${this.dismissText}</button>
            </div>
        `;

		const dismissBtn = content.querySelector(".modal__dismiss") as HTMLElement;
		dismissBtn.addEventListener("click", () => this.close());
	}
}

export class ToastManager {
	private static instance: ToastManager;
	private toastMap = new Map<string, number>(); // id -> timeout id
	private container: HTMLDivElement;

	private constructor() {
		this.container = createElement<HTMLDivElement>("div", {
			className: "toast-container",
		});

		document.body.appendChild(this.container);
	}

	static getInstance(): ToastManager {
		if (!ToastManager.instance) ToastManager.instance = new ToastManager();
		return ToastManager.instance;
	}

	show(message: string, options: ToastOptions = {}) {
		const id = options.id || crypto.randomUUID();
		const duration = options.duration ?? 5000;

		// If maxStack is set, remove oldest toasts
		if (
			options.maxStack &&
			this.container.children.length >= options.maxStack
		) {
			const first = this.container.firstElementChild as HTMLElement;
			if (first?.id) this.remove(first.id);
		}

		const toast = createElement<HTMLDivElement>(
			"div",
			{
				className: `toast ${options.type ?? "info"}`,
				id,
			},
			[message]
		);

		// Manual dismissal
		toast.onclick = () => this.remove(id);

		// Append = stacked toasts by default
		this.container.appendChild(toast);

		// Timeout-based removal
		const timeout = window.setTimeout(() => this.remove(id), duration);
		this.toastMap.set(id, timeout);

		return id;
	}

	remove(id: string) {
		const timeout = this.toastMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.toastMap.delete(id);
		}

		const el = document.getElementById(id);
		if (!el) return;

		el.classList.add("fade-out");

		// Allow animation to complete
		setTimeout(() => {
			el.remove();
		}, 150);
	}
}
