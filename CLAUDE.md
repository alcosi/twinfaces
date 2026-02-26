# TwinFaces - Project Documentation

## Project Overview

TwinFaces is a modern web application built on Next.js, implementing the Feature-Sliced Design (FSD) architecture pattern. The project provides a digital twin management system with complex relationships and business logic.

## Tech Stack

### Core

- **Next.js 16.1.6** — React framework with App Router
- **React 19.2.1** — UI library
- **TypeScript 5.4.5** — Type safety

### Styling & UI

- **Tailwind CSS v4** — Utility-first CSS framework
- **Radix UI** — Accessible UI primitives
- **shadcn/ui** — Component library
- **class-variance-authority** — Component variants

### Forms & Validation

- **React Hook Form** — Form management
- **Zod** — Schema validation

### Tables & Data

- **@tanstack/react-table** — Table components
- **@dnd-kit** — Drag and drop

### Text Editor

- **Lexical** — Text editor framework

## Project Architecture (FSD)

```
src/
├── app/          # Next.js App Router (pages and routing)
├── entities/     # Domain entities
│   ├── twins/
│   ├── twin-classes/
│   ├── factories/
│   ├── domains/
│   ├── flows/
│   └── ...
├── features/     # Cross-cutting features
│   ├── auth/
│   ├── permissions/
│   ├── in-place-editing/
│   └── ...
├── screens/      # Screens (composition of entities and features)
├── widgets/      # Reusable UI components
│   ├── tables/
│   ├── forms/
│   └── layouts/
└── shared/       # Shared utilities, constants, types
    ├── ui/
    ├── lib/
    └── config/
```

## Core Entities

### Twins

Main application data with complex relationships.

### Twin Classes

Templates for creating Twin instances.

### Factories

Configuration for data processing pipelines.

### Domains

Organizational units and business contexts.

### Flows

State machines and state transitions for Twins.

### Fields

Custom attributes for Twin Classes.

### Permissions

Role-based access control system.

## Patterns & Conventions

### Entity Structure

```
src/entities/[entity-name]/
├── api/           # API service, hooks, types
│   ├── api-service.ts
│   ├── hooks/
│   └── types.ts
├── libs/          # Business logic, helpers, schemas
│   ├── helpers.ts
│   ├── hooks/
│   ├── schemas.ts
│   └── types.ts
└── index.ts       # Barrel exports
```

### API Integration

- Uses `openapi-fetch` for type-safe API calls
- Generated TypeScript types from OpenAPI schema
- Centralized API client with middleware for errors and auth
- Standardized pagination and filtering

### Component Hierarchy

1. **Screens** — Page-level components
2. **Widgets** — Reusable UI components
3. **Features** — Cross-cutting features
4. **Entities** — Business logic and models

## Development Scripts

```bash
npm run dev              # Dev server
npm run build            # Production build
npm run test:ts          # Type checking
npm run lint             # Linting
npm run format           # Formatting
npm run generate:schema  # Generate API types
```

## Key Features

1. **Multi-tenancy** — Support for multiple domains with separate configurations
2. **Dark mode** — Dark theme support
3. **Accessibility** — Built on Radix UI primitives
4. **In-place editing** — Edit content directly in UI
5. **Rich text editor** — Full-featured content editor on Lexical

## Configuration

- Node.js 20+
- PostgreSQL for backend
- Docker for containerization
- GitLab CI/CD for deployment
