# InsightAI Enterprise — Software Architecture Document
**System Architecture Specification**  
*Document Version:* 1.0.0  
*Classification:* Commercial Confidential  
*Author:* Principal Enterprise Architect & Senior ML Engineer  

---

## 1. Project Vision

### 1.1 Problem Statement
Modern enterprises are drowning in data but starving for actionable intelligence. While organizations have invested millions in data warehouses (Snowflake, BigQuery) and traditional Business Intelligence (BI) platforms (Power BI, Tableau), a critical friction point remains: **the gap between raw data ingestion, machine learning execution, and business decision-making.**

Traditional workflows are highly fragmented:
1. **Data Engineers** use Airflow and dbt to build pipelines.
2. **Data Scientists** use Jupyter Notebooks to clean data and train models.
3. **ML Engineers** build custom API wrappers to serve predictions.
4. **BI Analysts** build dashboards that show historical data but fail to project future states.
5. **Business Decision Makers** are left with static charts and no ability to ask "why" or "what if".

This fragmentation results in slow decision cycles, high operational costs, mismatched schemas, and AI models that remain locked in notebooks rather than driving enterprise value.

### 1.2 Target Users
*   **Chief Executive Officers (CEOs) & business leaders:** Need high-level executive summaries, macroeconomic projections, and intuitive natural-language interfaces to ask complex strategic questions.
*   **Chief Data Officers (CDOs) & Analytics Directors:** Require bird's-eye views of enterprise data quality, model performance, pipeline health, and regulatory compliance (GDPR/HIPAA).
*   **Data Scientists & ML Engineers:** Need automated pipelines to easily register, train, evaluate, deploy, and explain ML models without dealing with infrastructure.
*   **Data Analysts & Business Intelligence Leads:** Demand intuitive visual builders to join datasets, run automated EDA, and build beautiful interactive dashboards for business units.

### 1.3 Business Value
InsightAI Enterprise consolidates the entire data-to-decision pipeline into a unified, high-performance SaaS platform. It eliminates the 70% "data prep and glue code tax," accelerating time-to-insight from weeks to minutes.
*   **Reduced Total Cost of Ownership (TCO):** Consolidates five separate tool licenses (ETL + AutoML + BI + Chatbot + Report Gen) into a single unified workspace.
*   **Increased Revenue via Proactive Forecasting:** Shifts business strategy from reactive (what happened) to predictive (what will happen) and prescriptive (what should we do).
*   **Democratized Data Access:** Non-technical operators can query database warehouses and generate board-ready slide decks and PDF reports using secure natural language commands.

### 1.4 Unique Selling Points (USPs)
*   **Zero-Code End-to-End Execution:** Upload raw CSV/Parquet files and automatically clean them, build ETL pipelines, train ML models, generate interactive dashboards, and download PDF/PPT reports within one seamless visual workflow.
*   **Explainable AI (XAI) as a First-Class Citizen:** Every prediction, forecast, and insight includes deep interpretability layers (SHAP values, LIME explanations, Feature Importance charts, and natural-language narrative breakdowns).
*   **Server-Side Secure Gemini Grounding:** AI Copilot queries are strictly grounded in the enterprise's private data schemas and execution histories, ensuring zero hallucinations and enterprise-grade privacy boundaries.

### 1.5 Competitive Advantages
Compared to legacy players (Power BI, Tableau) and modern AI tools:
*   **Power BI / Tableau:** Excellent for descriptive analytics but require complex DAX/LOD calculations, lack native AutoML/XAI training suites, and do not feature integrated slides/PDF generation engines.
*   **AutoML Platforms (DataRobot, H2O.ai):** Powerful ML engines but highly complex, extremely expensive, and lacking in-app BI dashboard builders and natural-language executive report suites.
*   **InsightAI Enterprise Advantage:** Seamless integration of descriptive, predictive, and prescriptive analytics, packaged in an elite, high-fidelity Apple/Stripe-inspired interface.

