# CampusFlow — Student Management System

A full-stack student directory built with React and Spring Boot. It started as a small CRUD exercise and has been reorganized into a frontend and REST API so the UI and database logic can evolve independently.

## Stack
- React 18 + Vite
- Java 17 + Spring Boot 3
- Spring Web + Spring Data JPA + Bean Validation
- MySQL 8
- Plain CSS with a small responsive design system

## Features
- Dashboard with student count and average GPA
- Add and edit student records
- Search by student ID, name, major or phone
- Sort the directory
- Delete with confirmation
- Form validation and useful API error messages
- Responsive layout for laptop and tablet widths

## Requirements
- JDK 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## 1. Database setup

Run `database/setup.sql` in MySQL Workbench. It creates the `campusflow` database, creates the `students` table and inserts four sample records. The backend also has `spring.jpa.hibernate.ddl-auto=update` enabled for development, so JPA can update the table as the entity changes.

## 2. Configure MySQL

Open `backend/src/main/resources/application.properties` and set your MySQL username and password, or set environment variables:

**Windows CMD**
```bat
set DB_USERNAME=root
set DB_PASSWORD=your_mysql_password
```

**PowerShell**
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

## 3. Start the backend

Open a terminal in `backend`:

```bash
mvn spring-boot:run
```

API base URL: `http://localhost:7070/api/students`

## 4. Start the React frontend

Open another terminal in `frontend`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/students` | List/search/sort students |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |
| GET | `/api/students/summary` | Dashboard statistics |

## Project structure

```text
CampusFlow-React-FullStack/
├── database/
│   └── setup.sql
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/campusflow/
│       ├── CampusFlowApplication.java
│       ├── config/WebConfig.java
│       ├── controller/StudentController.java
│       ├── dto/StudentRequest.java
│       ├── dto/DashboardSummary.java
│       ├── entity/Student.java
│       ├── exception/GlobalExceptionHandler.java
│       ├── repository/StudentRepository.java
│       └── service/StudentService.java
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/studentApi.js
        └── styles.css
```

## How the application works

1. A user interacts with the React page.
2. React calls the backend through HTTP using `fetch`.
3. `StudentController` receives the REST request.
4. `StudentService` validates business rules and coordinates the operation.
5. `StudentRepository` uses Spring Data JPA to talk to MySQL.
6. The API returns JSON and React refreshes the directory.

## Notes
- This is a portfolio/learning application, not a production deployment.
- For production, add authentication and authorization, database migrations (Flyway), pagination, audit logging, HTTPS, and stricter operational configuration.
- `ddl-auto=update` is convenient while learning. Use versioned migrations for a deployed application.

