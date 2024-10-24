# Task Management System

This is a Task Management System built with **NestJS** and **PostgreSQL**, using **Knex.js** for database queries. The system supports three main roles: `Admin`, `Tashkilot Rahbari`, and `Tashkilot Xodimi`, each with their own set of functionalities. The application runs inside **Docker** containers to ensure portability and ease of setup.

## Features

- **Admin**: Organization and user management (CRUD), and statistics.
- **Tashkilot Rahbari**: Project and task management (CRUD), with task assignments to employees.
- **Tashkilot Xodimi**: Viewing and updating task statuses.
- REST APIs for all functionalities.
- No authentication or authorization required.
- Easy-to-run setup with Docker and Docker Compose.

## Prerequisites

Before you start, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/fayyozbobokulov/taskManagement.git
cd taskManagement
```

### 2. Build and Run the Containers

The application uses Docker to run both the NestJS app and PostgreSQL database. You can easily start the environment using Docker Compose.

```bash
docker-compose up --build
```

This command will:

- Build the **NestJS** application.
- Start a **PostgreSQL** container.
- Expose the NestJS app on `http://localhost:3000`.
- Expose PostgreSQL on port `5432` with the following credentials:
  - **Username**: `admin`
  - **Password**: `admin_password`
  - **Database**: `project_management_db`

### 3. Access the Application

- The **NestJS** app will be running at `http://localhost:3000`.
- PostgreSQL can be accessed locally via `localhost:5432` using a tool like pgAdmin or psql.

### 4. Stopping the Containers

To stop the containers:

```bash
docker-compose down
```

This will stop and remove the running containers.

### 5. Data Persistence

> **Note**: By default, data persistence is disabled. The PostgreSQL container is set up without a persistent volume, meaning any data in the database will be lost when the container is stopped or removed. This setup is ideal for development or temporary environments.

If you want to persist the database data, add the following volume back to the `docker-compose.yml` file under the `postgres` service:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

### 6. Removing the `version` Field in `docker-compose.yml`

With **Docker Compose v2.0** and later, the `version` field is no longer required and is considered obsolete. As such, this project has removed the `version` field from `docker-compose.yml` to avoid unnecessary warnings.

If you're running an older version of Docker Compose, please upgrade to the latest version to avoid compatibility issues.

## File Structure

```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── admin/
│   ├── organization/
│   ├── project/
│   ├── task/
│   └── knex/
│       ├── knex.module.ts
│       └── constants.ts
├── config/
│   └── knexfile.ts
└── docker-compose.yml
```

## Environment Variables

The following environment variables are set in the `docker-compose.yml` file for easy configuration:

| Variable        | Description                        |
| --------------- | ---------------------------------- |
| `DB_HOST`     | The hostname for the PostgreSQL DB |
| `DB_PORT`     | The port for PostgreSQL (5432)     |
| `DB_USER`     | The PostgreSQL username            |
| `DB_PASSWORD` | The PostgreSQL password            |
| `DB_NAME`     | The PostgreSQL database name       |

These values can be adjusted in the `docker-compose.yml` file if necessary.

## Running Migrations

To set up the initial database schema, you can run the migrations using Knex.

```bash
npx knex migrate:latest --knexfile src/config/knexfile.ts
```

This will create the necessary tables for the application.

## Usage

Once the application is running, you can use tools like Postman or curl to interact with the APIs.

For example, to create an organization:

```bash
POST http://localhost:3000/admin/create-organization
Body:
{
  "name": "My Organization"
}
```

## Additional Information

- **Branching and Commits**: For proper branching and commit messages, use feature-based branches and meaningful commit messages. For example, when adding task CRUD operations, you could use:

  ```bash
  git checkout -b feature/task-crud
  git commit -m "Add task CRUD operations"
  ```
- **Node.js LTS**: The project uses **Node.js 20.18.0 LTS** for stability. You can modify the `Dockerfile` if you need to upgrade to a newer version in the future.

## Troubleshooting

- If you encounter errors related to port conflicts, make sure the necessary ports (`3000` for the app and `5432` for PostgreSQL) are not in use by other services.
- If the database is not connecting properly, verify the environment variables in the `docker-compose.yml` file.

## License

This project is licensed under the MIT License.
