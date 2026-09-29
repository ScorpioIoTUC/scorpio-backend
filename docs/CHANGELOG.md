# Changelog

## [Unreleased] — Preparación para producción (2026-09-24)

Cambios para servir el backend públicamente en `scorpio.cpsrtc.cl`, con la cadena
**CloudFront (+WAF) → AWS ELB → nginx (frontend) → api**.

### ⚠️ Cambios incompatibles (breaking)

- **Todas las rutas quedan bajo el prefijo `/api`** (`/api/users`, `/api/auth/login`, `/api/packets`, etc.).
  Las únicas que siguen en la raíz son `/` y `/health`.
- **Socket.IO se sirve en `/api/socket.io`** (configurable con `SOCKET_PATH`). Los clientes tienen que indicar `path`.
- **`POST /api/users` y `GET /api/users` requieren un token de admin.** `GET /api/users/:id` solo lo puede usar el
  propio usuario o un admin.
- **El registro público está deshabilitado por defecto** (`SIGNUP_MODE=admin`): `POST /api/auth/signup` responde 403
  hasta que se configure `SIGNUP_MODE=public`.
- **El login responde siempre `Invalid email or password.`**: ya no distingue entre email inexistente y contraseña incorrecta.
- **Hay variables de entorno nuevas y obligatorias**: `POSTGRES_PASSWORD` (el compose no levanta sin ella).
  `DATABASE_URL` ahora la arma el compose, así que ya no va en `.env`.
- **Postgres ya no se publica en el host** (antes quedaba en `0.0.0.0:5432`).
  Para entrar a la base usa `docker compose exec db psql -U postgres -d postgres`.
- **Rotar `JWT_SECRET` invalida todas las sesiones activas.**

### Seguridad

- **Escalada de privilegios corregida:** cualquiera podía crear un usuario admin con `POST /users` enviando `type: "admin"`.
  Ahora ese endpoint es solo para admins, valida `type`, y el signup público siempre crea usuarios `normal`.
- **Contraseñas en texto plano:** al actualizar un usuario (`PATCH /users/:id`), la contraseña se guardaba sin hashear.
  Ahora se hashea con bcrypt (12 rondas).
- **Fuga del hash:** las respuestas de crear y actualizar usuario incluían el hash bcrypt. Ahora siempre devuelven el usuario público.
- **Borrado de estaciones:** cualquier usuario autenticado podía borrar los paquetes de cualquier estación, porque
  el borrado ocurría antes de revisar si la estación era suya. Ahora la autorización se revisa antes de tocar cualquier dato.
- **Datos personales:** la lista de usuarios con sus emails era pública. Ahora es solo para admins.
- **Enumeración de usuarios:** el login tenía mensajes distintos y tiempos de respuesta distintos según si el email existía.
  Ahora el mensaje es único y siempre se hace una comparación bcrypt (contra un hash de relleno si el email no existe).
- **Claves de estación:** se comparan con `crypto.timingSafeEqual` en vez de `!==`.
- **Errores:** los mensajes internos (por ejemplo, de Prisma) ya no llegan al cliente. Hay un manejador de errores
  final que responde JSON genérico, además de respuestas 400 para JSON mal formado y 413 para body demasiado grande.
- **Cambio de rol:** `PATCH /api/users/:id` con `type` solo lo acepta un admin sobre **otro** usuario. Si no es
  admin, o si el admin intenta cambiar su propio rol, responde 400. Antes el cambio de `type` estaba bloqueado para
  todos y, además, el repositorio nunca escribía ese campo.
- **Validación de entrada** en crear y actualizar usuario y estación: tipos, números finitos y `decoderConfig` como bytes 0–255.
- **Hardening HTTP:**
  - `helmet`, sin HSTS (lo pone CloudFront) y sin CSP (es una API).
  - `x-powered-by` deshabilitado.
  - `express.json({ limit: '100kb' })`.
- **Límite de intentos** en `/api/auth/*`: 20 por minuto por IP, como defensa en profundidad. La protección
  principal son las reglas rate-based del WAF. `POST /api/packets` no se limita en la app porque varias estaciones
  pueden compartir IP (NAT).
- **`trust proxy`** configurable con `TRUST_PROXY_HOPS` (por defecto 3: CloudFront → ELB → nginx), para que `req.ip`
  sea la IP real del cliente.
- **Seed:** ya no resetea la contraseña del admin en cada reinicio (solo lo crea si no existe), y solo corre si
  `SEED_ON_START=true`.

### Infraestructura / Docker

- **`Dockerfile` multi-stage:** compila en una etapa de build y la imagen final:
  - lleva solo dependencias de producción, sin `ts-node` ni `typescript`;
  - corre como `USER node` (antes era root);
  - usa `NODE_ENV=production`;
  - tiene un `HEALTHCHECK` contra `/health`.
