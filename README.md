# Nepaxis

> Empowering your Digital Journey

**_Created using Vanilla JS And Vanilla SCSS_**
Project overview and file reference for the Nepaxis workspace.
This README explains the purpose of the main files and folders in the repository and where to look for common functionality. The `node_modules/` and `public/` directories are intentionally omitted from detailed explanation.

## External Services Used

1. Mailchimp For Newsletter Service
2. Web3Forms for Submitting Contact Form

## Dependencies

1. Vite
2. TypeScript
3. SCSS
4. Vercel for Functions
5. GSAP
   1. Scroll Trigger
   2. Scroll Smoother
   3. Scramble Text Plugin
   4. Draggable

## Project Structure\*\*

- `package.json`: Project manifest; contains scripts, dependencies, and basic metadata used by npm/yarn.
- `TREE.md`: (Optional) text representation or snapshot of the repository tree.
- `tsconfig.json`: TypeScript compiler configuration used by the project.
- `vite.config.ts`: Vite configuration — dev server, build options and any plugin setup.
- `api/`: Serverless backend functions (deployed to Vercel or similar).
  - `subscribe.ts`: API endpoint handling newsletter or subscription POST requests.
- `src/`: Main source for the frontend site.
  - `index.html`: App entry HTML template used by Vite for dev and production builds.
  - `js/`: TypeScript/JavaScript source files for the client-side logic.
    - `main.ts`: App bootstrap and global initialization (entry point for client code).
    - `animations/`: Reusable animation modules and page-specific timeline code.
      - `ascii/`: ASCII / text-based animation utilities.
      - `draggable/`: Drag-and-drop utilities and helpers.
      - `header-animations/`: Animation logic for header elements.
      - `hover-image/`: Hover-driven image effects.
      - `lazy-load/`: Utilities for lazy-loading images or content.
      - `scroll-timelines/`: Per-page scroll timeline scripts (e.g., `hero.ts`, `about.ts`, `footer.ts`, etc.).
      - `shuffle/`: Shuffle / randomize visual effects.
      - `smooth-scroll/`: Smooth scrolling helpers and integrations.
    - `components/`: Small, focused UI components implemented in TypeScript.
      - `contact/`: Contact form component and submission logic.
      - `cube/`: 3D cube or visual component code.
      - `loader/` and `loader/loader-background/`: Loading indicators and background loader visuals.
      - `menu/`: Off-canvas or site menu code.
      - `modals/`: Modal dialog handling utilities.
      - `newsletter/`: Newsletter sign-up UI and integration.
      - `time/`: Time / clock related components.
  - `scss/`: Sass (SCSS) source files for styling the site.
    - `_shame.scss`: Small overrides or quick fixes (conventional name for temporary hacks).
    - `styles.scss`: Main SCSS entrypoint that imports partials and outputs the compiled CSS.
    - `abstracts/`: Sass utility partials (functions, mixins, variables, interfaces).
      - `_variables.scss`: Design tokens (colors, spacing, sizes).
      - `_mixins.scss`: Reusable mixins for layout or vendor-prefixing.
    - `base/`: Global base styles, typography, root variables and helper utilities.
      - `_engine.scss`, `_base.scss`, `_fonts.scss`, `_root.scss`.
      - `helpers/`: Small helper partials such as `_flex-helper.scss`, `_grid-helper.scss`, `_spacing-helper.scss`, `_type-helper.scss`.
    - `components/`: Component-level styles matching the `src/js/components` structure (buttons, inputs, loader, offcanvas, etc.).
    - `definitions/`: Central CSS definitions (color/size/type definitions used across themes).
    - `layout/`: Header, footer, wrapper layout styles.
    - `pages/`: Page-scoped styles and overrides (e.g., `_main.scss`, `_blogs.scss`).
    - `themes/`: Theme-level variables and overrides (e.g., `_default.scss`).
    - `vendors/`: Third-party vendor styles (normalize, pesticide helpers, etc.).
- `tool/`: A small local utility or development helper.
  - `index.html`: A lightweight UI for the tool or local testing harness.
  - `tool.ts`: Script backing the development tool.

## Notes & Where To Look For Things

- Frontend entry: `src/js/main.ts` and `src/index.html`.
- Styling: `src/scss/styles.scss` imports everything; edit partials in `abstracts/`, `components/` or `layout/`.
- Animations: `src/js/animations/` contains modular animation code; `scroll-timelines/` holds page-specific timeline scripts.
- Components: `src/js/components/` houses small UI widgets — each folder typically contains an `index.ts` that exports the component.
- Server/API: `api/subscribe.ts` is the simplest server endpoint to handle newsletter subscriptions or contact integrations.
- Build & dev: Run scripts from `package.json` (e.g., `dev`, `build`, `preview`) which use Vite and the `vite.config.ts` settings.
- Build & dev: Run scripts from `package.json` (e.g., `dev`, `build`, `preview`) which use Vite and the `vite.config.ts` settings.

## Scripts

Common scripts defined in `package.json`. Run them with `npm run <script>` (or `pnpm <script>` / `yarn <script>` depending on your package manager):

```bash
npm run dev      # start development server (Vite)
npm run build    # compile TypeScript and produce a production build (tsc && vite build)
npm run preview  # preview the production build locally (vite preview)
```

- `dev`: Runs the Vite dev server for local development and HMR.
- `build`: Runs `tsc` then `vite build` to create the production bundle.
- `preview`: Serves the built output locally so you can test the production build.

```bash
npm install -g vercel   # to be able to use the api/subscribe.ts function in local environment
vercel login            # login to vercel
vercel dev              # run vercel server on localhost:3000
```