### 1.6 Future Scope
*   **Real-time Streaming Ingestion:** Integration with Apache Kafka, Flink, and AWS Kinesis for sub-second streaming analytics and continuous model retraining.
*   **Multi-Agent Collaborative Workspaces:** Autonomous AI agents that collaborate to debug data pipelines, suggest high-performing model architectures, and run automated competitive intelligence market sweeps.
*   **Private LLM Deployment:** Deploying fine-tuned Llama-3 or Mistral models directly inside on-premises VPCs to guarantee 100% data residency compliance for sovereign government and military contracts.

---

## 2. Complete Tech Stack

To support a secure, highly responsive, and modular enterprise SaaS architecture, the following technologies are selected for maximum performance, maintainability, and scalability:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND                                      │
│   React 19 + TypeScript + Vite + Tailwind CSS 4 + Framer Motion + Lucide Icons  │
│             State: Zustand | Data Fetching: TanStack Query (v5)                 │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ HTTPS / WSS
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   BACKEND                                       │
│          Node.js Express Gateway (API Orchestration & Security Proxy)           │
│           Python FastAPI Microservices (Heavy Math, AutoML, XAI, ETL)           │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Internal RPC / DB Driver
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DATA PERSISTENCE & COMPUTE LAYER                        │
│   Primary SQL: Cloud SQL (PostgreSQL)  |  Enterprise Cache: Redis               │
│   NoSQL / Metadata: Firestore          |  Data Warehouse: Google BigQuery       │
│   Analytics Engine: DuckDB / PyArrow   |  Model Engine: PyTorch / Scikit-Learn  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Frontend
*   **React 19:** Leverages advanced server components, fine-grained hydration, and concurrent rendering for near-zero latency interaction.
*   **TypeScript (~5.8):** Provides compile-time safety and self-documenting data interfaces for complex ML telemetry, prediction structures, and ETL schemas.
*   **Vite 6:** Rapid building, hot bundling, and lightning-fast developer feedback cycles.
*   **Tailwind CSS 4:** Modern utility-first CSS engine with CSS variables native support and hardware-accelerated animations.
*   **Framer Motion:** High-fidelity micro-interactions, layout morphing, responsive sidebar collapses, and smooth multi-stage model pipeline animations.
*   **Lucide React:** Consistent, lightweight, accessible vector icons.
*   **Recharts & D3.js:** Recharts for ultra-clean React-rendered standard charts (Line, Bar, Area); D3.js for custom mathematical plots (Sankey, SHAP force layouts, ROC Curves, and interactive Network Graphs).
*   **Zustand:** Ultra-lightweight, decoupled, centralized state management to coordinate workspace state, current project, active visual configurations, and session flags.
*   **TanStack Query (v5):** Declarative, high-performance caching, polling mechanisms for long-running ETL processes, and automatic background data synchronization.

### 2.2 Backend
*   **Node.js Express (API Gateway):** Serves as the primary secure gateway, managing authentication, rate limiting, logging, and proxying requests to the heavy python services.
*   **FastAPI (Python Compute Engine):** Selected for its raw high performance, native asynchronous architecture, automated OpenAPI specification generation, and seamless integration with the scientific Python ecosystem (Pandas, NumPy, Scikit-Learn, PyTorch).

### 2.3 Machine Learning & Explainable AI (XAI)
*   **Scikit-Learn:** Core library for classic predictive algorithms (Random Forests, Gradient Boosting, XGBoost, LightGBM).
*   **Prophet / NeuralProphet:** Used for enterprise-grade additive time-series forecasting, accommodating seasonality, holidays, and growth constraints.
*   **SHAP (SHapley Additive exPlanations):** Deep game-theoretic approach to compute exact feature attribution values to make every black-box model output completely explainable.
*   **LIME (Local Interpretable Model-agnostic Explanations):** Used for localized model-behavior approximations.

