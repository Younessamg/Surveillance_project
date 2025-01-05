# Surveillance Management System

A comprehensive surveillance management solution built with Spring Boot and React.js, offering enterprise-grade security and monitoring capabilities.

## Overview

This application provides a robust surveillance management platform that combines secure authentication, real-time monitoring, and an intuitive user interface. The system is designed for scalability and maintains high performance while handling multiple surveillance streams.

## Technology Stack

### Backend Infrastructure
- Java 23
- Spring Boot 3.4.0
- Spring Security for authentication and authorization
- Spring Data JPA for data persistence
- MySQL Database
- Maven for dependency management

### Frontend Framework
- React.js 18
- Axios for HTTP requests
- React Router DOM for navigation
- JWT for secure authentication

## Core Features

Our surveillance system delivers comprehensive monitoring capabilities through the following features:

- Advanced user authentication and role-based authorization
- Real-time video stream processing and display
- Intelligent motion detection with customizable alerts
- Centralized user and camera management
- Detailed event logging with audit trails
- Configurable notification settings
- Data export functionality for logs and recordings

## System Requirements

Ensure your environment meets these prerequisites:
- Java Development Kit (JDK) 17 or higher
- Node.js 18 or higher
- MySQL 14 or higher
- Maven 3.8 or higher

## Architecture

The application follows a layered architecture pattern:

### Backend Architecture

1. Controllers Layer
- Manages REST endpoint implementations
- Handles request validation and routing
- Processes HTTP requests and responses

2. Services Layer
- Implements core business logic
- Manages transaction processing
- Coordinates system components
- Handles data transformations

3. Repositories Layer
- Manages data persistence operations
- Implements JPA repositories
- Provides optimized data access methods

4. Entities Layer
- Defines JPA entity mappings
- Manages database relationships
- Implements data models

## Installation Guide

### Backend Deployment

1. Clone the repository:
```bash
git clone https://github.com/Younessamg/Surveillance-project.git
cd surveillance-system/backend
```

2. Configure your database connection in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/surveillances
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Build and launch the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend server will be accessible at `http://localhost:8080`

### Frontend Deployment

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install required dependencies:
```bash
npm install
```

3. Launch the development server:
```bash
npm start
```

The frontend application will be available at `http://localhost:3000`

## API Documentation

Core API Endpoints:
- Authentication: `POST /api/auth/login`
- Department Management: `POST /api/departments`
- Location Management: `POST /api/locals`
- Configuration: `POST /api/options`
- Module Management: `POST /api/modules`
- Examination Access: `GET /api/exams`

## Security Implementation

The system implements JWT (JSON Web Tokens) for secure authentication. Security configurations can be customized in `SecurityConfig.java`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Security configuration implementation
}
```

## Configuration Management

### Backend Settings

Configure system properties in `application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=your_jwt_secret
jwt.expiration=86400000
```

### Frontend Settings

Environment-specific configurations are managed through:
- `.env.development`
- `.env.production`
- `.env.test`

## Project Structure

```
surveillance_project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── services/
│   ├── package.json
│   └── README.md
└── README.md
```

## Contributing

We welcome contributions from the community. Please follow our contribution guidelines when submitting changes or improvements to the project.

## Development Team

- Younes Amerga ([GitHub](https://github.com/Younessamg))
- Zineb Taghti ([GitHub](https://github.com/zinebtaghti))
- Asmae Lahlou ([GitHub](https://github.com/lahlouasmae))
- Omar Boutkhoum

## License

This project is licensed under the MIT License. See the LICENSE file for complete details.

## Support

For technical support or inquiries, please create an issue in the repository or contact the development team directly.
