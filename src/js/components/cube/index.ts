import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cube: HTMLElement | null = document.querySelector(".cube");
const cubeContainer: HTMLElement | null =
	document.querySelector(".cube-container");

// --- Orbit Animation Constants & State ---
let animationTime = 0;
const ORBIT_SPEED = 0.0005;
const ORBIT_RADIUS_X = 150;
const ORBIT_RADIUS_Y = 100;
const STABILITY_THRESHOLD = 0.001;

// --- Rotation & Interaction Variables ---
let rotateX = 0;
let rotateY = 0;
let isInteracting = false;

const offset = { x: 0, y: 0 };
let offsetTween: gsap.core.Tween | null = null;

const INTERACTION_ROTATION_VALUE = 300;

// --- GSAP ScrollTrigger Variables ---
let scrollProgress = 0;
const LERP_FACTOR = 0.05;
const SCROLL_DAMPENING_FACTOR = 0.2;

// --- Helper Functions ---

/**
 * Applies the calculated rotation to the cube element, only if movement exceeds the threshold.
 */
function rotateCube(rotX: number, rotY: number) {
	if (!cube) return;

	// STABILITY FIX: Only update CSS if the rotation is significant enough
	if (
		Math.abs(rotX - rotateX) < STABILITY_THRESHOLD &&
		Math.abs(rotY - rotateY) < STABILITY_THRESHOLD &&
		!isInteracting
	) {
		return;
	}

	// Store the rotation being applied
	rotateX = rotX;
	rotateY = rotY;
	cube.style.transform = `rotateX(${rotY}deg) rotateY(${rotX}deg) translateZ(0)`;
}

// --- Interactive Rotation Logic ---

/**
 * Calculates and applies rotation based on mouse/touch position within the container.
 */
const calculateInteractiveRotation = (clientX: number, clientY: number) => {
	if (!cubeContainer) return;

	const rect = cubeContainer.getBoundingClientRect();
	const offsetX = clientX - rect.left;
	const offsetY = clientY - rect.top;
	const normalizedX = offsetX / rect.width;
	const normalizedY = offsetY / rect.height;

	const interactiveRotateX = (normalizedX - 0.5) * INTERACTION_ROTATION_VALUE;
	const interactiveRotateY = -(normalizedY - 0.5) * INTERACTION_ROTATION_VALUE;

	// Apply the interactive rotation directly
	rotateCube(interactiveRotateX, interactiveRotateY);
};

// --- Orbit Animation Engine ---

/**
 * The main GSAP Ticker loop for the animation.
 */
function orbitLoop(_time: number, delta: number) {
	if (!cubeContainer || !cube) return;

	// EXIT EARLY: When interacting, the cube rotation is handled by the mouse/touch handlers
	if (isInteracting) return;

	// 1. Calculate Scroll Influence
	const scrollInfluence = scrollProgress * 100 * SCROLL_DAMPENING_FACTOR;

	// 2. LERP the animation time towards the scroll-dictated position
	animationTime = gsap.utils.interpolate(
		animationTime,
		scrollInfluence,
		LERP_FACTOR
	);

	// 3. Independent Idling / Constant Playback
	// Advance time only if the offset tween is not active
	if (offsetTween === null || !offsetTween.isActive()) {
		animationTime += ORBIT_SPEED * delta;
	}

	// 4. Calculate Final Rotation
	// Calculate Orbit Position
	const orbitRotX = Math.cos(animationTime) * ORBIT_RADIUS_X;
	const orbitRotY = Math.sin(animationTime) * ORBIT_RADIUS_Y;

	// Combine orbit and offset (which is only non-zero during transition)
	const finalRotX = orbitRotX + offset.x;
	const finalRotY = orbitRotY + offset.y;

	// 5. Apply the final rotation (checks threshold inside rotateCube)
	rotateCube(finalRotX, finalRotY);
}

/**
 * Starts the continuous animation loop using GSAP's ticker.
 */
function startOrbitAnimation() {
	gsap.ticker.add(orbitLoop);
}

// --- Interaction Handlers (Color Change & Transition Logic) ---

const handleInteractionEnter = () => {
	// Kill any existing offset transition
	if (offsetTween) offsetTween.kill();
	// Reset offset to zero as interaction takes absolute control
	offset.x = 0;
	offset.y = 0;
	isInteracting = true;
};

const handleInteractionLeave = () => {
	// 1. Calculate the current position of the orbit
	const orbitRotX = Math.cos(animationTime) * ORBIT_RADIUS_X;
	const orbitRotY = Math.sin(animationTime) * ORBIT_RADIUS_Y;

	// 2. Calculate the difference (Offset) between the mouse-left position (rotateX/Y)
	offset.x = rotateX - orbitRotX;
	offset.y = rotateY - orbitRotY;

	isInteracting = false;

	// 3. Tween the offset to zero over a short duration
	offsetTween = gsap.to(offset, {
		x: 0,
		y: 0,
		duration: 0.5,
		ease: "power2.out",
		onComplete: () => {
			offsetTween = null;
		},
	});
};

const handleMouseMove = (event: MouseEvent) => {
	if (!isInteracting) return;
	calculateInteractiveRotation(event.clientX, event.clientY);
};

const handleTouchMove = (event: TouchEvent) => {
	if (!isInteracting || event.touches.length !== 1) return;
	event.preventDefault();
	calculateInteractiveRotation(
		event.touches[0].clientX,
		event.touches[0].clientY
	);
};

// --- Initialization Function ---

export function initCube() {
	if (!cubeContainer) {
		console.error("Cube container not found.");
		return;
	}

	// Initialize the background color (e.g., to a default gray or white)
	cubeContainer?.style.setProperty("--background", `hsl(0 0% 90% / 90%)`);

	// 1. Mouse/Pointer Events
	cubeContainer.addEventListener("mousemove", handleMouseMove);
	cubeContainer.addEventListener("mouseenter", handleInteractionEnter);
	cubeContainer.addEventListener("mouseleave", handleInteractionLeave);

	// 2. Touch Events
	cubeContainer.addEventListener("touchmove", handleTouchMove, {
		passive: false,
	});
	cubeContainer.addEventListener("touchstart", handleInteractionEnter, {
		passive: true,
	});
	cubeContainer.addEventListener("touchend", handleInteractionLeave, {
		passive: true,
	});

	// 3. GSAP ScrollTrigger Setup
	ScrollTrigger.create({
		trigger: "body",
		start: "top top",
		end: "bottom top",
		onUpdate: (self) => {
			scrollProgress = self.progress;
		},
	});

	// 4. Start the continuous animation
	startOrbitAnimation();
}
