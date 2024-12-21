### README.md

# RepoRadar Server

The backend of RepoRadar, a GraphQL-powered API for tracking GitHub repository activity. Built with Node.js, Apollo Server, and PostgreSQL, it fetches data from the GitHub API, stores repository information, and synchronizes updates for the client.

## Table of Contents

- Installation
- Usage
- Environment Variables
- Scripts
- Folder Structure
- How It Works

## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yourusername/repo-radar-server.git
   cd repo-radar-server
   ```

2. **Install dependencies**:

   ```sh
   pnpm install
   ```

3. **Set up the environment variables**:

   ```sh
   cp .env.example .env
   ```

4. \*\*Update the

.env

file\*\* with your configuration.

5. **Run the database migrations**:
   ```sh
   pnpm prisma migrate deploy
   ```

## Usage

### Running Locally

To start the development server with hot-reloading:

```sh
pnpm run dev
```

To build and start the production server:

```sh
pnpm run build
pnpm start
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: The URL of the PostgreSQL database.
- `GRAPHQL_URL`: The URL of the GraphQL endpoint.
- `NODE_ENV`: The environment (development, test, production, staging).
- `PORT`: The port on which the server will run.
- `APP_NAME`: The name of the application.
- `CLOUD_API_KEY`: The API key for the cloud service.
- `CLOUD_API_SECRET`: The API secret for the cloud service.
- `CLOUD_NAME`: The name of the cloud service.
- `EMAIL_FROM_ID`: The email address from which emails will be sent.
- `EMAIL_FROM_NAME`: The name from which emails will be sent.
- `FRONT_END_ORIGIN`: The URL of the front-end application.
- `LOCAL_FRONT_END_ORIGIN`: The URL of the local front-end application.
- `JWT_SECRET`: The secret key for JWT authentication.
- `SENDGRID_API_KEY`: The API key for SendGrid.
- `SENDGRID_HOST`: The host for SendGrid.
- `SENDGRID_PORT`: The port for SendGrid.
- `SENDGRID_USER`: The user for SendGrid.

## Scripts

- `build`: Compiles the TypeScript code and copies GraphQL schema files to the `dist` directory.
- `start`: Starts the compiled code.
- `dev`: Starts the development server with hot-reloading and watches for GraphQL schema changes.
- `graphql-codegen`: Generates TypeScript types from the GraphQL schema.
- `graphql-codegen:watch`: Watches for changes in the GraphQL schema and regenerates TypeScript types.
- `lint`: Runs ESLint and Prettier on the codebase.
- `format`: Formats the codebase using Prettier.
- `seed-country`: Seeds the country data.
- `seed`: Runs all seed scripts.

## Folder Structure

```
📁 .env
📁 .gitignore
📁 .nvmrc
📁 .prettierrc
📁 .vscode/
  📄 settings.json
📁 @type/
  📄 global.d.ts
📁 codegen.json
📁 data/
  📄 country.csv
📁 eslint.config.js
📁 nodemon.json
📁 package.json
📁 pnpm-lock.yaml
📁 prisma/
  📁 migrations/
    ...
  📄 schema.prisma
📁 src/
  📁 application/
  📁 domain/
    📁 modules/
      📁 repository/
        📄 resolvers.ts
        📄 service.ts
        📁 types/
          📄 dto.ts
          📄 entity.ts
        📄 validation.ts
        📄 loaders.ts
        📄 schema.graphql
      ...
    📁 shared/
      📁 types/
        📁 common/
          📄 graphql.ts
        📁 dto/
          📄 github.dto.ts
      📁 utils/
        📄 regex.ts
        📄 default.ts
  📁 infrastructure/
    📁 config/
      📄 environment.ts
    📁 database/
    📁 error/
    📁 logging/
      📄 logger.ts
    📁 shared/
      📁 types/
        ...
      📁 utils/
        📄 error.ts
  📁 seed/
  📁 shared/
    📁 utils/
      📄 time.ts
📄 index.ts
📄 tsconfig.json
```

### Explanation of Folder Structure

