# Growtek Challenge

Demo: tablero Kanban, contactos, empresas, listas y ficha de deal. Todo el estado va a Zustand y de ahí a `localStorage`.

## Requisitos

Node 20 o superior y pnpm.

## Instalación y scripts

| Comando | Qué hace |
|--------|----------|
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Arranca Vite en desarrollo |
| `pnpm run build` | `tsc` + build a `dist/` |
| `pnpm run preview` | Sirve la build localmente |
| `pnpm run lint` | ESLint |

`pnpm dev`, -> `http://localhost:5173`.

## Stack

React 19 y TypeScript, Vite 8, React Router 7. Zustand con `persist` (claves tipo `growtek-deals`, `growtek-contacts`, etc.). Tailwind 4, @dnd-kit en el tablero, motion en drawers, Sonner para toasts.

## Qué incluye

Puedes mover deals por etapas, crear deals y abrir el detalle con historial de etapas. Contactos y empresas van en tablas con búsqueda y paginación; los formularios salen en drawers. Las rutas `/contacts/new` y `/companies/new` redirigen con `?create=1` para abrir el mismo flujo. Las listas de contactos se pueden borrar solo si ya no tienen contactos asignados.

En la cabecera, el menú "Datos" deja exportar un JSON con todo, importar uno guardado antes o volver al dataset de demo (esto último machaca lo que tengas sin exportar).

## Carpetas en `src/`

```
src/
  components/   deals, contacts, companies, y ui/ compartido
  hooks/        useDeals, useContacts, etc.
  lib/          formatos, mutaciones CRM, export/import
  pages/        rutas
  stores/       Zustand persistido
  types/
```

Es un front aislado a propósito: persistencia local en lugar de backend.
