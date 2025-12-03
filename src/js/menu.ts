export function openNav(): void {
  const menuWrapper: HTMLDivElement | null =
    document.querySelector(".nav__main");
  const navCard: HTMLDivElement | null = document.querySelector(".nav__card");
  if (!menuWrapper) {
    console.warn("Navigation menu wrapper not found (.nav__main).");
    return;
  }

  const menuButton: HTMLButtonElement | null =
    menuWrapper.querySelector(".menu__btn");

  if (!menuButton) {
    console.warn("Navigation menu button not found (.menu__btn).");
    return;
  }

  const navLinks: NodeListOf<HTMLAnchorElement> =
    menuWrapper.querySelectorAll(".nav__list-link");

  // --- 1. Toggle menu on button click ---
  menuButton.addEventListener("click", function (e: MouseEvent): void {
    e.stopPropagation();
    menuWrapper.classList.toggle("nav--toggled");
  });

  // --- 2. Close menu when clicking outside of it ---
  document.addEventListener("click", function (e: MouseEvent): void {
    // Check if the clicked target (e.target) is NOT contained within the menuWrapper
    if (navCard) {
      if (!navCard.contains(e.target as Node)) {
        menuWrapper.classList.remove("nav--toggled");
      }
    }
  });

  // --- 3. Close menu when a nav link is clicked ---
  navLinks.forEach((link: HTMLAnchorElement) => {
    link.addEventListener("click", function (): void {
      menuWrapper.classList.remove("nav--toggled");
    });
  });

  // --- 4. Close menu on Escape key ---
  document.addEventListener("keydown", function (e: KeyboardEvent): void {
    if (e.key === "Escape") {
      menuWrapper.classList.remove("show__list");
    }
  });
}