### 2.4 Database & Cache
*   **Cloud SQL (PostgreSQL):** Robust relational storage for ACID transactional data (Users, Subscriptions, Project Metadata, Pipelines, Model Registry).
*   **Google Cloud Firestore:** Scalable Document NoSQL for flexible JSON storage (Workspace layouts, custom dashboard JSONs, activity streams, real-time collaboration logs).
*   **Redis:** In-memory caching layer to store session tokens, rate-limiting counters, and pre-computed heavy query results to minimize DB bottlenecks.

### 2.5 Cloud & Infrastructure
*   **Google Cloud Run (Serverless Containers):** Scale-to-zero compute platform housing the Express gateway and FastAPI compute containers, running within private VPC networks.
*   **Docker:** Containerizes every dependency, environment configuration, and library version to guarantee perfect dev-to-prod parity.
*   **Google BigQuery:** Leveraged as the underlying enterprise analytics query engine for large-scale customer datasets.

---

## 3. Complete Folder Structure

To support extreme scale, clear separation of concerns, and clean architectural division, we adopt a mono-repo inspired enterprise directories layout:

```
insightai-enterprise/
├── .env.example                     # Environment template configuration
├── .gitignore                       # System and artifacts exclusion patterns
├── Dockerfile.gateway               # Containerization script for API Gateway
├── Dockerfile.ml                    # Containerization script for Python ML service
├── docker-compose.yml               # Multi-container local orchestration
├── tsconfig.json                    # Base TypeScript compiler preferences
├── vite.config.ts                   # Bundler configuration with alias mappings
├── package.json                     # Root workspace configurations
├── metadata.json                    # Application capabilities and profile metadata
│
├── api-gateway/                      # [BACKEND Node.js Gateway]
│   ├── src/
│   │   ├── config/                  # Server-specific variables, keys, and DB connections
│   │   ├── middleware/              # JWT, Rate Limiting, Role validation, Logger, CORS
│   │   ├── routes/                  # Express controllers (auth, dataset, reports, proxy)
│   │   ├── services/                # Firebase integrations, PostgreSQL connection managers
│   │   └── server.ts                # Main server entry point
│   └── tests/                       # API integration and security tests
│
├── ml-service/                      # [BACKEND Python ML Service]
│   ├── app/
│   │   ├── config.py                # Hyperparameters, paths, and GCS configurations
│   │   ├── pipelines/               # Custom ETL, Imputation, Scaling, Encoding steps
│   │   ├── models/                  # Custom Scikit-Learn & PyTorch train/eval algorithms
│   │   ├── xai/                     # SHAP force plots, Decision trees, LIME compute engines
│   │   ├── routes/                  # FastAPI endpoints (train, predict, forecast, eda)
│   │   └── main.py                  # FastAPI main application
│   ├── requirements.txt             # Locked Python environment dependencies
│   └── tests/                       # Unit tests for ML models and ETL functions
│
├── src/                             # [FRONTEND React + TypeScript App]
│   ├── main.tsx                     # React application launcher
│   ├── index.css                    # Tailwind CSS 4 global variables and glassmorphism
│   ├── App.tsx                      # Primary route switcher and workspace provider
│   ├── types.ts                     # Strict TypeScript interfaces, enums, & schemas
│   │
│   ├── components/                  # [REUSABLE COMPONENT LIBRARY]
│   │   ├── ui/                      # Base Apple-inspired primitives
│   │   │   ├── Button.tsx           # Glassmorphic responsive buttons
│   │   │   ├── Input.tsx            # Floating-label validation inputs
│   │   │   ├── Select.tsx           # Custom dropdown selector with filtering
│   │   │   ├── Table.tsx            # Paginated virtualized table with column sort
│   │   │   ├── Card.tsx             # Interactive card with border gradients
│   │   │   ├── Badge.tsx            # Styled status indicators
│   │   │   ├── Modal.tsx            # Framer-motion backdrop and scaling layouts
│   │   │   └── Tooltip.tsx          # Micro-animation informational popovers
│   │   ├── charts/                  # Custom visual graphics primitives
│   │   │   ├── LineChartCard.tsx    # Responsive animated time-series
│   │   │   ├── DistributionCard.tsx # Histograms with density estimation curves
│   │   │   ├── ShapForceCard.tsx    # Interactive D3 game-theory explanation
│   │   │   └── PipelineGraph.tsx    # Visual SVG Nodes representing ETL steps
│   │   └── layout/                  # Navigation scaffolding
│   │       ├── Sidebar.tsx          # Collapsible responsive workspaces navigator
│   │       ├── TopNavbar.tsx        # Search, Copilot button, Profile menu
│   │       └── WorkspaceWrapper.tsx # Route transitions and global breadcrumbs
│   │
│   ├── pages/                       # [SCREEN ARCHITECTURES]
│   │   ├── landing/                 # Product Landing Page with interactive metrics
│   │   ├── auth/                    # Login, Signup, OTP, ForgotPassword
│   │   ├── dashboard/               # Core Executive Business Cockpit
│   │   ├── datasets/                # File Ingestion, Preview, ETL Builder, EDA Panel
│   │   ├── modeling/                # AutoML Settings, Model Health, XAI SHAP Analytics
│   │   ├── forecasting/             # Time-Series NeuralProphet Playground
│   │   ├── copilot/                 # Gemini grounded RAG Analytics Chat
│   │   ├── reports/                 # PDF & PPT template dynamic compiler
│   │   └── admin/                   # Usage analytics, Audit logs, RBAC panel
│   │
│   ├── store/                       # [ZUSTAND CENTRAL STATE STORES]
│   │   ├── useWorkspaceStore.ts     # Active project, workspace variables, and layouts
│   │   ├── useDataStore.ts          # Active dataset schemas, filters, and previews
│   │   └── useUIStore.ts            # Sidebar status, theme flags, active copilot view
│   │
│   └── hooks/                       # [CUSTOM HOOKS & TANSTACK QUERIES]
│       ├── useAuth.ts               # Signin/Signup hook and token sync
│       ├── useDataPipeline.ts       # Trigger and track ETL progress
│       └── useModelRunner.ts        # Trigger model training, check metrics, pull XAI
│
└── docs/                            # [SYSTEM DOCUMENTATION]
    ├── api-spec.yaml                # OpenAPI Swagger specification
    ├── architecture.png             # Visual infrastructure system design diagram
    └── user-manual.md               # Operator and analyst instruction manual
```

