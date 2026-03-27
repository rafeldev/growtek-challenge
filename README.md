# Growtek challenge (CRM demo)

SPA con React, Vite, React Router, Zustand (persist en `localStorage`) y Tailwind.

## Desarrollo

```bash
pnpm install
pnpm dev
```

```bash
pnpm run build
pnpm run lint
```

## Datos locales

- Toda la información vive en el **navegador** (`localStorage`). No hay servidor ni sincronización en la nube.
- Puedes **exportar / importar** un JSON desde el menú **Datos** en la cabecera (respaldo manual).
- **Restaurar demo** vuelve a los datos semilla iniciales (se pierden los cambios locales).

## Privacidad y PII

Esta aplicación **no está pensada para datos personales reales**: no hay cifrado, control de acceso ni cumplimiento normativo. Úsala solo con datos de prueba o ficticios.
