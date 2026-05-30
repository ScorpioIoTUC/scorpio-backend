# scorpio-backend

Backend API for the Scorpio UC project.

## Docker

### Ver logs

Para ver todo el stack:

```bash
docker compose logs -f
```

Para ver solo la API o la base de datos:

```bash
docker compose logs -f api
docker compose logs -f db
```

### Start the full stack from zero

This starts Postgres, runs Prisma migrations inside the API container, and then seeds the database.

```bash
docker compose down -v
docker compose up --build
```

### Start the full stack without rebuilding images

Use this when Dockerfiles and dependencies have not changed.

```bash
docker compose up -d
```

### Stop all services

```bash
docker compose stop
```

### Stop and remove all containers

Use this when you want to start fresh again later. If you run `up` after this, the API container will execute migrations and seed again.

```bash
docker compose down
```

### Reset the database

This removes the database volume too, so you start with an empty Postgres again.

```bash
docker compose down -v
docker compose up --build
```

### Create a new migration

When the stack is up, create migrations from the API container:

```bash
docker compose up -d
docker compose exec api yarn prisma migrate dev --name add_feature_name
```

### Reseed the database

The seed is already executed on API startup. If you want to run it again manually:

```bash
docker compose exec api yarn seed
```

### Rebuild only the API image

Use this when only the API source code has changed.

```bash
docker compose build api
docker compose up -d
```