---

## 4. Database Design

To ensure enterprise consistency, we utilize an optimized, strongly typed database schema.

### 4.1 Schema Definition

```
                        ┌──────────────┐
                        │    USERS     │
                        └──────┬───────┘
                               │ 1
                               │
                               │ 1..N
                        ┌──────▼───────┐
                        │   PROJECTS   │
                        └──────┬───────┘
                               │ 1
                               ├───────────────────────┐
                               │ 1..N                  │ 1..N
                        ┌──────▼───────┐        ┌──────▼───────┐
                        │   DATASETS   │        │  DASHBOARDS  │
                        └──────┬───────┘        └──────────────┘
                               │ 1
                               │
                               │ 1..N
                        ┌──────▼───────┐
                        │  PIPELINES   │
                        └──────┬───────┘
                               │ 1
                               │
                               │ 1..N
                        ┌──────▼───────┐
                        │    MODELS    │
                        └──────┬───────┘
                               │ 1
                               ├───────────────────────┐
                               │ 1..N                  │ 1..N
                        ┌──────▼───────┐        ┌──────▼───────┐
                        │ PREDICTIONS  │        │   REPORTS    │
                        └──────────────┘        └──────────────┘
```

#### Users
Stores corporate credentials, administrative statuses, and subscription tiers.
*   `id` (UUID): Primary Key, Unique, default gen_random_uuid()
*   `email` (VARCHAR 255): Unique, Not Null
*   `password_hash` (VARCHAR 255): Not Null
*   `first_name` (VARCHAR 100): Not Null
*   `last_name` (VARCHAR 100): Not Null
*   `role` (VARCHAR 50): Enum ('admin', 'data_scientist', 'analyst', 'viewer'), default 'viewer'
*   `workspace_id` (UUID): Nullable (used for enterprise organization clustering)
*   `created_at` (TIMESTAMP): default current_timestamp
*   `updated_at` (TIMESTAMP): default current_timestamp

