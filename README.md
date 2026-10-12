# AKIO'S — Cinematic Video Editor Portfolio

A production-grade, editorial video editor portfolio built with **React 19 + TypeScript + Vite**, powered by a **Java 21 / Spring Boot 3 microservices backend**, **Spring Cloud Gateway**, and **MySQL 8.0** in Docker.

---

## 🏛 System Architecture

```text
[ Browser / Client ]
        │
        ▼ (Port 5173 / Production CDN)
[ React + Vite Frontend ]
        │ /api/* proxy
        ▼ (Port 8080)
[ Spring Cloud Gateway ]
 ├── /api/auth/**      ──►  [ Auth Service ]    (Port 8081) ──► [ MySQL:3307 ]
 ├── /api/projects/**  ──►  [ Project Service ] (Port 8082) ──► [ MySQL:3307 ] + Local Media
 └── /api/contact/**   ──►  [ Contact Service ] (Port 8083) ──► Gmail SMTP (587)
```

- **Frontend (`frontend/`)**: React 19, TypeScript, Vite, GSAP + ScrollTrigger, Lenis smooth scroll, Custom Canvas Cursor particle physics.
- **API Gateway (`backend-java/api-gateway/`)**: Spring Cloud Gateway routing requests, handling CORS, multipart file streaming, and JWT validation for `/api/admin/*`.
- **Auth Service (`backend-java/auth-service/`)**: Spring Boot, Spring Security, BCrypt password hashing, JJWT token issuance.
- **Project Service (`backend-java/project-service/`)**: Spring Boot, Spring Data JPA / Hibernate, MySQL persistence, media stream handling (HTTP 206 Partial Content).
- **Contact Service (`backend-java/contact-service/`)**: Spring Boot, Spring Mail, asynchronous Jakarta validation, Gmail SMTP dispatch.
- **Database**: MySQL 8.0 running inside Docker on port `3307` with persistent volumes.
- **Legacy Backend (`backend/`)**: Node.js/Express legacy API preserved for reference.

---

## 📋 Prerequisites

- **Java Development Kit (JDK)**: Version 21 or later
- **Maven**: 3.9+
- **Node.js**: v18+ and npm v9+
- **Docker & Docker Compose**: For local MySQL 8.0

---

## ⚙️ Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MYSQL_URL` | JDBC Connection String | `jdbc:mysql://localhost:3307/portfolio_db?allowPublicKeyRetrieval=true&useSSL=false` |
| `MYSQL_USER` | MySQL Database Username | `root` |
| `MYSQL_PASSWORD` | MySQL Database Password | `root` |
| `JWT_SECRET` | Secret key for JWT signing (HMAC-SHA256) | Minimum 32-character secure string |
| `JWT_EXPIRATION` | Token validity duration in ms | `86400000` (24 hours) |
| `MAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | Sender email address | `your-email@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |
| `CONTACT_TO_EMAIL`| Destination inbox for inquiries | `akioCVE@gmail.com` |

---

## 🚀 Quick Start (Local Development)

### 1. Start the MySQL Database
```bash
docker compose up -d
```
*MySQL will be accessible at `localhost:3307` with database `portfolio_db`.*

### 2. Build and Start the Java Microservices
From the project root:

```bash
# Build all backend microservices
mvn clean package -DskipTests

# Start Auth Service (Port 8081)
mvn -pl backend-java/auth-service spring-boot:run &

# Start Project Service (Port 8082)
mvn -pl backend-java/project-service spring-boot:run &

# Start Contact Service (Port 8083)
mvn -pl backend-java/contact-service spring-boot:run &

# Start API Gateway (Port 8080)
mvn -pl backend-java/api-gateway spring-boot:run &
```

Verify service listeners:
```bash
lsof -nP -iTCP:8080 -iTCP:8081 -iTCP:8082 -iTCP:8083 -sTCP:LISTEN
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔌 Core API Endpoints

### Public Endpoints (Via Gateway on `http://localhost:8080` or Frontend Proxy `http://localhost:5173`)
- `GET /api/projects`: Retrieve all published editorial projects.
- `GET /api/projects/:slug`: Retrieve full project brief and metadata by slug.
- `GET /api/projects/media/:projectId/:filename`: Stream project videos (HTTP 206) and posters.
- `POST /api/contact`: Submit project inquiries (dispatches email with client reply-to).
- `POST /api/auth/login`: Authenticate admin user (`username`, `password`) -> returns JWT token.

### Admin Endpoints (Requires `Authorization: Bearer <token>`)
- `GET /api/admin/projects`: List all projects (including drafts).
- `POST /api/admin/projects`: Create a new project.
- `PUT /api/admin/projects/:id`: Update an existing project.
- `DELETE /api/admin/projects/:id`: Delete project and associated media.
- `POST /api/admin/projects/reorder`: Persist project presentation sort order.
- `POST /api/admin/import`: Upload video/poster media assets.

---

## 📁 Repository Structure

```text
akios/
├── backend-java/
│   ├── api-gateway/         # Spring Cloud Gateway (Port 8080)
│   ├── auth-service/        # JWT & Admin Authentication (Port 8081)
│   ├── project-service/     # Projects JPA CRUD & Media Streaming (Port 8082)
│   └── contact-service/     # Contact form inquiry processing (Port 8083)
├── backend/                 # Legacy Node.js/Express API
├── frontend/                # React 19 + TypeScript + Vite portfolio frontend
├── prisma/                  # Prisma schema (legacy ORM reference)
├── scripts/                 # Utility automation scripts
├── tests/                   # End-to-end integration test suites
├── docker-compose.yml       # Local MySQL 8.0 container definition
├── pom.xml                  # Parent Maven multi-module definition
└── README.md                # Project documentation
```

---

## 🔒 Security & Data Hygiene
- Real credentials, `.env` files, and database dumps (`*.sql`) are strictly ignored via `.gitignore`.
- Heavy video streaming binaries in local runtime directories (`uploads/`) are kept on host disk and excluded from Git commits.
