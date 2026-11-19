# How to Add a New Widget to the Faces Driven UI System

This guide describes the step-by-step process for creating and registering a new widget (WT, TC) in the TwinFaces Faces Driven UI System.

---

## 1. Choose a Widget Type and Name

- **WT**: Widget (e.g., WT001)
- **TC**: Twin create (e.g., TC001)
- Use a unique, sequential number (e.g., WT011).

> **Note (TWINS-943):** the `TW` (twin widget) prefix no longer exists — all widgets are `WT`.

## 2. Create Widget Files

- Go to `src/widgets/faces/widgets/views/`.
- For simple widgets, add a file: `wt011.tsx`, etc.
- For complex widgets, create a folder: `wt011/`, etc., and add files like `wt011.tsx`, `utils.ts`, `index.ts`.

## 3. Implement the Widget

- Export an async function named after your widget (e.g., `export async function WT011(props: WidgetFaceProps) { ... }`).
- `WidgetFaceProps.twinId` is always provided (all widget endpoints require it since TWINS-943).
- Use the widget DTO's `pointedTwinId` (not the request `twinId`) for the widget's own data calls (searches, transitions, comment fetches, etc.).
- Use `safe(...)` and `withRedirectOnUnauthorized(...)` for all async data fetching.
- Use `StatusAlert` for error and loading states.
- Use helpers like `isTruthy`, `isPopulatedArray` for validation.
- Keep logic isolated and reusable.

## 4. Register the Widget

- Open `src/widgets/faces/widgets/views/index.ts`.
- Export your widget:
  ```ts
  export * from "./wt011";
  ```

## 5. Update the Widget Renderer

- Open `src/widgets/faces/widgets/renderer.tsx`.
- Add your widget to the `WIDGETS` map:
  ```ts
  const WIDGETS = {
    ...WT011,
  };
  ```
- Add a skeleton to `WIDGET_SKELETONS` for the loading state.

## 6. Follow Best Practices

- Use Suspense and skeletons for async loading.

- Keep UI and data logic separated.

---