- **Seed compilado** con `tsconfig.seed.json` (`npm run build:seed`) y ejecutado con `node dist-seed/prisma/seed.js`.
- **`docker-entrypoint.sh`:** corre `prisma migrate deploy`, luego el seed si corresponde, y finalmente arranca el servidor.
- **`docker-compose.yml`:**
  - `db` sin puertos publicados y solo en la red `internal`; credenciales desde `.env`.
  - `api` publicada solo en `127.0.0.1:3000` (para depurar); el tráfico público entra por el nginx del frontend a
    través de la red externa `scorpio-net`.
  - `DATABASE_URL` construida a partir de `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB`.
- **`.dockerignore` nuevo** (excluye `.env`, `db_data`, `node_modules`, `.git`, etc.).
- **`.gitignore`:** agrega `db_data/` y `dist-seed/`, y separa una regla `data/` que estaba mal concatenada.

### Operación

- **Endpoints nuevos:**
  - `GET /health` y `GET /api/health`: hacen ping a la base y responden 200 o 503.
  - `GET /api/auth/config`: devuelve `{ signupMode: 'public' | 'admin' }`, para que el frontend muestre u oculte el registro.
- **Cierre ordenado** con `SIGTERM`/`SIGINT`: cierra Socket.IO y HTTP y desconecta Prisma (con un tope de 10 s).
- **Respuesta 404 en JSON** para rutas inexistentes.

### Dependencias

- Se agregan `helmet`, `express-rate-limit` y `dotenv` (`prisma.config.ts` lo importa y antes no estaba declarado).
- `express`, `@prisma/client`, `@prisma/adapter-pg` y `prisma` pasan de `devDependencies` a `dependencies`,
  porque se necesitan en producción (`prisma migrate deploy` corre al arrancar).

### Variables de entorno (`.env`)

| Variable | Obligatoria | Default | Descripción |
|---|---|---|---|
| `POSTGRES_PASSWORD` | sí | — | Contraseña de Postgres. Usa caracteres seguros para URL (`openssl rand -hex 24`). |
| `POSTGRES_USER` / `POSTGRES_DB` | no | `postgres` | Usuario y base. |
| `JWT_SECRET` | sí | — | Mínimo 32 bytes aleatorios (`openssl rand -base64 48`). |
| `ADMIN_PWD` | sí, si hay seed | — | Contraseña inicial del admin (solo se usa al crearlo). |
| `FRONTEND_URL` | sí | `http://localhost:3000` | Origen permitido por CORS y Socket.IO. |
| `SIGNUP_MODE` | no | `admin` | `public` = registro abierto (usuarios normales); `admin` = solo admins crean usuarios. |
| `TRUST_PROXY_HOPS` | no | `3` | Cantidad de proxies delante de la API. |
| `SEED_ON_START` | no | — | `true` para crear el admin si no existe al arrancar. |
| `SOCKET_PATH` | no | `/api/socket.io` | Path de Socket.IO. |

### Pasos de despliegue

1. **Rotar la contraseña de Postgres**, que estuvo expuesta con `postgres/postgres`:
   `docker exec scorpio-backend-db-1 psql -U postgres -c "ALTER USER postgres PASSWORD '<nueva>';"`
2. **Actualizar `.env`** con las variables de la tabla: `POSTGRES_PASSWORD`, un `JWT_SECRET` nuevo y fuerte, y
   `FRONTEND_URL=https://scorpio.cpsrtc.cl`. Quitar `DATABASE_URL`.
3. **Crear la red compartida** si no existe: `docker network create scorpio-net`.
4. **Levantar:** `docker compose up -d --build`.
5. **Verificar:**
   - `curl http://127.0.0.1:3000/health` responde `{"status":"ok"}`;
   - `ss -tlnp` ya no muestra `5432` en `0.0.0.0`;
   - `docker compose exec api id` muestra el usuario `node`.

### Requisitos de infraestructura (fuera del repo)

- **ELB:** el target group tiene que apuntar al puerto **8080** (nginx del frontend), con health check en `/healthz`.
- **CloudFront:**
  - reenviar el header `Authorization` y todos los métodos HTTP;
  - no guardar en caché `/api/*`;
  - permitir WebSocket;
  - enviar el header de origen `X-Origin-Verify` con el mismo valor que `ORIGIN_SECRET` del frontend.
- **Security group del ELB:** limitarlo a la prefix list administrada de CloudFront, para que nadie pueda saltarse el WAF.
- **Firewall del host:** Docker se salta `ufw` para los puertos publicados. Por eso importa publicar solo lo necesario.
- **Backups:** hacer un `pg_dump` periódico de la base.

### Pendiente / conocido

- En `PATCH /api/stations/:uuid`, mandar `decoderConfig: null` no borra el valor guardado (bug previo, no es de seguridad).
- Los JWT duran 24 h y no se pueden revocar antes de que expiren.
- Los cambios del frontend (proxy `/api`, `socket.js`, ocultar el registro según `/api/auth/config`) se coordinan
  en el repo `scorpio-frontend`.
