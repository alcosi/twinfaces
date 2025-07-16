# Faces Driven UI System

📖 **Overview**

The **Faces Driven UI System** is the core module for dynamic, face-based widget rendering in TwinFaces. It enables flexible UI composition by interpreting backend-provided Face definitions, which describe layouts, widgets, and their relationships. Each Face acts as a blueprint for rendering a specific UI structure or widget, allowing the frontend to adapt to new requirements without code changes.

- **Face**: A backend-defined entity describing a layout or widget, including its type, configuration, and children.
- **Dynamic Rendering**: UI is built at runtime by resolving Face definitions into React components.

---

🧠 **Concepts & Terminology**

### Core Concepts

- **Face**: A backend-defined UI entity that can represent a layout or a widget. It is the main building block for dynamic UI.
- **Layout**: A Face that arranges widgets (e.g., pages, tabs). Layouts contain references to widget Faces.
- **Widget**: A Face that renders a specific UI element (e.g., table, editor). Widgets are the interactive or display components within layouts.
- **TWidget**: A subtype of Widget, typically used for widgets that are tightly coupled to a "Twin" entity (e.g., TW001). TWidgets may have special data requirements or behaviors.

#### UML Diagram

Below is a UML-style diagram (using Mermaid) that shows the same relationships in a more visual way:

```mermaid
flowchart TD
  Face --> Layout
  Face --> Widget
  Widget --> TWidget
  Layout -->|contains| Widget
  Layout -->|contains| TWidget
```

**What this means:**

- `Layout` and `Widget` are both types of `Face` (they inherit from Face).
- `TWidget` is a special kind of `Widget` (inherits from Widget).
- A `Layout` can include (contain) many `Widget` and `TWidget` components.

### Other Concepts

- **Renderer**: A component that resolves a Face and renders the appropriate React component.
- **Component Type Prefixes**:
  - `PG`: Page Layout (e.g., `PG001`)
  - `WT`: Widget Table (e.g., `WT001`)
  - `TW`: Twin Widget (e.g., `TW001`)
  - `TC`: Twin Create (e.g., `TC001`)

---

📁 **Folder Structure**

### `src/widgets/faces` Tree View

```
src/widgets/faces/
├── components/
│   ├── widgets-container.tsx
│   ├── status-alert.tsx
│   └── ...etc (utility and helper components for faces)
├── layouts/
│   ├── renderer.tsx
│   ├── types.ts
│   └── views/
│       ├── pg001.tsx
│       ├── pg002.tsx
│       └── ...etc (other layout implementations)
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
│       ├── wt003/
│       └── ...etc (other widget implementations)
```

#### Key Folders & File Responsibilities

- **components/**

  - `widgets-container.tsx`: Renders a list of widgets for a given layout.
  - `status-alert.tsx`: Standardized alert component for error/info/success states.
  - Other utility/helper components used by faces (e.g., loading indicators, error boundaries, etc.). Place only face-specific helpers here.

- **layouts/**

  - `renderer.tsx`: Main entry for resolving and rendering layout faces.
  - `types.ts`: Type definitions for layout faces.
  - `views/`: Implementations of specific layout types (e.g., `pg001.tsx`, `pg002.tsx`, etc.).

- **widgets/**
  - `renderer.tsx`: Main entry for resolving and rendering widget faces.
  - `types.ts`: Type definitions for widget faces.
  - `views/`: Implementations of specific widget types:
    - `tw001.tsx`, `tw002.tsx`: Twin widget implementations.
    - `tc/`: Twin Create widgets(e.g., `tc-form.tsx`).
    - `tw004/`, `tw005/`, `wt001/`, `wt003/`: Subfolders for complex widgets, each containing main logic and supporting files (e.g., `tw004.tsx`, `utils.ts`).

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

⏳ **Suspense Usage**

- Use React Suspense for async widget and layout loading.
- Provide skeletons from `features/ui/skeletons/` for loading states.
- Always wrap async components with fallback skeletons for best UX.

---

[How to Add a New Widget to the Faces Driven UI System](add-widget.md)
