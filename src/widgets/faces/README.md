# Faces Driven UI System

📖 **Overview**

The **Faces Driven UI System** is the core module for dynamic, face-based widget rendering in TwinFaces. It enables flexible UI composition by interpreting backend-provided Face definitions, which describe layouts, widgets, and their relationships. Each Face acts as a blueprint for rendering a specific UI structure or widget, allowing the frontend to adapt to new requirements without code changes.

- **Face**: A backend-defined entity describing a layout or widget, including its type, configuration, and children.
- **Dynamic Rendering**: UI is built at runtime by resolving Face definitions into React components.

---

📁 **Folder Structure**

### `src/widgets/faces` Tree View

```
src/widgets/faces/
├── components/
│   ├── widgets-container.tsx
│   └── status-alert.tsx
├── layouts/
│   ├── renderer.tsx
│   ├── types.ts
│   └── views/
│       ├── pg001.tsx
│       └── pg002.tsx
├── widgets/
│   ├── renderer.tsx
│   ├── types.ts
│   └── views/
│       ├── tw001.tsx
│       ├── tw002.tsx
│       ├── tc/
│       ├── tw004/
│       ├── tw005/
│       ├── wt001/
│       └── wt003/

```

#### Key Folders & File Responsibilities

- **components/**

  - `widgets-container.tsx`: Renders a list of widgets for a given layout.
  - `status-alert.tsx`: Standardized alert component for error/info/success states.

- **layouts/**

  - `renderer.tsx`: Main entry for resolving and rendering layout faces.
  - `types.ts`: Type definitions for layout faces.
  - `views/`: Implementations of specific layout types (e.g., `pg001.tsx`, `pg002.tsx`).

- **widgets/**
  - `renderer.tsx`: Main entry for resolving and rendering widget faces.
  - `types.ts`: Type definitions for widget faces.
  - `views/`: Implementations of specific widget types:
    - `tw001.tsx`, `tw002.tsx`: Twin widget implementations.
    - `tc/`: Twin control widgets (e.g., `tc-form.tsx`).
    - `tw004/`, `tw005/`, `wt001/`, `wt003/`: Subfolders for complex widgets, each containing main logic and supporting files (e.g., `tw004.tsx`, `utils.ts`).

---

🧠 **Concepts & Terminology**

- **Face**: A backend-defined UI entity (layout or widget).
- **Layout**: A Face that arranges widgets (e.g., pages, tabs).
- **Widget**: A Face that renders a specific UI element (e.g., table, editor).
- **Renderer**: A component that resolves a Face and renders the appropriate React component.
- **Component Type Prefixes**:
  - `PG`: Page Layout (e.g., `PG001`)
  - `WT`: Widget Table (e.g., `WT001`)
  - `TW`: Twin Widget (e.g., `TW001`)
  - `TC`: Twin Create (e.g., `TC001`)

---

🔄 **Runtime Flow**

1. **LayoutRenderer**: Receives a layout Face ID, fetches the Face, and resolves the layout type (e.g., `PG001`).
2. **Layout**: Renders containers for widgets as defined by the Face.
3. **WidgetsContainer**: Iterates over widget Faces and delegates rendering.
4. **WidgetRenderer**: Resolves the widget type (e.g., `WT001`, `TW001`) and renders the corresponding component.
5. **WT/TW Components**: Implement the actual widget logic and UI.

```
LayoutRenderer → Layout → WidgetsContainer → WidgetRenderer → WT/TW Component
```

---

🧩 **Widget Implementations**

| Widget Name | File Path                             | Notes                   |
| ----------- | ------------------------------------- | ----------------------- |
| TW001       | `faces/widgets/views/tw001.tsx`       | Twin image/media slider |
| TW002       | `faces/widgets/views/tw002.tsx`       | Twin info accordion     |
| TW004       | `faces/widgets/views/tw004/tw004.tsx` | Twin field editor       |
| TW005       | `faces/widgets/views/tw005/tw005.tsx` | Twin transition buttons |
| WT001       | `faces/widgets/views/wt001/wt001.tsx` | Table widget            |
| WT003       | `faces/widgets/views/wt003/wt003.tsx` | Alert widget            |
| TC widgets  | `faces/widgets/views/tc/`             | Twin create widgets     |

---

🛠️ **Utilities & Shared Components**

- `safe(fn)`: Wraps async calls, returns `{ ok, data | error }`.
- `StatusAlert`: Standard alert for error/info/success states.
- `buildFieldEditorProps`: Prepares props for TwinFieldEditor.
- `isTruthy`, `isPopulatedArray`: Type guards for validation.
- `withRedirectOnUnauthorized(fn)`: Handles 401 errors with redirect.

---

⏳ **Suspense Usage**

- Use React Suspense for async widget and layout loading.
- Provide skeletons from `features/ui/skeletons/` for loading states.
- Always wrap async components with fallback skeletons for best UX.

---

🧑‍💻 **Developer Guidelines**

- Rules and recommendations for creating new widgets:
  - Always use `safe(...)` and `withRedirectOnUnauthorized(...)` for data fetching.
  - Use `isTruthy`, `isPopulatedArray` for runtime validation.
  - Register new widgets in the dynamic resolution map (e.g., in `WidgetRenderer`).
  - Follow naming conventions for component prefixes (`PG`, `WT`, `TW`, `TC`).
  - Keep widget logic isolated and reusable.

---
