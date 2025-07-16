# How to Add a New Widget to the Faces Driven UI System

This guide describes the step-by-step process for creating and registering a new widget (WT, TW, TC) in the TwinFaces Faces Driven UI System.

---

## 1. Choose a Widget Type and Name

- **WT**: Widget Table (e.g., WT001)
- **TW**: Twin Widget (e.g., TW001)
- **TC**: Twin Control (e.g., TC001)
- Use a unique, sequential number (e.g., TW006, WT004).

## 2. Create Widget Files

- Go to `src/widgets/faces/widgets/views/`.
- For simple widgets, add a file: `tw006.tsx`, `wt004.tsx`, etc.
- For complex widgets, create a folder: `tw006/`, `wt004/`, etc., and add files like `tw006.tsx`, `utils.ts`, `index.ts`.

## 3. Implement the Widget

- Export an async function named after your widget (e.g., `export async function TW006(props: TWidgetFaceProps) { ... }`).
- Use `safe(...)` and `withRedirectOnUnauthorized(...)` for all async data fetching.
- Use `StatusAlert` for error and loading states.
- Use helpers like `isTruthy`, `isPopulatedArray` for validation.
- Keep logic isolated and reusable.

## 4. Register the Widget

- Open `src/widgets/faces/widgets/views/index.ts`.
- Import your widget:
  ```ts
  import { TW006 } from "./tw006";
  ```
- Add it to the export map/object as needed.

## 5. Update the Widget Renderer

- Open `src/widgets/faces/widgets/renderer.tsx`.
- Add your widget to the `TWIDGETS` or `WIDGETS` map:
  ```ts
  const TWIDGETS = {
    ...TW006,
  };
  ```

## 6. Follow Best Practices

- Use Suspense and skeletons for async loading.

- Keep UI and data logic separated.

---
