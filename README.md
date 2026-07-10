# Wishlist App

Aplicación web para crear y compartir listas de deseos. Permite que tus amigos reserven o marquen regalos como comprados sin spoilear la sorpresa al dueño de la lista.

**[Ver demo →](#)** <!-- Completar con la URL de deploy -->

---

## Features

- Login con Google OAuth
- Crear múltiples listas por ocasión (cumpleaños, navidad, etc.)
- Agregar items con prioridad y link al producto
- Compartir listas por link público sin requerir cuenta
- Reservar y marcar items como comprados
- El dueño de la lista no ve quién reservó cada regalo

---

## Decisiones técnicas

### Monorepo con npm workspaces
Frontend y backend comparten un repositorio con un paquete `@wishlist/shared` que centraliza los tipos TypeScript del dominio. Esto garantiza que cualquier cambio en el contrato de la API rompe en compilación, no en runtime.

### Autenticación con Google OAuth + JWT propio
El frontend usa `@react-oauth/google` para obtener el `idToken` de Google. El backend lo verifica con `google-auth-library` y emite su propio JWT — desacoplando la sesión interna de la identidad de Google.

### Separación de vistas por rol
Un item reservado muestra información distinta según quién lo mira: el dueño ve "Reservado" sin saber quién, los visitantes ven el nombre de quien reservó. Esta lógica vive en el componente `WishItemCard` con el flag `isOwner` y se refleja en las queries del backend con `select` explícito.

### Estado del servidor con TanStack Query
Todo el estado que viene de la API se maneja con TanStack Query — sin `useEffect` para fetching. Las mutaciones invalidan el cache automáticamente, garantizando que la UI refleje el estado real sin recargar la página.

### Guards de rutas con React Router v6
Las rutas privadas usan un componente `RequireAuth` que redirige con `<Navigate replace />` en lugar de recargar la página, manteniendo la experiencia SPA.

### Manejo de errores centralizado
Los errores HTTP se interceptan en Axios y se muestran como toasts con mensajes legibles para el usuario. El interceptor distingue el 401 (sesión expirada, redirige al login) del resto de errores (muestra toast informativo).

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS |
| Estado del servidor | TanStack Query |
| Router | React Router v6 |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Auth | Google OAuth 2.0 + JWT |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Estructura del proyecto

```
wishlist-app/
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # Backend Express
└── packages/
    └── shared/       # Tipos TypeScript compartidos
```

---

## Correr el proyecto localmente

### Requisitos
- Node.js 18+
- PostgreSQL corriendo localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/NoeliaRios/wishlist-app.git
cd wishlist-app
npm install
```

### 2. Configurar variables de entorno

**`apps/api/.env`**
```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/wishlist_dev"
JWT_SECRET="un-string-secreto-largo"
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
FRONTEND_URL="http://localhost:5173"
PORT=3001
```

**`apps/web/.env`**
```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
```

### 3. Crear la base de datos y correr migraciones

```bash
cd apps/api
npx prisma migrate dev
```

### 4. Levantar el proyecto

En dos terminales separadas:

```bash
# Terminal 1 — backend
cd apps/api
npm run dev

# Terminal 2 — frontend
cd apps/web
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## Próximos pasos

- [ ] Tests unitarios en hooks y componentes críticos
- [ ] Listas privadas con acceso por invitación
- [ ] Imagen automática desde URL del producto via OpenGraph
- [ ] Notificaciones cuando alguien reserva un item