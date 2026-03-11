# Prueba Técnica: Servicio de Sincronización de Usuarios

## Resumen

Este repositorio contiene la solución a una prueba técnica para construir un servicio backend "listo para producción" utilizando **Node.js, TypeScript y PostgreSQL**.

El objetivo principal es exponer un endpoint (`POST /sync/user`) que reciba los datos de un usuario y sea **estrictamente idempotente**, garantizando que no se generen registros duplicados en la base de datos ante peticiones repetidas. Además, el proyecto incluye un endpoint extra de validación de estado (`GET /health`), validación de parámetros, manejo centralizado de errores y un sistema de logging detallado (con `requestId` y medición de latencia). Todo el servicio está contenedorizado para facilitar su despliegue.

---

## Requisitos técnicos

Para ejecutar este proyecto, solo necesitas tener instalado en tu sistema:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

_Nota: La aplicación utiliza Express, el driver `pg` para la base de datos, `morgan` para los logs de red y `ts-node-dev` para el entorno de desarrollo._

---

## Instalación

1. **Clona el repositorio** en tu máquina local:
   ```bash
   git clone https://github.com/Radu-A/technical-test-victor-outeiro
   cd technical-test-victor-outeiro
   ```
2. **Instala las dependencias locales**:
   Aunque Docker gestiona sus propias dependencias, es recomendable instalarlas localmente para que TypeScript y el linter de tu editor de código funcionen correctamente:

   ```bash
   npm install
   ```

3. **Levanta los contenedores** usando Docker Compose. Esto inicializará tanto la base de datos PostgreSQL (ejecutando el script de creación de tablas automáticamente) como el servidor Node.js:
   ```bash
   docker compose up
   ```
   Linux
   ```bash
   sudo docker compose up
   ```

El servidor estará corriendo y escuchando en http://localhost:3000.

## Uso

Puedes probar la API utilizando herramientas como Postman, Insomnia o mediante cURL desde tu terminal.

### 1. Endpoint Principal: Sincronizar Usuario

Crea o actualiza un usuario. Si la combinación de credential y email ya existe, se actualizará el nombre en lugar de crear un registro duplicado.

Petición cURL:

```bash
  curl -X POST http://localhost:3000/sync/user \
 -H "Content-Type: application/json" \
 -d '{
   "credential": "cred-12345",
   "email": "usuario@ejemplo.com",
   "name": "Víctor Outeiro"
 }'
```

Posibles Respuestas:

200 OK: Sincronización exitosa (devuelve el objeto del usuario).

400 Bad Request: Falta algún campo o el formato del email es inválido.

500 Internal Server Error: Error en la base de datos.

### 2. Endpoint de Salud (Bonus)

Verifica que la API está en pie y conectada correctamente a la base de datos.

Petición cURL:

```bash
curl -X GET http://localhost:3000/health
```

## Aprendido y Dificultades

Durante el desarrollo de esta prueba de 90 minutos, me he enfrentado a varios retos interesantes de los que he aprendido bastante:

### Dockerización completa:

He aprendido a configurar Docker con la imagen de una base de datos conectada correctamente al servidor de la API, y a resolver los errores típicos de configuración y redes entre contenedores en docker-compose.

### TypeScript en el Backend:

De lo que más me ha costado ha sido implementar TypeScript en el backend, ya que es algo relativamente nuevo para mí (estoy muy acostumbrado a Angular en el front). He comprobado que la configuración por defecto del package.json de Node y el tsconfig.json a menudo no están del todo preparadas out-of-the-box, y hay que realizar modificaciones y ajustes constantemente para que TS funcione sin fricción con Node en modo desarrollo (usando herramientas como ts-node-dev).

### Idempotencia:

La idempotencia de la petición se ha solucionado de forma robusta directamente en la capa de la base de datos. Esto se ha logrado en dos fases:

1. Creando restricciones UNIQUE (credential, email) en la definición de la tabla.
2. En la query de inserción, utilizando las cláusulas ON CONFLICT (credential, email) y DO UPDATE SET name = EXCLUDED.name. De este modo delegamos la validación a PostgreSQL de forma segura y eficiente.

## Qué he dejado fuera y por qué

Tiempo real empleado: Exactamente 90 minutos.

Debido al límite estricto de tiempo, he tomado la decisión de priorizar que el núcleo de la aplicación (arquitectura, docker, validaciones, logging e idempotencia) fuera sólido, funcional y limpio. Por ello, he dejado fuera:

- Autenticación con JWT: Descartada única y exclusivamente para asegurarme de entregar una aplicación sólida y bien documentada dentro de los 90 minutos exactos, evitando bugs de última hora con la verificación de tokens.

- Testing unitario (Jest/Vitest): Tendría que emplear una lógica y configuración inicial que todavía no manejo con soltura extrema, y por el mismo motivo que el punto anterior (falta de tiempo), he preferido asegurar la funcionalidad principal.

## Agradecimientos

Un agradecimiento especial a los mentores que han guiado mi camino como desarrollador de software:

- Alejandro R. - Mi instructor en el Bootcamp de The Bridge.

- Inmaculada Contreras - Instructora en la Certificación Profesional de Avante.

- Jose María - Fundador de Insinno y mi tutor de prácticas, por darme mi primera oportunidad en un entorno profesional.
