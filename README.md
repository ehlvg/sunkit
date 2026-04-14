# sunkit

A pastel React component library with soft shadows, spring animations, and Web Audio micro-interactions.

Built with **React 19**, **Tailwind CSS v4**, and **class-variance-authority**. Zero runtime dependencies beyond React.

## Installation

```bash
pnpm add sunkit-ui@alpha
```

Peer dependencies (install if not already present):

```bash
pnpm add react react-dom
```

## Setup

Sunkit ships a CSS file that must be imported once — it registers the Tailwind theme (pastel colour tokens) and the utility classes (`btn-shadow`, keyframe animations, etc.).

### With Tailwind CSS v4 (recommended)

Add the sunkit CSS layer to your global stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";
@import "sunkit-ui/sunkit.css";
```

### Without Tailwind (standalone)

```tsx
// main.tsx or _app.tsx
import 'sunkit-ui/sunkit.css'
```

## Sound design

Every interactive component has its own sonic identity using the Web Audio API. All sounds are synthesised at runtime — no audio files required, and they respect system `prefers-reduced-motion` preferences in future releases.

## Storybook

Browse all components interactively:

```bash
pnpm run storybook
```

Opens at [http://localhost:6006](http://localhost:6006).

## Build

```bash
pnpm run build
```

Outputs to `dist/` — an ES module, CJS bundle, and `.d.ts` type declarations.
