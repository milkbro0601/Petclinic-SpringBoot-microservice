# Spring PetClinic Microservices — Extended Platform

A microservices-based veterinary clinic management platform, extended from the original Spring PetClinic sample application with new business capabilities, a redesigned API gateway routing layer, and a companion native mobile application.

---

## Overview

This project extends the Spring PetClinic sample into a full microservices-based veterinary clinic platform with new business capabilities, a redesigned API gateway layer, a native mobile application, and a locally hosted GenAI assistant.

The work in this branch focuses on delivering a complete clinic management workflow spanning customer and pet records, veterinary staff, scheduled visits, treatments and medicines, billing and invoicing, operational reporting, and AI-assisted interactions.

The platform is delivered across three surfaces:

- **Backend** — Spring Boot microservices orchestrated with Spring Cloud Config, Eureka service discovery, and an API Gateway
- **Web application** — AngularJS single-page application served through the gateway
- **Mobile application** — React Native (Expo) application consuming the same backend APIs

---

## Architecture

```
                            ┌─────────────────────┐
                            │   Config Server      │  :8888
                            └──────────┬───────────┘
                                       │
                            ┌──────────▼───────────┐
                            │  Discovery Server     │  :8761
                            │     (Eureka)          │
                            └──────────┬───────────┘
                                       │
                            ┌──────────▼───────────┐
                            │    API Gateway        │  :8080
                            └──────────┬───────────┘
                                       │
        ┌──────────────┬──────────────┼──────────────┬──────────────┬──────────────┐
        │              │              │              │              │              │
   ┌────▼────┐   ┌─────▼────┐   ┌─────▼────┐   ┌─────▼─────┐  ┌────▼─────┐  ┌─────▼─────┐
   │Customers│   │  Visits  │   │   Vets   │   │ Treatment │  │ Invoice  │  │  Report   │
   │ Service │   │ Service  │   │ Service  │   │  Service  │  │ Service  │  │ Service   │
   │  :8081  │   │  :8082   │   │  :8083   │   │  :8085    │  │  :8086   │  │  :8087    │
   └─────────┘   └──────────┘   └──────────┘   └───────────┘  └──────────┘  └───────────┘

                            ┌──────────────────────┐
                            │   GenAI Service        │
                            │   (Ollama LLM)         │
                            └──────────────────────┘

   ┌──────────────────────┐          ┌──────────────────────┐
   │  Web App (AngularJS) │          │ Mobile App (React     │
   │  served via Gateway  │          │ Native / Expo)         │
   └──────────────────────┘          └──────────────────────┘
```

All client applications — web and mobile — communicate exclusively through the API Gateway, which performs request routing, circuit breaking, and retry policies via Spring Cloud Gateway and Resilience4j.

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| Config Server | 8888 | Centralized externalized configuration |
| Discovery Server | 8761 | Eureka service registry |
| API Gateway | 8080 | Single entry point, routing, circuit breaking |
| Customers Service | 8081 | Owner and pet records |
| Visits Service | 8082 | Visit scheduling and history |
| Vets Service | 8083 | Veterinarian directory and specialties |
| Treatment Service | 8085 | Treatment and medicine catalog |
| Invoice Service | 8086 | Billing, invoice generation, payment status |
| Report Service | 8087 | Aggregated visit analytics and reporting |
| GenAI Service | 0 | LLM-backed assistant via Ollama |

Treatment, Invoice, and Report services were newly designed and implemented as part of this project, including schema design, REST API contracts, and integration with existing services via Eureka-based service discovery.

---

## What Changed in This Branch

This branch adds and integrates several new capabilities across the platform:

- New domain services for treatments, invoicing, and reporting
- API gateway routing and service integration improvements
- A React Native / Expo mobile application consuming the same backend APIs as the web app
- A GenAI assistant powered by a locally hosted Ollama model
- End-to-end local setup and verification instructions for backend, web, mobile, and AI flows

## Key Capabilities

### Customer and Pet Management
Full lifecycle management of owners and their pets, including registration, profile updates, and pet type classification.

### Visit Scheduling
Recording and retrieval of veterinary visits per pet, including a dedicated endpoint added to support cross-service reporting aggregation.

### Treatment and Medicine Catalog
A standalone catalog service supporting creation, update, and removal of treatments and medicines with pricing.

### Invoicing
Invoice generation tied to a visit, owner, and pet, with line items for treatments and medicines, automatic subtotal and total calculation, and payment status tracking (`PENDING` / `PAID`).

### Reporting
Daily, monthly, and annual visit analytics aggregated from the Visits Service, including busiest-day and busiest-month insights, exposed via the Report Service and surfaced on both web and mobile dashboards.

### AI Assistant
A locally hosted Ollama LLM integration exposed through the GenAI Service, providing conversational assistance within the web application. The current setup is suitable for local development and demonstration use, while more complex tool-calling scenarios may benefit from a stronger model in the future.

---

## Mobile Application

A native iOS/Android companion application was developed using React Native and Expo, mirroring the full functionality of the web client.

**Stack:** React Native · Expo · React Navigation · Axios

**Screens:**
- Dashboard — live visit summary statistics and quick navigation
- Owners — searchable directory with full owner and pet detail views
- Vets — veterinary staff directory with specialties
- Treatments — treatment and medicine catalog management
- Invoices — invoice listing, creation, and payment status updates
- Reports — daily, monthly, and annual reporting with date selection

