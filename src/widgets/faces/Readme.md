# 🧩 Widget Faces System

This module powers the **face-based widget rendering system** used in TwinFaces. Each widget on a page corresponds to a "Face", which defines its component type and configuration.

---

## 📁 Folder Structure

```

src/
├── widgets/
│ ├── views/ # Individual widget implementations (e.g. TW001, WT001, etc.)
│ ├── renderer.tsx # Resolves face.component and renders the corresponding widget
│ ├── types.ts # Types shared across all widgets (WidgetFaceProps, etc.)
│ └── index.ts # Public re-exports
├── components/
│ ├── widgets-container.tsx # Grid layout that renders multiple widgets
│ ├── status-alert.tsx # Generic alert for error and warning messages
│ └── index.ts # Public re-exports
├── layouts/
│ ├── views/ # Page-level face layouts (e.g. PG001, PG002)
│ ├── renderer.tsx # Dynamically resolves layout components
│ ├── types.ts # Layout props (e.g. PGFaceProps)
│ └── index.ts # Public re-exports

```

---

## 🧠 Concept

- **Face:** A backend-defined configuration object that declares which React component to render (via the `component` key).
- **Widget:** A UI block attached to a page or tab that references a specific Face using `widgetFaceId`.
- **Renderer:** Dynamically loads the correct React component based on the Face's `component`.

### Component Type Prefixes

| Prefix | Scope       | Twin-bound | Example |
| ------ | ----------- | ---------- | ------- |
| `PG`   | Page        | No         | `PG001` |
| `WT`   | Widget      | No         | `WT001` |
| `TW`   | TwinWidget  | Yes        | `TW004` |
| `TC`   | Twin Create | Yes        | `TC001` |

---

## 🔄 Runtime Flow

1. **LayoutRenderer** (`layouts/renderer.tsx`)

   - Resolves the `component` from a pageFace and renders the appropriate layout component (`PG001`, `PG002`, ...).

2. **PG001 / PG002**

   - Fetch page face → render `WidgetsContainer` with a list of associated widgets.

3. **WidgetsContainer**

   - Maps each `widgetFaceId` to a resolved face → uses `WidgetRenderer` to dynamically resolve widget component.

4. **WidgetRenderer**
   - Resolves widget face → matches face.component with `WTXXX`, `TWXXX` maps → renders actual implementation.

---

## 🧱 Widget Implementations

All widgets live under `widgets/views/` and are grouped by type:

| Component | File          | Notes                                   |
| --------- | ------------- | --------------------------------------- |
| `TW001`   | `tw001.tsx`   | Media slider, requires twin attachments |
| `TW002`   | `tw002.tsx`   | Language accordion                      |
| `TW004`   | `tw004.tsx`   | Editable twin field                     |
| `TW005`   | `tw005.tsx`   | Transition buttons for twin             |
| `WT001`   | `wt001.tsx`   | Table of twins                          |
| `WT003`   | `wt003.tsx`   | Static alert block                      |
| `TC001`   | `tc-form.tsx` | Twin creation form (used in modals)     |

---

## 💡 Utilities & Shared Components

- `StatusAlert`: Used to render consistent alert messages when widgets or layouts fail to load.
- `safe`, `withRedirectOnUnauthorized`: Helpers for safe data fetching and redirecting unauthorized users.
- `buildFieldEditorProps`: Helper for preparing twin field editor props.

---

## 🧪 Suspense Usage

- All dynamic components that rely on async data should ideally be wrapped in `<Suspense>`.
- TODOs exist for creating proper skeletons:
  - `PG001Skeleton`, `PG002Skeleton`, `WT001Skeleton`, etc.

---

## ✅ Tips for Developers

- ✅ Always use `safe(...)` + `withRedirectOnUnauthorized(...)` for data fetching.
- ✅ Use `isPopulatedArray(...)`, `isTruthy(...)` utilities to validate backend results.
- ✅ Ensure `twinId` is passed to twin-specific widgets (e.g. `TW001`, `TW004`, etc.).
- ✅ Always define your widget in the `WIDGETS` or `TWIDGETS` map to enable dynamic resolution.

---

## 🛠 Future Improvements

- [ ] Support for lazy loading widget modules via dynamic `import()`.
- [ ] Auto-register face-component mappings (via metadata?).
- [ ] Add runtime type validation for face data.

---

## 📎 Related

- `entities/face`: Fetching face definitions from backend.
- `entities/twin`: Backend data model for Twin.
- `features/ui`: Shared UI components like `MasonryLayout`, `Skeletons`, etc.

---

📘 **See also**: [How to Implement a New Widget](./add-widget.md)

---
