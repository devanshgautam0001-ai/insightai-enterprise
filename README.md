<img width="1890" height="948" alt="Screenshot 2026-07-17 181335" src="https://github.com/user-attachments/assets/ed05c6e6-8195-427f-9a4d-e865a7185681" /><div align="center">

# 🚀 InsightAI Enterprise
### Enterprise AI Analytics & Machine Learning Platform

<p align="center">
An enterprise-grade AI-powered analytics platform built with React, Express, PostgreSQL, Firebase Authentication, and modern cloud architecture.
</p>

<p align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28?logo=firebase)
![Railway](https://img.shields.io/badge/Hosted%20on-Railway-0B0D0E?logo=railway)
![Status](https://img.shields.io/badge/Production-Ready-success)

</p>

---

## 🌍 Live Demo

**Production URL**

> https://insightai-enterprise-production.up.railway.app

---

 # InsightAI: Enterprise Intelligent Data Studio & RAG Copilot

InsightAI is a production-grade, enterprise-ready SaaS suite designed for advanced data engineering, machine learning workflows, and interactive visual intelligence. It integrates an **ETL pipeline engine**, **ML Studio**, **Visual Dashboard Builder**, and a **context-grounded Intelligent RAG Copilot** powered by the Gemini 3.5 Flash model. 

Designed for high scalability, secure collaborative access, and reliable cloud deployments, InsightAI compiles natively to modern cloud container infrastructures and is immediately ready for deployment.

---

## 🏛️ System Architecture

The following diagram illustrates the decoupled, secure multi-container architecture of InsightAI:

```
                          ┌──────────────────────────┐
                          │    Client Web Browser    │
                          └─────────────┬────────────┘
                                        │ (HTTP / WebSocket)
                                        ▼
                          ┌──────────────────────────┐
                          │    Nginx Reverse Proxy   │ (Port 80 / 443)
                          └──────┬────────────┬──────┘
                                 │            │
             (Static Files / SPA)│            │(API Proxied Requests)
                                 ▼            ▼
             ┌───────────────────────┐    ┌───────────────────────┐
             │   Frontend Container  │    │   Backend Container   │ (Port 3000)
             │   (React 19 / Vite)   │    │  (Node / Express TS)  │
             └───────────────────────┘    └──────────┬────────────┘
                                                     │
                             ┌───────────────────────┼───────────────────────┐
                             │                       │                       │
                             ▼                       ▼                       ▼
                 ┌───────────────────────┐┌───────────────────────┐┌───────────────────────┐
                 │  PostgreSQL 16 DB     ││     Redis 7 Cache     ││   Google Gemini API   │
                 │  (Storage / Sessions) ││ (Rate Limit & Access) ││  (Grounded Analytics) │
                 └───────────────────────┘└───────────────────────┘└───────────────────────┘
```

---

## ✨ Core Platforms & Modules

1. **Intelligent RAG Copilot**: High-performance Express API grounding the Google Gemini 3.5 Flash model with active client dataset schemas, statistics, machine learning performance metrics, and transaction contexts.
2. **Dashboard Builder**: Visually customizable executive dashboard canvas. Supports dynamic layouts, widget templates (KPI counters, trend charts, tabular reports), snapshots versioning, and secure user sharing.
3. **ETL pipeline Engine**: Interactive pipeline builder for ingesting, transforming, and validating large CSV/JSON datasets with automated type inference.
4. **Machine Learning Studio**: Visual platform for training regression and classification algorithms, monitoring loss curves, inspecting confusion matrices, and exporting model weights.
5. **Role-Based Access Control (RBAC)**: Secure multi-tenant identity model supporting four granular access tiers: `Admin`, `Manager`, `Analyst`, and `Viewer`.

---

## 📂 Repository Folder Structure

```
.
├── .github/                       # GitHub Workflows & DevOps Templates
│   ├── ISSUE_TEMPLATE/            # Structuring bug reports and feature requests
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md   # Developer code review compliance rules
│   └── workflows/                 # Automated CI/CD pipelines
│       ├── ci.yml                 # Integrates code compilation and linting
│       └── cd.yml                 # Automates production Docker registry releases
├── assets/                        # Corporate assets, branding, and icons
├── src/                           # Frontend React Application Source
│   ├── components/                # Modular React design system components
│   │   ├── dashboardbuilder/      # Layout canvas and interactive widget tiles
│   │   ├── dataset/               # Explorers, statistics, and ETL components
│   │   ├── etl/                   # Visual pipelines and transform nodes
│   │   ├── layout/                # Responsive Shell, Sidebar, and Header
│   │   ├── ml/                    # Live training charts and prediction interfaces
│   │   └── ui/                    # Base UI Kit (Buttons, Badges, Modals, Inputs)
│   ├── hooks/                     # Custom React hooks managing states
│   ├── layouts/                   # Global full-page layouts (AppLayout)
│   ├── pages/                     # Routed page-level screen components
│   ├── router/                    # Single Page Application navigation tree
│   ├── services/                  # Business services wrapping local & API requests
│   ├── store/                     # Global state engines (Zustand)
│   ├── types/                     # Shared TypeScript interfaces & declarations
│   ├── utils/                     # Safe math, encryption, and date utilities
│   ├── App.tsx                    # Main React Application entry router
│   ├── index.css                  # Tailwinds CSS 4.0 stylesheet
│   └── main.tsx                   # Browser DOM mountpoint
├── .env.example                   # Baseline structure for system environment configurations
├── .env.development               # Config defaults tailored for local dev/testing
├── .env.production                # Config defaults tailored for hardened cloud staging
├── Dockerfile.frontend            # Docker build stage optimized for Nginx SPA delivery
├── Dockerfile.backend             # Docker build stage optimized for esbuild Node JS server
├── docker-compose.yml             # Local Multi-Container Deployment Orchestrator
├── nginx.conf                     # Production-hardened HTTP/Gzip and Proxy configuration
├── package.json                   # Project lifecycle scripts and dependency manifests
├── server.ts                      # Express API Gateway and Vite development server
└── tsconfig.json                  # Strict TypeScript compiler definitions
```

---

## 🚀 Local Installation & Execution

### Prerequisites
- **Node.js**: `v20.x` or higher
- **NPM**: `v10.x` or higher
- **Docker & Docker-Compose** (Optional, for localized container testing)

### Step 1: Install Dependencies
Clone this repository to your system, enter the root directory, and run:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` into a new file named `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your **`GEMINI_API_KEY`**. You can also configure PostgreSQL and Redis credentials here.

### Step 3: Run in Development Mode
To boot up the Express server coupled with the hot-reloading Vite dev server, run:
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**.

---

## 🐳 Docker Multi-Container Orchestration

To run the complete production-mimicking environment locally using Docker (Frontend, Backend, PostgreSQL, Redis), use `docker-compose`:

```bash
# 1. Spin up the cluster in background mode
docker-compose up -d --build

# 2. Check current status of the services
docker-compose ps

# 3. View live application stream logs
docker-compose logs -f
```

The services will bind as follows:
- **Frontend App (Nginx Router):** `http://localhost:80`
- **Backend API Gateway:** `http://localhost:3000`
- **PostgreSQL Database:** `localhost:5432`
- **Redis Cache:** `localhost:6379`

---

## 🌐 Enterprise Production Deployments

### 1. Frontend SPA (Vercel)
The client-side React SPA can be deployed directly to Vercel:
1. Connect your repository to Vercel.
2. Select **Vite** as the framework preset.
3. Configure **Build Command:** `npm run build`
4. Configure **Output Directory:** `dist`
5. Click **Deploy**. Vercel will automatically generate high-performance CDN edge distributions.

### 2. Backend Engine (Render / Railway)
The compiled Node.js backend can run on any container-compatible cloud layer (Render, Railway, or AWS ECS/Fargate):
- **Build Command:** `npm run build`
- **Start Command:** `npm run start` (Starts compiled JS in `dist/server.cjs`)
- **Environment Variables:** Provide production database, Redis connection strings, and the `GEMINI_API_KEY` securely via the hosting dashboard.

---

## 🔒 Security & Performance Configurations

InsightAI is pre-configured with industry-standard production guardrails:
- **AES-256-GCM Encryption**: Used to encrypt sensitive custom datasets and user database credentials before writing to persistent database pools.
- **Strict CORS & Helmet Configs**: Sanitizes incoming request headers, intercepts malicious frame injections, and stops Clickjacking/MIME-sniffing.
- **Robust API Rate Limiter**: Limits requests to 100 per 15 minutes per IP address to safeguard system endpoints from brute-force scripts or DDoS campaigns.
- **Nginx Gzip Compression**: Compress asset packages on-the-fly, shaving up to 70% off initial Javascript/CSS page load latencies.

---

## 📡 API Gateway Reference

### 1. AI Copilot Grounded Query
Analyzes active dataset metadata, machine learning performance states, and general analytics queries.

- **Endpoint:** `POST /api/copilot`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "messages": [
      { "role": "user", "content": "How do I optimize the classification accuracy of this Random Forest model?" }
    ],
    "datasetName": "Customer Churn Q3",
    "currentMetrics": {
      "accuracy": 0.89,
      "precision": 0.87,
      "recall": 0.84,
      "f1Score": 0.85
    }
  }
  ```
- **Response Structure:**
  ```json
  {
    "text": "Based on your classification metrics (Accuracy: 89%, F1-Score: 85%), your recall (84%) represents the main area of improvement. To optimize this, you should..."
  }
  ```

### 2. Monitoring Health-Check
Validates live cluster integrity (Express application state, database connection, Redis pool status).

- **Endpoint:** `GET /api/health`
- **Response Structure:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-07-14T16:22:15.000Z",
    "uptime": "259200s",
    "services": {
      "database": "connected",
      "redis": "connected",
      "gemini_api": "active"
    }
  }
  ```
<img width="1917" height="911" alt="Screenshot 2026-07-17 180542" src="https://github.com/user-attachments/assets/1d9a623e-c81b-48d3-892e-5db12833dfc3" />
<img width="1918" height="897" alt="Screenshot 2026-07-17 180552" src="https://github.com/user-attachments/assets/e6723253-415c-4721-8e97-810ae6af70f2" />
<img width="1917" height="895" alt="Screenshot 2026-07-17 180601" src="https://github.com/user-attachments/assets/1eb4f713-412b-41b4-9aa2-1d98cde3db57" />
<img width="1918" height="890" alt="Screenshot 2026-07-17 180609" src="https://github.com/user-attachments/assets/9229cbc3-0882-4142-96e5-9b3e3718a8aa" />
<img width="1917" height="893" alt="Screenshot 2026-07-17 180625" src="https://github.com/user-attachments/assets/d213140d-fe1f-4bb6-b0f5-2086f23c68ec" />
🚀 Want to try InsightAI Enterprise?

The platform is protected with role-based access control (RBAC). For security reasons, new accounts don't receive access automatically. Every user must be approved by the administrator before they can use enterprise features.

If you'd like to explore the platform, feel free to send me a DM. I'll review your request and grant the appropriate access so you can test the application.

🔐 Secure access • Admin approval required • Enterprise role management
DM ME AT:devanshgautam0001@gmail.com






