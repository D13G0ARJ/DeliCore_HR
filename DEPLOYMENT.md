# Deployment (Supabase + Vercel)

Este repo está pensado como **2 despliegues separados**:

- **DB**: Supabase (Postgres, plan gratis)
- **Frontend**: Vercel (carpeta `frontend/`)
- **API (Laravel)**: Vercel u otro host (carpeta `api/`) usando Postgres de Supabase

> Nota importante: Supabase **no hospeda apps PHP/Laravel** como servicio de cómputo. Supabase aporta la **base de datos** (y otros servicios). El API de Laravel se despliega en un host de cómputo (p.ej. Vercel, Render, Railway, etc.).

---

## 1) Supabase (Postgres)

1. Crea un proyecto en Supabase.
2. Ve a **Project Settings → Database** y copia la cadena de conexión (Connection string).
3. Configura estas variables en tu host del API:

- `DB_CONNECTION=pgsql`
- `DB_URL=postgresql://...?...sslmode=require` (recomendado)
- `DB_SSLMODE=require`
- `DB_SEARCH_PATH=public`

Ejemplos listos:
- `api/.env.supabase.example`

### Migraciones

Ejecuta migraciones contra Supabase desde tu máquina o CI (una sola vez por entorno):

- `cd api`
- `php artisan migrate --force`
- (opcional demo) `php artisan db:seed --force`

---

## 2) Vercel (Frontend)

1. En Vercel, crea un nuevo proyecto apuntando a este repo.
2. En **Root Directory**, selecciona `frontend`.
3. Variables de entorno:

- `VITE_API_URL=https://TU_API.vercel.app/api`

4. Deploy.

Archivo ya preparado:
- `frontend/vercel.json` (fallback SPA)

---

## 3) Vercel (API Laravel)

1. Crea un segundo proyecto en Vercel.
2. En **Root Directory**, selecciona `api`.
3. Añade variables de entorno (base):

- `APP_ENV=production`
- `APP_KEY=...` (genera con `php artisan key:generate --show`)
- `APP_DEBUG=false`
- `APP_URL=https://TU_API.vercel.app`
- `DB_CONNECTION=pgsql`
- `DB_URL=postgresql://...?...sslmode=require`
- `DB_SSLMODE=require`
- `DB_SEARCH_PATH=public`

Configura CORS para permitir tu frontend:
- `CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app`

Recomendadas para serverless:
- `LOG_CHANNEL=stderr`
- `CACHE_STORE=array`
- `QUEUE_CONNECTION=sync`
- `SESSION_DRIVER=cookie`
- `TRUSTED_PROXIES=*`

Ejemplo listo:
- `api/.env.vercel.example`

### Sobre `@vercel/php`

Este repo incluye `api/vercel.json` configurado para el runtime `@vercel/php`. Si tu cuenta/instalación no lo soporta, el API debe desplegarse en otro proveedor (Render/Railway) y mantener Supabase solo como Postgres.

---

## 4) Orden recomendado

1. Configurar Supabase DB
2. Correr migraciones
3. Deploy API
4. Configurar `VITE_API_URL`
5. Deploy Frontend