- **📁 .env**: Environment variables configuration file.
- **📁 .gitignore**: Specifies files and directories to be ignored by Git.
- **📁 .nvmrc**: Node version manager configuration file.
- **📁 .prettierrc**: Prettier configuration file.
- **📁 .vscode/**: VSCode specific settings.
  - **📄 settings.json**: Configuration for VSCode settings.
- **📁 @type/**: Global TypeScript type definitions.
  - **📄 global.d.ts**: Global type definitions for the project.
- **📁 codegen.json**: Configuration for GraphQL code generation.
- **📁 data/**: Contains data files for seeding the database.
  - **📄 country.csv**: CSV file containing country data for seeding.
- **📁 eslint.config.js**: ESLint configuration file.
- **📁 nodemon.json**: Nodemon configuration file for development.
- **📁 package.json**: Project metadata and dependencies.
- **📁 pnpm-lock.yaml**: Lockfile for pnpm package manager.
- **📁 prisma/**: Contains Prisma schema and migrations.
  - **📁 migrations/**: Directory containing database migration files.
  - **📄 schema.prisma**: Prisma schema definition file.
- **📁 src/**: Main source code directory.
  - **📁 application/**: Application-level logic.
  - **📁 domain/**: Domain-specific logic.
    - **📁 modules/**: Contains different modules of the application.
      - **📁 repository/**: Repository module.
        - **📄 resolvers.ts**: GraphQL resolvers for the repository module.
        - **📄 service.ts**: Business logic for the repository module.
        - **📁 types/**: Type definitions for the repository module.
          - **📄 dto.ts**: Data Transfer Objects.
          - **📄 entity.ts**: Entity definitions.
        - **📄 validation.ts**: Validation schemas.
        - **📄 loaders.ts**: DataLoaders for batching and caching.
        - **📄 schema.graphql**: GraphQL schema for the repository module.
      - **...**: Other modules.
    - **📁 shared/**: Shared utilities and types.
      - **📁 types/**: Shared type definitions.
        - **📁 common/**: Common types.
          - **📄 graphql.ts**: GraphQL related types.
        - **📁 dto/**: Shared DTOs.
          - **📄 github.dto.ts**: GitHub related DTOs.
      - **📁 utils/**: Shared utility functions.
        - **📄 regex.ts**: Regular expressions.
        - **📄 default.ts**: Default values and constants.
  - **📁 infrastructure/**: Infrastructure-related code.
    - **📁 config/**: Configuration files.
      - **📄 environment.ts**: Environment variables configuration.
    - **📁 database/**: Database related code.
    - **📁 error/**: Custom error handling.
    - **📁 logging/**: Logging configuration.
      - **📄 logger.ts**: Logger setup.
    - **📁 shared/**: Shared infrastructure utilities and types.
      - **📁 types/**: Shared infrastructure types.
      - **📁 utils/**: Shared infrastructure utilities.
        - **📄 error.ts**: Error handling utilities.
  - **📁 seed/**: Database seeding scripts.
  - **📁 shared/**: Shared utilities and types.
    - **📁 utils/**: Shared utility functions.
      - **📄 time.ts**: Time-related utilities.
- **📄 index.ts**: Entry point of the application.
- **📄 tsconfig.json**: TypeScript configuration file.

## How It Works

### Overview

RepoRadar Server is a backend application that provides a GraphQL API for tracking GitHub repository activity. It interacts with the GitHub API to fetch repository data, stores this data in a PostgreSQL database, and synchronizes updates for the client.

### Key Components

1. **GraphQL Schema**: Defines the structure of the GraphQL API, including queries and mutations.
2. **Resolvers**: Handle the logic for GraphQL queries and mutations.
3. **Services**: Contain the business logic and interact with the database.
4. **DataLoaders**: Batch and cache database requests to optimize performance.
5. **Types**: Define TypeScript types and validation schemas using Zod.
6. **Logging**: Configured using the `winston` library for logging application events.
7. **Error Handling**: Custom error handling to manage various error scenarios.

### Workflow

1. **Client Requests**: The client sends GraphQL queries or mutations to the server.
2. **Resolvers**: The resolvers handle these requests by invoking the appropriate service methods.
3. **Services**: The services contain the business logic and interact with the database to fetch or update data.
4. **DataLoaders**: DataLoaders are used to batch and cache database requests, improving performance.
5. **Database**: The PostgreSQL database stores repository information and other related data.
6. **GitHub API**: The application interacts with the GitHub API to fetch repository data and updates.
7. **Response**: The server sends the response back to the client with the requested data or confirmation of the mutation.
