# Airbnb search · Vanilla JS

Buscador de alojamientos con Node `http` (sin Express) y front vanilla. Listo para **Cloud Run**.

## Local

```bash
npm start
```

Abrí http://localhost:8080

- `GET /api/stays?q=&guests=&max=`
- `GET /api/stays/:id`
- `GET /health`

## Cloud Run

El servicio tiene que escuchar `process.env.PORT` en `0.0.0.0`. Ya está.

### Opción A — desde el código

```bash
gcloud auth login
gcloud config set project TU_PROJECT_ID
gcloud run deploy airbnb-search \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated
```

`--source .` construye con el `Dockerfile` (o buildpacks si lo sacás).

### Opción B — imagen Docker

```bash
gcloud builds submit --tag southamerica-east1-docker.pkg.dev/TU_PROJECT_ID/apps/airbnb-search
gcloud run deploy airbnb-search \
  --image southamerica-east1-docker.pkg.dev/TU_PROJECT_ID/apps/airbnb-search \
  --region southamerica-east1 \
  --allow-unauthenticated
```

Región sugerida: `southamerica-east1` (São Paulo). Sirve para Argentina.

APIs a habilitar una vez: Cloud Run, Cloud Build, Artifact Registry.

## Repo

https://github.com/DanyPreisz/airbnb-search-vanilla