#### Projects
Containers housing specific business cases (e.g., "Q3 Customer Churn Minimization").
*   `id` (UUID): Primary Key
*   `name` (VARCHAR 150): Not Null
*   `description` (TEXT): Nullable
*   `owner_id` (UUID): Foreign Key -> Users(id), On Delete Cascade
*   `created_at` (TIMESTAMP): default current_timestamp
*   `updated_at` (TIMESTAMP): default current_timestamp

#### Datasets
Metadata pointing to raw tables loaded into BigQuery or secure cloud buckets.
*   `id` (UUID): Primary Key
*   `project_id` (UUID): Foreign Key -> Projects(id), On Delete Cascade
*   `name` (VARCHAR 255): Not Null
*   `storage_uri` (VARCHAR 512): Not Null (path to GCS/S3 file)
*   `file_size_bytes` (BIGINT): Not Null
*   `row_count` (INTEGER): Not Null
*   `column_count` (INTEGER): Not Null
*   `schema_json` (JSONB): Not Null (data types: numerical, categorical, dates)
*   `created_at` (TIMESTAMP)

#### Pipelines
Transformative execution maps containing sequential cleaning and preparation commands.
*   `id` (UUID): Primary Key
*   `dataset_id` (UUID): Foreign Key -> Datasets(id)
*   `steps_json` (JSONB): Not Null (e.g., `[{"step": "impute", "column": "Age", "strategy": "median"}, ...]`
*   `status` (VARCHAR 50): Enum ('pending', 'running', 'completed', 'failed')
*   `execution_time_ms` (INTEGER): Nullable
*   `created_by` (UUID): Foreign Key -> Users(id)
*   `completed_at` (TIMESTAMP)

#### Models
Trained machine learning files registered within our system workspace.
*   `id` (UUID): Primary Key
*   `pipeline_id` (UUID): Foreign Key -> Pipelines(id)
*   `algorithm_name` (VARCHAR 100): Not Null (e.g., "XGBoost Classifier")
*   `target_variable` (VARCHAR 100): Not Null
*   `hyperparameters` (JSONB): Not Null
*   `metrics_json` (JSONB): Not Null (e.g., `{"accuracy": 0.942, "precision": 0.921, "f1_score": 0.931}`)
*   `model_binary_uri` (VARCHAR 512): Not Null (path to GCS artifact)
*   `status` (VARCHAR 50): Enum ('training', 'active', 'archived')
*   `created_at` (TIMESTAMP)

#### Predictions
Individual or batch execution logs of loaded models.
*   `id` (UUID): Primary Key
*   `model_id` (UUID): Foreign Key -> Models(id)
*   `input_data_json` (JSONB): Not Null (features fed to the model)
*   `output_data_json` (JSONB): Not Null (prediction classes, probability scores)
*   `shap_values_json` (JSONB): Nullable (pre-computed game-theory explainers)
*   `run_by` (UUID): Foreign Key -> Users(id)
*   `executed_at` (TIMESTAMP): default current_timestamp

#### Reports
Compiled PDF or PPT reports containing descriptive analytics and forecasting curves.
*   `id` (UUID): Primary Key
*   `project_id` (UUID): Foreign Key -> Projects(id)
*   `name` (VARCHAR 255): Not Null
*   `format` (VARCHAR 10): Enum ('pdf', 'pptx')
*   `download_uri` (VARCHAR 512): Not Null
*   `generated_by` (UUID): Foreign Key -> Users(id)
*   `created_at` (TIMESTAMP)

#### Notifications
Real-time messaging logs to update users about long-running model cycles or pipeline runs.
*   `id` (UUID): Primary Key
*   `user_id` (UUID): Foreign Key -> Users(id)
*   `title` (VARCHAR 150): Not Null
*   `message` (TEXT): Not Null
*   `type` (VARCHAR 50): Enum ('info', 'success', 'warning', 'error')
*   `is_read` (BOOLEAN): default false
*   `created_at` (TIMESTAMP)

#### Activity Logs
Immutable event trail for security compliance and audit readiness.
*   `id` (UUID): Primary Key
*   `user_id` (UUID): Foreign Key -> Users(id)
*   `action` (VARCHAR 255): Not Null (e.g., "USER_DELETED_DATASET")
*   `ip_address` (VARCHAR 45): Not Null
*   `user_agent` (TEXT): Not Null
*   `timestamp` (TIMESTAMP): default current_timestamp

#### Dashboards
Saved workspace visualizations and grid arrangements.
*   `id` (UUID): Primary Key
*   `project_id` (UUID): Foreign Key -> Projects(id)
*   `name` (VARCHAR 150): Not Null
*   `layout_json` (JSONB): Not Null (bento-grid tile coordinates and component selections)
*   `created_by` (UUID): Foreign Key -> Users(id)
*   `created_at` (TIMESTAMP)

---

## 5. Complete Features List

InsightAI Enterprise is structured around nine core functional modules that support end-to-end processing:

1.  **Authentication & Security Administration:** Secure corporate onboarding, multi-factor codes verification, profile resets, and robust permission management (Role Based Access Controls).
2.  **Dataset Upload & Ingestion Interface:** Native drag-and-drop file ingestion, streaming chunk loaders for 2GB+ datasets, automated CSV/Parquet encoding sniffer, data schema sniffer, missing values analyzer, and cloud directory explorer.
3.  **ETL Pipeline & Data Prep Builder:** Visual interactive steps sequence builder. Operators choose: Fill missing values (mean, median, mode, constant), convert types, encode categories (One-Hot, Label), scale inputs (MinMax, Standard), drop outliers, and build custom mathematical formulas.
4.  **Exploratory Data Analysis (EDA) Engine:** Instantly compute descriptive statistics (mean, variance, skewness, kurtosis), generate mutual correlation heatmaps, plot class distributions, run automated anomaly detection, and isolate target variable interactions.
5.  **Automated Machine Learning (AutoML) Studio:** Choose learning goals (Classification, Regression). Set target columns, test split percentages, model families (Random Forests, Gradient Boosting, XGBoost), hyperparameter configurations (Grid Search, Bayesian Optimization), and track active training cycles via real-time progress bars.
6.  **Explainable AI (XAI) Dashboard:** Open-box explainability displaying SHAP force plots, local dependency plots, global Feature Importance bars, and automatic natural-language interpretations explaining model behavior.
7.  **Time-Series Forecasting Center:** High-end forecasting suite designed for temporal files. Predict custom horizons (30, 90, 180 days), map seasonal trends (daily, weekly, yearly), isolate macroeconomic holiday influences, and analyze upper/lower prediction confidence bounds.
8.  **Conversational RAG Copilot:** High-context Gemini chat grounded securely in loaded datasets and model metadata. Analysts can type: *"Why did the churn rate spike for active users in Q2?"* or *"Analyze our forecasting model and suggest three ways to improve model precision."*
9.  **Automated Board Report Generator:** Dynamically export high-contrast PDF executive briefings and editable slide decks containing embedded interactive graphs, metrics, and narrative analytical assessments with single-click commands.

---

## 6. Application Flow

### 6.1 User Journey Map

```
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  ONBOARDING  │ ───> │ DATA SHAPING │ ───> │ AUTO-MODELING│
  │ Signup & OTP │      │ Upload & ETL │      │ Train & Eval │
  └──────────────┘      └──────────────┘      └──────┬───────┘
                                                     │
                                                     ▼
  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │ BUSINESS GEN │ <─── │ GROUNDED RAG │ <─── │ EXPLAINABILITY│
  │ Exports/PDFs │      │ Chat/Queries │      │ SHAP/LIME/XAI│
  └──────────────┘      └──────────────┘      └──────────────┘
```

1.  **Authentication:** Users land on the product page, register, complete verification, and enter their private enterprise dashboard.
2.  **Data Shaping:** Operators create a project, drag-and-drop raw business data, preview rows, configure cleansing pipelines, and run comprehensive statistical evaluations.
3.  **Auto-Modeling:** Data scientists select learning targets, click "Train," track real-time evaluations, select the highest-performing model, and save it to the workspace registry.
4.  **Explainability Analysis:** Analysts open the model profile, inspect global SHAP features, select a row to isolate individual attribution factors, and verify regulatory audit trails.
5.  **Grounded Chat:** Executives launch the RAG Copilot, ask complex contextual questions about model predictions, and receive grounded text analysis.
6.  **Business Generation:** Decision-makers configure custom bento dashboards, select visual modules, and export beautiful PDF board decks or PowerPoint slides.

---

## 7. UI Design System

Inspired by Apple's minimalist elegance, Stripe's visual rhythm, and Linear's precision, our dark theme UI is engineered to be modern, corporate, and immersive.

### 7.1 Visual Tokens
*   **Colors:** Deep Charcoal base (`#09090B`), Steel/Muted borders (`#27272A`), Emerald accents (`#10B981` for metrics/accuracy), Ocean Blue accents (`#0EA5E9` for AI Copilot features), and high-contrast Off-White text (`#FAFAFA`).
*   **Glassmorphism:** Sub-cards utilize backdrop filter blurs, translucent slate backgrounds, and fine `1px` high-contrast white borders (`bg-zinc-950/40 backdrop-blur-md border border-white/5`).
*   **Typography:** Primary sans-serif font family is "Inter" for interface, paired with "Space Grotesk" for large numerical display blocks, and "JetBrains Mono" for code, schemas, and metrics data.
*   **Grid System:** Bento-style modular grid with cohesive spacing (`gap-6`) and rounded corners (`rounded-xl` for sub-panels, `rounded-2xl` for main page frames).
*   **Animations:** Smooth custom transitions via Framer Motion. Smooth slide-overs for drawer panels, micro-bounces for button interactions, and staggered delay transitions for metric loaders.

---

## 8. Security Architecture

### 8.1 JWT Auth Lifecycle
*   High-entropy short-lived Access Tokens (15 min) stored in secure client memory, paired with long-lived Refresh Tokens (7 days) saved strictly in `httpOnly` secure, SameSite cookies.
*   Automatic token rotation on expiry, with automatic session revocation on multiple-device concurrent logins.

### 8.2 Encryption Standards
*   **In-Transit:** Mandatory HTTPS enforced by SSL/TLS 1.3 handshakes, with strictly pre-loaded HSTS headers.
*   **At-Rest:** Customer datasets and model weights are encrypted via AES-256 inside cloud buckets. Credentials and PII in database tables are salted and hashed using Bcrypt-2b.

### 8.3 Role Based Access Control (RBAC)
Granular user permissions mapped inside the API Gateway:
*   `Admin`: Full platform control, billing access, audit logs, and global user management.
*   `Data Scientist`: Can manage datasets, trigger pipelines, and train models.
*   `Analyst`: Can view datasets, evaluate trained models, configure dashboards, and run forecasts.
*   `Viewer`: Can inspect dashboards and export PDF/PPT report slide decks.

### 8.4 Rate Limiting & Validation
*   Standard API endpoints are restricted to 100 requests per minute using sliding-window Redis tracking. AI endpoints are limited to 15 requests per minute.
*   All input requests are strictly sanitized and validated using Zod schemas on the Gateway to block SQL Injections, XSS, and parameter pollution.

---

## 9. API Design

### 9.1 Authentication APIs
*   `POST /api/v1/auth/signup`: Registers a new corporate user.
*   `POST /api/v1/auth/login`: Validates credentials, issues JWT token and cookies.
*   `POST /api/v1/auth/refresh`: Rotates short-lived Access Tokens.
*   `POST /api/v1/auth/otp-verify`: Authenticates Multi-Factor session logins.

### 9.2 Dataset APIs
*   `POST /api/v1/datasets/upload`: Initiates chunked cloud upload.
*   `GET /api/v1/datasets/:id/preview`: Returns top 100 rows with statistical previews.
*   `POST /api/v1/datasets/:id/pipeline`: Stores ETL transformation rules.
*   `GET /api/v1/datasets/:id/eda`: Triggers heavy Pandas statistical profile summaries.

### 9.3 Prediction APIs
*   `POST /api/v1/models/train`: Initiates automated AutoML model cycles.
*   `GET /api/v1/models/:id/metrics`: Pulls classification/regression scoring tables.
*   `POST /api/v1/models/:id/predict`: Submits live feature arrays for prediction classes.
*   `GET /api/v1/models/:id/xai`: Retrieves computed global/local SHAP matrices.

### 9.4 Dashboard & Report APIs
*   `GET /api/v1/dashboards/:id`: Pulls bento tile layout arrays.
*   `POST /api/v1/reports/compile`: Submits layout coordinates for PDF/PPT compile queues.
*   `GET /api/v1/reports/:id/download`: Resolves secure pre-signed cloud links.

---

## 10. Development Roadmap

### 10.1 Phase Schedule
*   **Version 1 (Core Foundations) - *Est: 3 Weeks (Medium Complexity)*:** Fully interactive React dashboard prototype, functional drag-and-drop file upload, automated dataset profiles, basic charts suite, and modular UI skeleton.
*   **Version 2 (Advanced Engine) - *Est: 4 Weeks (High Complexity)*:** Direct connection with Python FastAPI compute engine, automated machine learning pipelines, SHAP explainability matrices integration, and Prophet forecasting engines.
*   **Version 3 (Copilot & Exports) - *Est: 3 Weeks (High Complexity)*:** Integration of grounded Gemini AI RAG queries, real-time workspace collaboration panels, and custom PDF/PPT slide template exporters.
*   **Enterprise Version (Scale & Admin) - *Est: 4 Weeks (High Complexity)*:** Implementation of relational database synchronization, full JWT session rotation security, detailed audit trails, corporate SSO/SAML setups, and custom VPC deployments.

---

## 11. Resume Impact

InsightAI Enterprise is a cornerstone full-stack project built to showcase outstanding system engineering competence:

### 11.1 Key Learnings & Skills Demonstrated
*   **Full-Stack Orchestration:** Showcases capability to tie high-fidelity React frontends together with secure Express gateways and high-compute Python microservices.
*   **Advanced Data Processing:** Demonstrates solid command over enterprise analytical workflows (Automated cleansing, statistical profiling, and machine learning model operations).
*   **Open-Box Machine Learning (XAI):** Proves mastery of mathematical model explainability frameworks (SHAP, LIME) over simple black-box configurations.
*   **Elite UI Engineering:** Exceeds standard dashboard templates to deliver a highly optimized design system styled with premium CSS transitions and clean layouts.

### 11.2 Key Interview Questions Addressed
1.  *"How did you design your API Gateway to proxy requests to your ML service without exposing internal ports?"*
2.  *"How did you manage and display the progress of long-running machine learning training routines inside a React UI?"*
3.  *"Explain how you computed and mapped mathematical SHAP force values to custom D3 charts."*
4.  *"How did you protect the Gemini API key from client-side bundle exposure while maintaining high-context chat grounding?"*

---
*End of Software Architecture Document.*
