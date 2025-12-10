import gsap from "gsap";

// Define global types for objects used throughout the script
interface MousePosition {
  x: number;
  y: number;
}

interface AnimatableProperty {
  previous: number;
  current: number;
  amt: number; // Amount for linear interpolation
}

interface AnimatableProperties {
  tx: AnimatableProperty;
  ty: AnimatableProperty;
  rotation: AnimatableProperty;
  brightness: AnimatableProperty;
  [key: string]: AnimatableProperty; // Index signature for iteration
}

// ----- utils -----

/**
 * Maps a number x from an input range [a, b] to an output range [c, d].
 */
const map = (x: number, a: number, b: number, c: number, d: number): number =>
  ((x - a) * (d - c)) / (b - a) + c;

/**
 * Linear interpolation between a and b by amount n.
 */
const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;

/**
 * Clamps a number to be within a specific range [min, max].
 */
const clamp = (num: number, min: number, max: number): number =>
  num <= min ? min : num >= max ? max : num;

/**
 * Gets the mouse position from a MouseEvent.
 */
const getMousePos = (ev: MouseEvent): MousePosition => {
  return {
    x: ev.clientX,
    y: ev.clientY,
  };
};

// ----- main menu logic ------
const menuEl = document.querySelector(".capabilities__section") as HTMLElement;
const DOM: { el: HTMLElement; menuItems?: NodeListOf<HTMLElement> } = {
  el: menuEl,
};
DOM.menuItems = DOM.el.querySelectorAll(".floating__image-wrapper");

// ---------- core -----------
let images: [number, string][] = [];
DOM.menuItems.forEach((item: Element, index: number) => {
  const url = item.getAttribute("data-img");
  if (url) {
    images.push([index, url]);
  }
});

let mousepos: MousePosition = { x: 0, y: 0 };
// cache the mouse position
let mousePosCache: MousePosition = { ...mousepos };
let direction: MousePosition = {
  x: mousePosCache.x - mousepos.x,
  y: mousePosCache.y - mousepos.y,
};

// update mouse position when moving the mouse
window.addEventListener(
  "mousemove",
  (ev: MouseEvent) => (mousepos = getMousePos(ev))
);

// -------
const animatableProperties: AnimatableProperties = {
  // translationX
  tx: { previous: 0, current: 0, amt: 0.08 },
  // translationY
  ty: { previous: 0, current: 0, amt: 0.08 },
  // Rotation angle
  rotation: { previous: 0, current: 0, amt: 0.08 },
  // CSS filter (brightness) value
  brightness: { previous: 1, current: 1, amt: 0.08 },
};

class MenuItem {
  private DOM: {
    el: HTMLElement;
    textInner: HTMLElement;
    reveal: HTMLElement;
    revealInner: HTMLElement;
    revealImage: HTMLElement;
  };
  private inMenuPosition: number;
  private animatableProperties: AnimatableProperties;
  private bounds!: { el: DOMRect; reveal: DOMRect };
  private firstRAFCycle: boolean = false;
  private requestId: number | undefined;
  private mouseenterFn: ((ev: MouseEvent) => void) | undefined;
  private mouseleaveFn: (() => void) | undefined;

  constructor(
    el: HTMLElement,
    inMenuPosition: number,
    animatableProperties: AnimatableProperties
  ) {
    this.DOM = { el } as any; // Temporary cast, filled in layout
    this.inMenuPosition = inMenuPosition;
    this.animatableProperties = animatableProperties;

    const textInner = this.DOM.el.querySelector(".floating__image-text");
    if (textInner) {
      this.DOM.textInner = textInner as HTMLElement;
    }

    this.layout();
    this.initEvents();
  }
  public getTextInner(): HTMLElement {
    return this.DOM.textInner;
  }

  private layout(): void {
    // Create the image structure
    this.DOM.reveal = document.createElement("div");
    this.DOM.reveal.className = "hover-reveal";

    this.DOM.revealInner = document.createElement("div");
    this.DOM.revealInner.className = "hover-reveal__inner";

    this.DOM.revealImage = document.createElement("div");
    this.DOM.revealImage.className = "hover-reveal__img";
    this.DOM.revealImage.style.backgroundImage = `url(${
      images[this.inMenuPosition][1]
    })`;

    this.DOM.revealInner.appendChild(this.DOM.revealImage);
    this.DOM.reveal.appendChild(this.DOM.revealInner);
    this.DOM.el.appendChild(this.DOM.reveal);
  }

  private calcBounds(): void {
    this.bounds = {
      el: this.DOM.el.getBoundingClientRect(),
      reveal: this.DOM.reveal.getBoundingClientRect(),
    };
  }

  private initEvents(): void {
    this.mouseenterFn = () => {
      this.showImage();
      this.firstRAFCycle = true;
      this.loopRender();
    };

    this.mouseleaveFn = () => {
      this.stopRendering();
      this.hideImage();
    };

    this.DOM.el.addEventListener("mouseenter", this.mouseenterFn);
    this.DOM.el.addEventListener("mouseleave", this.mouseleaveFn);
  }

