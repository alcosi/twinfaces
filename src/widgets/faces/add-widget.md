Great! Here's a practical guide titled **“How to Implement a New Widget”** tailored to your current architecture and conventions.

---

## 🛠 How to Implement a New Widget

This guide explains how to implement a new **widget-face** from backend configuration to fully functioning UI component.

---

### ✅ Step-by-Step Checklist

#### 1. **Decide the Type**

- `WT` → Generic widget (not bound to twin)
- `TW` → Twin-specific widget (requires `twinId`)
- `TC` → Twin creation widget (usually for modals or forms)

Let’s say we’re creating `WT007`.

---

#### 2. **Create the Component**

📁 Path: `src/widgets/faces/widgets/views/wt007/wt007.tsx`

```tsx
import { fetchWT007Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";

export async function WT007({ widget, twinId }: WidgetFaceProps) {
  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT007Face(widget.widgetFaceId, twinId)
    )
  );

  if (!result.ok || !result.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT007 failed to load." />
    );
  }

  const faceData = result.data.widget;

  return (
    <div className="bg-muted rounded-md p-4">
      <h2>{faceData.label ?? "Unnamed WT007 Widget"}</h2>
      <p>Widget content goes here.</p>
    </div>
  );
}
```

---

#### 3. **Export It**

📁 Path: `src/widgets/faces/widgets/views/wt007/index.ts`

```ts
export * from "./wt007";
```

---

#### 4. **Register the Widget**

📁 Path: `src/widgets/face/widgets/renderer.tsx`

```ts
import { WT007 } from "./views";

const WIDGETS: Record<string, FC<WidgetFaceProps>> = {
  WT001,
  WT003,
  WT007, // 👈 Register here
};
```

> ✅ Now, if a Face is configured with `component: "WT007"`, it will be rendered automatically.

---

#### 5. **(Optional) Fetcher and Types**

If you need custom face fetching logic:

- Add a function `fetchWT007Face` to `entities/face/api/actions/widget-twidget.ts`
- Update backend DTO to support FaceWT007
- Add typings in `entities/face/api/types.ts`

---

#### 6. **Test It**

Once deployed:

- Go to admin/backend and create or update a Face with:

  - `component: "WT007"`
  - optional `styleClasses`

- Link it to a page widget (`widgetFaceId`)
- Open that page in frontend and confirm rendering

---

### 🧠 Tips

- Use `<Suspense>` and fallback components if data loading is expected.
- Use `StatusAlert` consistently for error messages.
- Rely on `safe(...)` and `withRedirectOnUnauthorized(...)` for all fetch calls.

---

### 🔁 Example Twin Widget: `TW004`

Twin-based widgets follow the same pattern but require `twinId`, and usually fetch twin + field data.

See [`tw004.tsx`](../widgets/views/tw004/tw004.tsx) as reference.

---

Let me know if you want a CLI template generator or a checklist doc added to your project.
