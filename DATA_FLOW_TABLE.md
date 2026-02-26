# Data Flow: How a Table is Built

This document describes the complete data flow from route to entity, using **Factory Erasers** as an example.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LAYER ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  APP ROUTER  │  SCREENS  │  WIDGETS  │  ENTITIES  │  SHARED  │  FEATURES   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Route Layer (`src/app/`)

**File:** `src/app/core/erasers/page.tsx`

```tsx
import { FactoryErasers } from "@/screens/factory-erasers";

export default function ErasersPage() {
  return <FactoryErasers />;
}
```

**Purpose:** Entry point that connects Next.js App Router to the Screen layer.

---

## 2. Screen Layer (`src/screens/`)

**File:** `src/screens/factory-erasers/factory-erasers.tsx`

**Responsibilities:**

- Defines column definitions (`colDefs`)
- Creates the fetcher function
- Connects entity hooks to the widget
- Configures filters

```tsx
export function FactoryErasers() {
  // 1. Get hooks from entity layer
  const { searchFactoryErasers } = useFactoryEraserSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryEraserFilters();

  // 2. Create fetcher that widget will call
  async function fetchErasers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<FactoryEraser_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    return await searchFactoryErasers({ pagination, filters: _filters });
  }

  // 3. Render widget with configuration
  return (
    <CrudDataTable
      title="Erasers"
      columns={[...colDefs]}
      fetcher={fetchErasers}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
```

---

## 3. Entity Layer (`src/entities/`)

### Structure

```
src/entities/factory-eraser/
├── api/
│   ├── api-service.ts       # API client methods
│   ├── hooks/
│   │   ├── use-search.ts    # Search hook
│   │   ├── use-fetch-by-id.ts
│   │   └── use-update.ts
│   └── types.ts             # TypeScript types
└── libs/
    ├── hooks/
    │   └── use-filters.ts   # Filter configuration
    └── helpers.ts
```

### 3.1 Types (`api/types.ts`)

Defines the data structures:

```tsx
export type FactoryEraser_DETAILED = Required<FactoryEraser>;
export type FactoryEraserSearchRq = components["schemas"]["FactoryEraserSearchRqV1"];
export type FactoryEraserFilterKeys = "idList" | "factoryIdList" | ...;
```

### 3.2 API Service (`api/api-service.ts`)

Contains the actual HTTP calls:

```tsx
export function createFactoryEraserApi(settings: ApiSettings) {
  function search({ pagination, filters }) {
    return settings.client.POST("/private/factory_eraser/search/v1", {
      params: {
        query: {
          lazyRelation: false,
          showFactoryEraserMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: { ...filters },
    });
  }
  return { search, getById, update };
}
```

### 3.3 Search Hook (`api/hooks/use-search.ts`)

Connects API service to React context:

```tsx
export function useFactoryEraserSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryErasers = useCallback(
    async ({ pagination, filters }) => {
      const { data, error } = await api.factoryEraser.search({
        pagination,
        filters,
      });

      // Hydrate related objects
      const erasers =
        data.erasers?.map((dto) =>
          hydrateFactoryEraserFromMap(dto, data.relatedObjects)
        ) ?? [];

      return { data: erasers, pagination: data.pagination };
    },
    [api]
  );

  return { searchFactoryErasers };
}
```

### 3.4 Filters Hook (`libs/hooks/use-filters.ts`)

Configures filter fields:

```tsx
export function useFactoryEraserFilters() {
  function buildFilterFields(): Record<FactoryEraserFilterKeys, AutoFormValueInfo> {
    return {
      idList: { type: AutoFormValueType.tag, label: "ID", ... },
      factoryIdList: { type: AutoFormValueType.combobox, ... },
      // ...
    };
  }

  function mapFiltersToPayload(filters): FactoryEraserFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      // ...
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
```

---

## 4. Widget Layer (`src/widgets/`)

### 4.1 CrudDataTable (`crud-data-table.tsx`)

High-level component that combines:

- Header (search, filters, column manager)
- DataTable (the actual table)
- Dialog (for create/edit)

**Key responsibility:** Wraps the fetcher and manages view settings.

