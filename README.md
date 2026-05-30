# scorpio-backend

Backend API for the Scorpio UC project.

## Docker

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

#### Update the API container without rebuilding the image
```bash
docker compose up -d --build api
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

### Watch logs

Logs from all containers:

```bash
docker compose logs -f
```

Filter the logs for the backend or api container.

```bash
docker compose logs -f api
docker compose logs -f db
```

# Database
## Access to the Database
To access the database, you can use the following command:

```bash
docker compose exec db psql -U postgres -d postgres
```

## Create a new migration in Prisma

Run this command after changing **schema.prisma**.

Prisma now reads the database URL from `prisma.config.ts`, so `DATABASE_URL` must be set in your shell when you run it on the host.

Example on the Raspberry Pi host:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public" npx prisma migrate dev --name DESCRIPTIVE_NAME
```

If you run it inside Docker, the service name from `docker-compose.yml` works instead:

```bash
docker compose exec api npx prisma migrate dev --name DESCRIPTIVE_NAME
```

If you are using the API container, make sure the database container is already up.

```bash
npx prisma migrate dev --name DESCRIPTIVE_NAME
```