  private showImage(): void {
    // Restore the GSAP Timeline logic
    gsap.killTweensOf(this.DOM.revealInner);
    gsap.killTweensOf(this.DOM.revealImage);

    gsap
      .timeline({})
      // Animate the image wrap (revealInner)
      .to(this.DOM.revealInner, 0.2, {
        ease: "Sine.easeOut",
        startAt: { x: direction.x < 0 ? "-100%" : "100%" },
        x: "0%",
        onStart: () => {
          // Show the image element
          this.DOM.reveal.style.opacity = "1";
          // Set a high z-index value so image appears on top of other elements
          gsap.set(this.DOM.el, { zIndex: images.length });
        },
      })
      // Animate the image element (revealImage)
      .to(
        this.DOM.revealImage,
        0.2,
        {
          ease: "Sine.easeOut",
          startAt: { x: direction.x < 0 ? "100%" : "-100%" },
          x: "0%",
        },
        0
      ); // Start image animation at the same time as revealInner
  }

  private hideImage(): void {
    // Restore the GSAP Timeline logic
    gsap.killTweensOf(this.DOM.revealInner);
    gsap.killTweensOf(this.DOM.revealImage);

    gsap
      .timeline({
        onStart: () => {
          gsap.set(this.DOM.el, { zIndex: 1 });
        },
        onComplete: () => {
          gsap.set(this.DOM.reveal, { opacity: 0 });
        },
      })
      .to(this.DOM.revealInner, 0.2, {
        ease: "Sine.easeOut",
        x: direction.x < 0 ? "100%" : "-100%",
      })
      .to(
        this.DOM.revealImage,
        0.2,
        {
          ease: "Sine.easeOut",
          x: direction.x < 0 ? "-100%" : "100%",
        },
        0
      );
  }

  private loopRender(): void {
    if (!this.requestId) {
      this.requestId = requestAnimationFrame(() => this.render());
    }
  }

  private stopRendering(): void {
    if (this.requestId) {
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
    }
  }

  public render(): void {
    this.requestId = undefined;

    if (this.firstRAFCycle) {
      this.calcBounds();
    }

    // Calculate the mouse distance and direction
    const mouseDistanceX = clamp(
      Math.abs(mousePosCache.x - mousepos.x),
      0,
      100
    );
    direction = {
      x: mousePosCache.x - mousepos.x,
      y: mousePosCache.y - mousepos.y,
    };
    mousePosCache = { x: mousepos.x, y: mousepos.y };

    // 1. Calculate new translation (center the image on the mouse relative to the menu item)
    this.animatableProperties.tx.current =
      Math.abs(mousepos.x - this.bounds.el.left) - this.bounds.reveal.width / 2;
    this.animatableProperties.ty.current =
      Math.abs(mousepos.y - this.bounds.el.top) - this.bounds.reveal.height / 2;

    // 2. Calculate new rotation (based on horizontal mouse velocity/distance)
    this.animatableProperties.rotation.current = this.firstRAFCycle
      ? 0
      : map(mouseDistanceX, 0, 100, 0, direction.x < 0 ? 120 : -120);

    // 3. Calculate new brightness (based on horizontal mouse velocity/distance)
    this.animatableProperties.brightness.current = this.firstRAFCycle
      ? 1
      : map(mouseDistanceX, 0, 100, 1, 4);

    // Interpolate all animatable properties
    for (const key in this.animatableProperties) {
      this.animatableProperties[key].previous = this.firstRAFCycle
        ? this.animatableProperties[key].current
        : lerp(
            this.animatableProperties[key].previous,
            this.animatableProperties[key].current,
            this.animatableProperties[key].amt
          );
    }

    // Set styles using GSAP for optimized property application
    gsap.set(this.DOM.reveal, {
      x: this.animatableProperties.tx.previous,
      y: this.animatableProperties.ty.previous,
      rotation: this.animatableProperties.rotation.previous,
      filter: `brightness(${this.animatableProperties.brightness.previous})`,
    });

    this.firstRAFCycle = false;
    this.loopRender();
  }
}

// Initialize MenuItems
const menuItems: MenuItem[] = [];
[...(DOM.menuItems as unknown as HTMLElement[])].forEach((item, pos) => {
  menuItems.push(new MenuItem(item, pos, animatableProperties));
});

// Function to animate the text inner elements on load
export function initShowMenuImages(): void {
  const textInners: HTMLElement[] = menuItems.map((item) =>
    item.getTextInner()
  );

  gsap.to(textInners, {
    duration: 1.2,
    ease: "expo.easeOut",
    startAt: { y: "100%" },
    y: 0,
    delay: (pos: number) => pos * 0.06,
  });
}