```tsx
function CrudDataTableInternal({ fetcher, ...props }) {
  const fetchWrapper = async (pagination: PaginationState) => {
    const response = await fetcher(pagination, {
      search: viewSettings.query,
      filters: viewSettings.filters,
    });

    if (viewSettings.groupByKey) {
      response.data = groupDataByKey(response.data, viewSettings.groupByKey);
    }
    return response;
  };

  return (
    <>
      <CrudDataTableHeader ... />
      <DataTable fetcher={fetchWrapper} ... />
      <CrudDataTableDialog ... />
    </>
  );
}
```

### 4.2 DataTable (`data-table/data-table.tsx`)

Core table component powered by `@tanstack/react-table`:

```tsx
function DataTableInternal({ fetcher, getRowId, columns, ... }) {
  const [data, setData] = useState<TData[]>([]);
  const [pagination, setPagination] = useState({...});

  const table = useReactTable<TData>({
    data,
    columns,
    getRowId,
    manualPagination: true,
    pageCount,
  });

  function fetchData() {
    setLoading(true);
    fetcher(pagination.tanstask)
      .then(({ data, pagination }) => {
        setData(data);
        setPagination(prev => ({ ...prev, api: pagination }));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, [pagination.tanstask]);

  return layoutMode === "grid" ? <DataTableGrid ... /> : <DataTableList ... />;
}
```

---

## 5. Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ USER NAVIGATES TO /core/erasers                                             │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ APP ROUTER: app/core/erasers/page.tsx                                       │
│   → Renders <FactoryErasers />                                              │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCREEN: screens/factory-erasers/factory-erasers.tsx                         │
│   1. Gets hooks from entity (useFactoryEraserSearch, useFactoryEraserFilters)│
│   2. Defines column definitions                                             │
│   3. Creates fetcher function                                               │
│   4. Renders <CrudDataTable fetcher={fetchErasers} ... />                   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ WIDGET: widgets/crud-data-table/crud-data-table.tsx                         │
│   1. Manages view settings (columns, filters, search, group by)             │
│   2. Wraps fetcher with view state                                          │
│   3. Renders <DataTable fetcher={fetchWrapper} ... />                       │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ WIDGET: widgets/crud-data-table/data-table/data-table.tsx                   │
│   1. Manages local state (data, pagination, loading)                        │
│   2. Creates @tanstack/react-table instance                                 │
│   3. Calls fetcher when pagination changes                                  │
│   4. Renders table rows with data                                           │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ENTITY HOOK: entities/factory-eraser/api/hooks/use-search.ts                │
│   1. Gets API client from context (PrivateApiContext)                       │
│   2. Calls api.factoryEraser.search()                                       │
│   3. Hydrates DTOs with related objects                                     │
│   4. Returns PagedResponse<FactoryEraser_DETAILED>                          │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ENTITY API SERVICE: entities/factory-eraser/api/api-service.ts              │
│   1. Uses openapi-fetch client                                              │
│   2. Makes POST /private/factory_eraser/search/v1                           │
│   3. Passes pagination (limit, offset) and filters in body                  │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BACKEND API                                                                 │
│   Returns JSON with { erasers: [...], pagination: {...}, relatedObjects }   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Patterns

### 1. Separation of Concerns

- **App**: Routing only
- **Screen**: Composition and configuration
- **Widget**: Reusable UI logic
- **Entity**: Business logic and data access
- **Shared**: Common utilities

### 2. Dependency Flow

```
App → Screen → Widget → Entity → API
```

Each layer only depends on layers below it.

### 3. Data Transformation Pipeline

```
API Response (DTO) → Hydrate with related objects → Entity Type → Table Row
```

### 4. Filter Flow

```
Filter UI (screen/widget) → Filter State → mapFiltersToPayload → API Request
```

---

## Files Reference

| Layer  | File                                                | Purpose                    |
| ------ | --------------------------------------------------- | -------------------------- |
| App    | `app/core/erasers/page.tsx`                         | Route entry point          |
| Screen | `screens/factory-erasers/factory-erasers.tsx`       | Column defs, fetcher setup |
| Widget | `widgets/crud-data-table/crud-data-table.tsx`       | View settings, header      |
| Widget | `widgets/crud-data-table/data-table/data-table.tsx` | Table state, rendering     |
| Entity | `entities/factory-eraser/api/hooks/use-search.ts`   | Search hook                |
| Entity | `entities/factory-eraser/api/api-service.ts`        | API client methods         |
| Entity | `entities/factory-eraser/libs/hooks/use-filters.ts` | Filter configuration       |
| Entity | `entities/factory-eraser/api/types.ts`              | Type definitions           |
