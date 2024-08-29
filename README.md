# News API Backend Service

## Table of Contents

- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
- [Running Tests](#running-tests)
- [Hosted Version](#hosted-version)

## Project Overview

This project serves as a backend API that provides news data to a front-end client. It is built with Express.js and connects to a PostgreSQL database hosted on Supabase using node-postgres. The project is configured to work in different environments (development, testing, etc.) and includes scripts for setting up and seeding the local database.

The **/api** endpoint serves as documentation, detailing all of the available API endpoints.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following software installed:

- **Node.js**: Minimum version `22.4.1`
- **psql (PostgreSQL)**: Minimum version `16.4`

### Installation

1. **Clone this repository**:
   ```bash
   git clone https://github.com/IrynaBondarenko7/news_API.git
   cd news_API
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create environment variable files:

   - Create two files: .env.test and .env.development in the root directory.
   - Inside each file, add the following line with the appropriate database name, replace your_database_name with the name of your PostgreSQL database:

   ```
   PGDATABASE=your_database_name
   ```

   - Refer to the .env-example file for more details.

### Database Setup

Once your environment variables are configured:

```
npm run setup-dbs
npm run seed
```

### Running Tests

To run tests, use the following command:

```
npm test
```

### Hosted Version

You can access the hosted version of this News API at:

[newsAPI](https://news-api-4de7.onrender.com/)

This link provides access to the live API where you can make requests to fetch news data.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