All mobile screens are connected to the same backend API Gateway used by the web application, ensuring a single source of truth across platforms. The mobile application was built mock-first — UI scaffolded against static data, then incrementally wired to live backend endpoints, with each CRUD operation validated against the running services before progressing to the next screen.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend framework | Spring Boot 4, Spring Cloud 5 |
| Service discovery | Netflix Eureka |
| API Gateway | Spring Cloud Gateway (WebFlux) |
| Resilience | Resilience4j (circuit breaker, retry) |
| Persistence | Spring Data JPA, Hibernate, HSQLDB |
| Object mapping | Lombok |
| Build | Maven |
| Web frontend | AngularJS, Bootstrap |
| Mobile frontend | React Native, Expo, React Navigation |
| AI | Ollama (local LLM) |
| Observability | Micrometer, Zipkin tracing, Prometheus metrics |

---

## Getting Started

### Quick Start Summary

To run the full local experience:

1. Start the backend infrastructure services
2. Launch the web and mobile clients
3. Start the GenAI service with Ollama
4. Verify the AI endpoint through the API gateway

### Prerequisites
- Java 17+ (JDK 26 recommended for local development)
- Node.js and npm
- Maven (wrapper included)
- Xcode (for iOS Simulator, mobile development)

### Running the Backend

Start each service in dependency order — config and discovery servers first, then dependent services:

```bash
./mvnw spring-boot:run -pl spring-petclinic-config-server &
sleep 30
./mvnw spring-boot:run -pl spring-petclinic-discovery-server &
sleep 20
./mvnw spring-boot:run -pl spring-petclinic-customers-service -Dspring-boot.run.jvmArguments="-Dserver.port=8081" &
./mvnw spring-boot:run -pl spring-petclinic-visits-service -Dspring-boot.run.jvmArguments="-Dserver.port=8082" &
./mvnw spring-boot:run -pl spring-petclinic-vets-service -Dspring-boot.run.jvmArguments="-Dserver.port=8083" &
./mvnw spring-boot:run -pl spring-petclinic-treatment-service -Dspring-boot.run.jvmArguments="-Dserver.port=8085" &
./mvnw spring-boot:run -pl spring-petclinic-invoice-service -Dspring-boot.run.jvmArguments="-Dserver.port=8086" &
./mvnw spring-boot:run -pl spring-petclinic-report-service -Dspring-boot.run.jvmArguments="-Dserver.port=8087" &
./mvnw spring-boot:run -pl spring-petclinic-api-gateway &
```

Verify all services are registered:
```
http://localhost:8761
```

Access the web application:
```
http://localhost:8080
```

### Running the Mobile Application

```bash
cd petclinic-mobile
npm install
npx expo start --ios
```

The mobile application targets `http://localhost:8080` when run on the iOS Simulator, and the host machine's local network IP address when run on a physical device.

---

## Local LLM Setup and Integration

The GenAI service in this project can run locally with Ollama, which is the easiest path for development and demos without requiring cloud API keys.

### 1. Install and start Ollama

Install Ollama on your machine, then start it:

```bash
ollama serve
```

Verify that Ollama is available:

```bash
ollama --version
ollama list
```

### 2. Pull a model

The current configuration uses `llama3.2`:

```bash
ollama pull llama3.2
```

### 3. Configure the GenAI service

The GenAI service is already wired to use Ollama through the configuration in [spring-petclinic-genai-service/src/main/resources/application.yml](spring-petclinic-genai-service/src/main/resources/application.yml):

```yaml
spring:
  ai:
    ollama:
      base-url: http://localhost:11434
      chat:
        options:
          model: llama3.2
```

### 4. Start the backend services

Start the supporting infrastructure first, then the GenAI service:

```bash
./mvnw spring-boot:run -pl spring-petclinic-config-server
./mvnw spring-boot:run -pl spring-petclinic-discovery-server
./mvnw spring-boot:run -pl spring-petclinic-api-gateway
./mvnw spring-boot:run -pl spring-petclinic-genai-service
```

### 5. Verify the integration

Send a sample request through the API gateway:

```bash
curl -X POST http://localhost:8080/api/genai/chatclient \
  -H "Content-Type: application/json" \
  -d '"List all the owners"'
```

If the service is running correctly, the response should be a natural-language answer generated by the local LLM. The local Ollama approach is ideal for development and demos because it is low-cost, private, and easy to run on a laptop.

---

## Project Structure

```
spring-petclinic-microservices/
├── spring-petclinic-config-server/
├── spring-petclinic-discovery-server/
├── spring-petclinic-api-gateway/
├── spring-petclinic-customers-service/
├── spring-petclinic-visits-service/
├── spring-petclinic-vets-service/
├── spring-petclinic-treatment-service/
├── spring-petclinic-invoice-service/
├── spring-petclinic-report-service/
├── spring-petclinic-genai-service/
└── petclinic-mobile/
    └── src/
        ├── screens/
        ├── components/
        ├── navigation/
        └── services/
```

---

## Engineering Notes

- All inter-service ports are pinned via JVM arguments to ensure deterministic startup, overriding the centrally distributed configuration's default of ephemeral port allocation.
- Bidirectional JPA entity relationships in the Invoice Service are serialization-guarded via `@JsonIgnore` on the owning side to prevent circular reference failures during REST response marshalling.
- The Visits Service exposes an unscoped `GET /visits` endpoint specifically to support the Report Service's cross-pet aggregation requirements, in addition to its existing per-pet endpoints.
- Database schemas for newly introduced services are explicitly defined via versioned `schema.sql` and `data.sql`, with `ddl-auto` set to `none` to ensure predictable, auditable table structures rather than relying on Hibernate auto-generation.

---

## License

This project extends the Apache 2.0–licensed Spring PetClinic sample application.
