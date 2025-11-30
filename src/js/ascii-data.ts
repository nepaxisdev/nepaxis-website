import { ASCII_CONTENT as ascii } from "./ascii";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";


export function initializeASCII(){

	document.addEventListener("DOMContentLoaded", () => {
			const asciiText = document.querySelector(".ascii__art");
			// Ensure 'ascii' is defined globally or imported elsewhere
			// Example: const ascii = "YOUR ASCII ART STRING HERE";
			if (typeof ascii !== 'undefined' && asciiText) {
					asciiText.innerHTML = ascii;
			} else {
					console.error("ASCII text variable 'ascii' is not defined.");
					return;
			}
			
			gsap.registerPlugin(SplitText);
	
			document.fonts.ready.then(() => {
	
					// --- CONSTANTS ---
					const MAX_DISTANCE = 120; // Maximum distance for effect in pixels
					const MAX_FONT_WEIGHT = 900;
					const MIN_FONT_WEIGHT = 100;
					const THROTTLING_FACTOR = 2; // Process only 1/2 of characters per frame
					const GRID_CELL_SIZE = 250; // Size of the spatial hash grid cell in pixels
					
					const INACTIVE_COLOR = "hsl(0 0% 38%)";
					const ACTIVE_COLOR_HUE = 71; // Base hue for mapping (38% to 71%)
	
					// --- PRE-CALCULATIONS (Relative to Container) ---
					const ascii_split = new SplitText(asciiText, { type: "chars,lines", charsClass: "char" }).chars;
					const bounds = asciiText.getBoundingClientRect();
					const containerX = bounds.left + window.scrollX;
					const containerY = bounds.top + window.scrollY;
					
					// Cache the character positions relative to the container's top-left corner
					const charPositions = ascii_split.map((char, index) => {
							const itemRect = char.getBoundingClientRect();
							const x = itemRect.left + itemRect.width / 2 + window.scrollX - containerX;
							const y = itemRect.top + itemRect.height / 2 + window.scrollY - containerY;
							return {
									char: char,
									x: x,
									y: y,
									index: index // Used for throttling
							};
					});
	
					// --- SPATIAL HASHING STRUCTURE ---
					const spatialGrid = new Map();
					
					const getCellId = (x: number, y: number) => {
							const col = Math.floor(x / GRID_CELL_SIZE);
							const row = Math.floor(y / GRID_CELL_SIZE);
							return `${col}_${row}`;
					};
	
					// Populate the spatial grid once on load
					charPositions.forEach(pos => {
							const id = getCellId(pos.x, pos.y);
							if (!spatialGrid.has(id)) {
									spatialGrid.set(id, []);
							}
							spatialGrid.get(id).push(pos);
					});
					// --- END SPATIAL HASHING SETUP ---
					
					let frameCount = 0;
					let mm = gsap.matchMedia();
					
					// --- CORE UPDATE FUNCTION (Shared by Desktop & Mobile) ---
					const processActiveArea = (pointX: number, pointY: number) => {
							frameCount++;
							
							// 1. Determine active grid cells (9 cells around the central cell)
							const activeCellId = getCellId(pointX, pointY);
							const [centerCol, centerRow] = activeCellId.split('_').map(Number);
							const neighborOffsets = [-1, 0, 1];
							
							let charactersToProcess: { char: HTMLElement; x: number; y: number; index: number }[] = [];
							
							neighborOffsets.forEach(colOffset => {
									neighborOffsets.forEach(rowOffset => {
											const id = `${centerCol + colOffset}_${centerRow + rowOffset}`;
											if (spatialGrid.has(id)) {
													charactersToProcess.push(...spatialGrid.get(id));
											}
									});
							});
							
							// 2. Process only the characters in the active cells (Spatial Hashing)
							charactersToProcess.forEach(({ char, x: charX, y: charY, index }) => {
									
									// 3. Per-Character Throttling
									if (index % THROTTLING_FACTOR !== (frameCount % THROTTLING_FACTOR)) {
											return; 
									}
									
									// 4. Distance Calculation
									const distance = Math.max(0, Math.hypot(pointX - charX, pointY - charY));
									
									// 5. Direct Math Mapping (Performance)
									const ratio = distance / MAX_DISTANCE;
									
									let finalFontWeight;
									let finalColor;
	
									if (distance >= MAX_DISTANCE) {
											finalFontWeight = MIN_FONT_WEIGHT;
											finalColor = INACTIVE_COLOR;
									} else {
											// Font Weight: MAX_FONT_WEIGHT (900) to MIN_FONT_WEIGHT (100)
											// The ratio goes from 0 to 1 as distance goes 0 to MAX_DISTANCE
											const weightRatio = 1 - ratio; 
											const fontWeight = MIN_FONT_WEIGHT + weightRatio * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
											finalFontWeight = Math.round(fontWeight);
											
											// Color: ACTIVE_COLOR_HUE (71) to INACTIVE_COLOR (38)
											const colorLuminance = 38 + weightRatio * (ACTIVE_COLOR_HUE - 38);
											finalColor = `hsl(0 0% ${colorLuminance.toFixed(1)}%)`;
									}
	
									// 6. Apply Styles (using GSAP for smooth transition)
									gsap.to(char, { 
											fontWeight: finalFontWeight, 
											duration: 0.3,
											ease: "power2.out", 
											color: finalColor
									});
							});
					};
	
					// --- Mobile Logic (Locus Animation via rAF) ---
					mm.add("(max-width:991px)", () => {
											
							const localCenterX = bounds.width / 2;
							const localCenterY = (bounds.height / 2) + 20;
							
							// 1. NEW: Define Major (X) and Minor (Y) Radii
							const RADIUS_X = bounds.width * 0.45;
							const RADIUS_Y = bounds.height * 0.25; 
							
							// 2. NEW: Define Rotation Angle (e.g., 45 degrees)
							const ROTATION_ANGLE = Math.PI / 12; 
							const COS_THETA = Math.cos(ROTATION_ANGLE);
							const SIN_THETA = Math.sin(ROTATION_ANGLE);
							
							let rAF_id: number | null = null;
							let startTime: number | null = null;
							const FULL_LOOP_DURATION = 8000; 
							
							const animateLocus = (currentTime: number) => {
									if (startTime === null) { startTime = currentTime; }
	
									const elapsed = currentTime - startTime;
									const progress = (elapsed % FULL_LOOP_DURATION) / FULL_LOOP_DURATION; 
									const angle = progress * Math.PI * 2;
									
									// 3. Elliptical Offsets (X' and Y')
									const offsetX = RADIUS_X * Math.cos(angle);
									const offsetY = RADIUS_Y * Math.sin(angle);
									
									// 4. Rotation and Translation
									// Apply rotation matrix to the offsets, then add the center coordinates
									const pointX = localCenterX + (offsetX * COS_THETA - offsetY * SIN_THETA);
									const pointY = localCenterY + (offsetX * SIN_THETA + offsetY * COS_THETA);
	
									processActiveArea(pointX, pointY);
	
									rAF_id = requestAnimationFrame(animateLocus);
							};
	
							rAF_id = requestAnimationFrame(animateLocus);
	
							// Cleanup function for matchMedia
							return () => {
									if (rAF_id) cancelAnimationFrame(rAF_id);
							};
					});
	
					// --- Desktop Logic (Mouse Move) ---
					mm.add("(min-width:992px)", () => {
							
							let rAF_id: number | null = null;
							let mousePos = { x: 0, y: 0 };
							
							const updateFontWeights = () => {
									// Convert World/Page coordinates to Local/Container coordinates
									const pointX = mousePos.x - containerX;
									const pointY = mousePos.y - containerY;
	
									// Call the shared function
									processActiveArea(pointX, pointY);
	
									rAF_id = null; 
							};
	
							const mouseMoveHandler = (e: MouseEvent) => {
									mousePos.x = e.pageX;
									mousePos.y = e.pageY;
									
									if (!rAF_id) {
											rAF_id = requestAnimationFrame(updateFontWeights);
									}
							};
							
							document.addEventListener("mousemove", mouseMoveHandler);
							
							// Cleanup function for matchMedia
							return () => { 
									document.removeEventListener("mousemove", mouseMoveHandler);
									if (rAF_id) cancelAnimationFrame(rAF_id);
							}
					});
			});
	});
}
