# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-14

### Added

- `Button` — pastel button with 8 color tones, size variants, icon support, and sound feedback
- `Toggle` — accessible switch component with animated knob and label/description support
- `Input` — text input with 3 variants (default, filled, ghost), adornments, label, description, and error state
- `Select` — styled select with tone and size variants
- `Slider` — range slider with marks, tone, and size support
- `Textarea` — auto-resizable textarea with variants matching Input
- `Progress` — progress bar with determinate and indeterminate modes
- `Card` — composable card with `Card.Header`, `Card.Body`, `Card.Footer` sub-components
- `ColorPicker` — pastel color picker with preset tokens
- `DatePicker` — single date and date range picker
- `Alert` — dismissable alert with info / success / warning / error variants
- `ThemeProvider` — context provider for global accent color overrides
- `COLORS` / `COLOR_MAP` — exported pastel color tokens
- `resolveAccent` / `hexToAccentPair` — accent color utility functions
- Web Audio sound feedback on interactive components via custom hooks
- Tailwind CSS v4 design tokens (`--sk-*` CSS variables) for theming
