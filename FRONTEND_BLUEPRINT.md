# InsightAI Enterprise — Complete Frontend Blueprint
**High-Fidelity Interface & UI/UX Design System Specification**  
*Document Version:* 1.0.0  
*Classification:* Commercial Confidential  
*Author:* Principal Product Designer & Lead Frontend Architect  

---

## 1. UI/UX Design System

Our frontend is styled using an elite **Apple-inspired glassmorphic dark theme**, designed to maximize visual rhythm, high contrast, and tactile responsiveness.

### 1.1 Styling Tokens

#### Typography
We pair clean sans-serif geometries with technical monospace data grids to establish clean typographic rhythms.
*   **Font Family:** Primary UI font is **Inter** (sans-serif) for high legibility; Display font for large numeric blocks is **Space Grotesk**; technical metrics, coordinates, schemas, and code blocks use **JetBrains Mono**.
*   **Font Sizes & Weights:**
    *   *Display (Numbers/KPIs):* `Space Grotesk`, `text-4xl` to `text-6xl`, font-bold, tracking-tight.
    *   *H1 (Page Headers):* `Inter`, `text-3xl`, font-semibold, tracking-tight, `#FAFAFA` (Off-white).
    *   *H2 (Sections):* `Inter`, `text-xl`, font-medium, `#F4F4F5` (Zine-100).
    *   *Body:* `Inter`, `text-sm`, font-normal, `#A1A1AA` (Zinc-400).
    *   *Code/Metrics:* `JetBrains Mono`, `text-xs`, font-normal, `#10B981` (Emerald/Green).

#### Spacing & Grid System
*   **Base Grid:** Consistent multiples of 4px (`gap-1` to `gap-12`). Standard bento gaps set to `gap-6` (24px).
*   **Grid Layouts:** 12-column responsive layout system that adapts smoothly from single-column lists on mobile (`grid-cols-1`) to bento clusters on high-resolution screens (`lg:grid-cols-3` or `xl:grid-cols-4`).

#### Border Radius & Shadow System
*   **Border Radius:**
    *   Inputs, Badges, Buttons: `rounded-lg` (8px).
    *   Cards, Table Wrappers: `rounded-xl` (12px).
    *   Main Content Frame, Modals, Drawer Sliders: `rounded-2xl` (16px).
*   **Shadows:** Multi-layered, soft, translucent ambient shadows:
    *   *SaaS Cards:* `shadow-[0_8px_30px_rgb(0,0,0,0.3)]` with thin ambient borders (`border-white/[0.04]`).
    *   *Floating Modals:* `shadow-[0_24px_50px_rgba(0,0,0,0.6)]` wrapped in dark-glass backdrops (`bg-zinc-950/80 backdrop-blur-xl border-white/[0.08]`).

#### Animation System (Framer Motion Configuration)
All visual updates use physical-spring dynamics rather than simple linear transitions.
*   **Hover Spring:** `type: "spring", stiffness: 300, damping: 20`
*   **Page Route Transition:** Fade-in, horizontal slide, layout morphing:
    ```json
    {
      "initial": { "opacity": 0, "y": 6 },
      "animate": { "opacity": 1, "y": 0 },
      "exit": { "opacity": 0, "y": -6 },
      "transition": { "duration": 0.2, "ease": "easeInOut" }
    }
    ```
*   **Drawer Slide-Over:** Spring horizontal translation:
    ```json
    {
      "initial": { "x": "100%" },
      "animate": { "x": 0 },
      "exit": { "x": "100%" },
      "transition": { "type": "spring", "damping": 25, "stiffness": 200 }
    }
    ```

#### Color Palette (Unified Dark Theme)
Our interface uses high-contrast blacks and grays, offset by vibrant accent keys.
*   **Canvas Background:** Deep Charcoal (`#09090B`)
*   **Surface Cards:** Muted Glass Zinc (`#09090B` at 40% opacity, backdrop blur 20px)
*   **Borders:** Steel Zinc (`#27272A`)
*   **Text Principal:** Off-White (`#FAFAFA`)
*   **Text Secondary:** Warm Zinc (`#A1A1AA`)
*   **Primary Active Accent:** Glacier White (`#FAFAFA` with subtle emerald outline)
*   **Success Metric Active:** Vivid Emerald (`#10B981`)
*   **Copilot/Intelligence Active:** Deep Ocean Blue (`#0EA5E9`)
*   **Warning Warning Flag:** Amber Sun (`#F59E0B`)
*   **Failure Error Signal:** Crimson Flare (`#EF4444`)

---

## 2. Global Scaffolding

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  TOP NAVBAR                                  │
│   [Workspace Switcher] > [Current Project]       [Search]  [Copilot] [Profile]│
├──────────────────────────────────────────────────────────────────────────────┤
│  █  │                                                                        │
│  █  │                              MAIN CONTENT                              │
│  █  │                                                                        │
│  █  │                         - Active Route Component -                     │
│  █  │                                                                        │
│  S  │                                                                        │
│  I  │                                                                        │
│  D  │                                                                        │
│  E  │                                                                        │
│  B  │                                                                        │
│  A  │                                                                        │
│  R  │                                                                        │
└─────┴────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Sidebar Panel (Collapsible Nav Frame)
*   **Workspace Switcher:** Top dropdown panel displaying company teams ("Design Science Team", "Enterprise Admin"). Clicking opens a translucent glass list of authorized workspaces.
*   **Search Box:** Embedded visual mock search with a shortcut label (`⌘K`). Launches the global Command Palette.
*   **Main Navigation Routes:**
    *   *Analytics:* Dashboard, Projects, Workspace.
    *   *Data Ops:* Dataset Upload, ETL Pipeline, Exploratory Analytics (EDA).
    *   *AI Modeling:* Model Registry, Time-Series Forecast, Grounded Chat, Business Insights.
    *   *System Control:* Generated Reports, Platform Settings, Admin Console.
*   **Collapsible Mechanism:** Responsive design. Click on the bottom trigger animates the sidebar from `w-64` to `w-18`. Icon labels slide left and fade to `opacity: 0`.

### 2.2 Top Navbar (Workspace Header)
*   **Breadcrumb Indicator:** Elegant path displaying `Workspace > Project Name > Page Title`.
*   **Global Actions Group:**
    *   **Notification Icon:** Shines a mini emerald dot (`animate-pulse`) when background model cycles complete.
    *   **AI Copilot Portal Toggle:** Interactive blue-tinted icon. Clicking shifts the active screen layout, sliding the RAG Copilot pane from the right side of the screen.
    *   **User Account Avatar:** Custom round profile image with active organization initials. Clicking expands a dropdown panel for Profile settings, Workspace tokens, and Logout.

---

## 3. Screen Architectures (24 Core Pages)

### 3.1 Product Landing Page
*   **Purpose:** SaaS promotional gateway illustrating capabilities.
*   **Layout:** Single-scroll fluid stack with standard modular grid.
*   **Sections:** Hero visual block, real-time feature overview, interactive pricing card slider.
*   **Animations:** Smooth SVG line tracing that illustrates data flowing from a database cylinder, through an AutoML icon, into a business chart.
*   **Empty State:** N/A (Marketing Page).

### 3.2 Login Page
*   **Purpose:** Gateway for registered enterprise operators.
*   **Layout:** Two-column split-screen. Left: High-resolution generative visualization of an intelligence network. Right: Centered glass form.
*   **Components:** Username textfield, obfuscated password textfield, login CTA, single-click corporate SSO (Okta, Azure AD) buttons.
*   **Animations:** Input fields show subtle white glow outlines on active focus states.

### 3.3 Signup Page
*   **Purpose:** Automated team onboarding.
*   **Layout:** Same split-column system as login, with an expanded form.
*   **Components:** Full Name, Corporate Email, Password (with interactive complexity progress bar), and Workspace Name inputs.
*   **Animations:** Password validator bars animate from amber to deep green as requirements are satisfied.

### 3.4 Forgot Password Page
*   **Purpose:** Self-service password recovery.
*   **Layout:** Minimalist single-card focus layout centered on canvas.
*   **Components:** Registered email input and recovery dispatch button.
*   **Animations:** Transition to a confirmation screen showing a flying checkmark icon once dispatch completes.

### 3.5 OTP MFA Page
*   **Purpose:** Multi-factor login confirmation.
*   **Layout:** Single-card focus layout centered on canvas.
*   **Components:** Six unified digit cells that auto-advance on entry.
*   **Animations:** Digits wiggle and flash red on verification failures.

### 3.6 Core Dashboard Page (Executive Cockpit)
*   **Purpose:** Central management cockpit displaying operational metrics.
*   **Layout:** Bento Grid with 3 top mini metrics cards, 2 large middle visualization grids, and 2 bottom tables.
*   **Components:** 
    *   *Metric Card 1:* Revenue ($4.2M, +12%).
    *   *Metric Card 2:* Data Quality Score (98.4%).
    *   *Metric Card 3:* Model Accuracy (94.2%).
    *   *Main Chart:* Multi-line prediction-vs-actual chart.
*   **Charts:** Mixed Line & Area overlay chart with custom hover tooltips showing data points.

### 3.7 Projects Grid
*   **Purpose:** Project workspace manager.
*   **Layout:** Responsive bento grid containing structured cards.
*   **Components:** Create Project card, and list of current active projects showing names, target metrics, team avatars, and a dynamic model health badge.
*   **Animations:** Staggered entrance cards slide upward sequentially on initialization.

### 3.8 Workspace Panel
*   **Purpose:** Custom team workspace and member manager.
*   **Layout:** Split-pane. Left: Active corporate members and access levels. Right: API keys manager and connection configurations.
*   **Components:** Invite team input, role dropdown selectors, and secure API client-secret blocks with show/hide triggers.

### 3.9 Dataset Upload
*   **Purpose:** Raw file ingestion portal.
*   **Layout:** Single full-page card layout.
*   **Components:** Large dashed drop zone with drag-and-drop triggers, supported type tags (.csv, .parquet, .json), and file browser triggers.
*   **Empty State:** Illustrated minimalist sheet icon with a circular pulsing blue outline.
*   **Loading State:** Live uploading progress tracking with a linear percent-loader.

### 3.10 Dataset Preview
*   **Purpose:** Ingested schema exploration.
*   **Layout:** Split layout. Top: Dataset dimensions (Size, Columns, Rows). Bottom: Interactive paginated data table.
*   **Components:** Schema columns mapping lists, missing values heat indicators, and sorting controls.

### 3.11 Data Cleaning Interface
*   **Purpose:** Data preparation and outlier cleanser.
*   **Layout:** Split-pane panel. Left: Action items list. Right: Real-time updated table preview showing cleaned columns.
*   **Components:** Outliers drop trigger, null values imputation strategies dropdown, and categorical mapping settings.

### 3.12 ETL Pipeline Builder
*   **Purpose:** Automated visual data pipeline flow.
*   **Layout:** Visual node canvas.
*   **Components:** Ingestion nodes, Transform nodes, and Output nodes.
*   **Animations:** Nodes connect via glowing vector lines that pulse to represent the active data stream.

### 3.13 EDA Panel
*   **Purpose:** Deep automated statistical profiling.
*   **Layout:** Bento layout displaying interactive chart widgets.
*   **Components:** Mutual Correlation Matrix Heatmap, data column distribution bars, and anomaly cluster scatter plots.
*   **Charts:** D3 interactive Heatmap where hovering over intersections reveals correlation coefficient formulas.

### 3.14 Machine Learning Hub
*   **Purpose:** Automated AutoML training cockpit.
*   **Layout:** Balanced split-pane. Left: Algorithm selections, cross-validation inputs, and target variables selector. Right: Training monitoring logs.
*   **Components:** Hyperparameter configuration cards and active training process monitor.
*   **Loading State:** Live code execution log output with auto-scrolling text lines.

### 3.15 Model Comparison Board
*   **Purpose:** Multi-model analytics leaderboard.
*   **Layout:** Multi-column board panel.
*   **Components:** Model Leaderboard ranking lists, comparative Confusion Matrix visual blocks, and ROC curve overlay lines.
*   **Charts:** Precision-Recall curves plotting multiple models side-by-side.

### 3.16 Model Predictions Engine
*   **Purpose:** Batch inference and interactive predictive analyzer.
*   **Layout:** Split-pane. Left: Row features manual inputs form. Right: Calculated predictions and confidence outputs.
*   **Components:** Numeric slider inputs, classification probabilities radial progress loops, and model SHAP value bars.

### 3.17 Time-Series Forecast Center
*   **Purpose:** Temporal trend projections playground.
*   **Layout:** Full-width display page.
*   **Components:** Forecast horizon inputs (days/weeks slider), seasonal adjustments, and baseline comparison toggles.
*   **Charts:** Area chart plotting upper/lower model confidence envelopes with prediction points.

### 3.18 Grounded AI Copilot (RAG Chat)
*   **Purpose:** Private data exploration chatbot.
*   **Layout:** Conversational split-view. Left: Data schema referencing blocks. Right: Instant message stream panel.
*   **Components:** Chat message bubbles, file reference tags, suggested query chips, and text-input area.
*   **Animations:** Glowing ocean blue border outlines pulse dynamically during response processing.

### 3.19 Business Insights Panel
*   **Purpose:** Automatic anomaly detector and insight list.
*   **Layout:** Vertical stream of insight alert tiles.
*   **Components:** Interactive insight banners featuring category tags (Anomaly, Trend, Risk), textual analysis blocks, and associated visual charts.

### 3.20 Dashboard Canvas Builder
*   **Purpose:** drag-and-drop BI layout designer.
*   **Layout:** Dashboard canvas with a bento grid system and right side widget explorer drawer.
*   **Components:** Interactive card coordinate handles, visualization picker dropdowns, and size controls.

### 3.21 Reports Compiler
*   **Purpose:** Corporate presentation and report generator.
*   **Layout:** Divided split-view. Left: PDF/PPT presentation sheet templates. Right: Dynamic settings compiler panels.
*   **Components:** Export format options buttons, scheduled automated run calendars, and download buttons.

### 3.22 Platform Settings
*   **Purpose:** App preference controller.
*   **Layout:** Structured side-tab layout.
*   **Components:** Dark Mode toggles, language menus, notifications switches, and webhook registers.

### 3.23 Admin Console
*   **Purpose:** System monitoring, billing, and server control panel.
*   **Layout:** Dashboard grid tracking enterprise infrastructure.
*   **Components:** API Rate trackers, billing forecast widgets, active compute resources, and logs tables.

### 3.24 Profile Page
*   **Purpose:** Personal operator account manager.
*   **Layout:** Clean single-card form panel.
*   **Components:** Avatar drop zone, name/email settings form, security MFA configurations, and password update forms.

---

## 4. Analytical Visualizations (Charts)

To support complete data explainability, we specify 18 specialized vector-graphic (SVG) mathematical plots.

```
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│        SHAP EXPLANABILITY PLOT        │   │        MUTUAL CORRELATION HEATMAP     │
│                                       │   │                                       │
│ Feature A  █████████████ (+)          │   │            Col A   Col B   Col C      │
│ Feature B  ███████ (+)                │   │    Col A  [1.00]  [0.82]  [0.12]      │
│ Feature C  ░░░░ (-)                   │   │    Col B  [0.82]  [1.00]  [-0.4]      │
│ Feature D  ░ (-)                      │   │    Col C  [0.12]  [-0.4]  [1.00]      │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
```

1.  **Prediction-vs-Actual Line Chart:** Double-line time-series plotting real numbers alongside historical predictions. Hovering over a timestamp isolates precise values.
2.  **Cumulative Revenue Area Chart:** Smooth area chart filled with a vertical green gradient showing growth curves.
3.  **Revenue Growth Bar Chart:** Distinct rounded bars showing monthly billing. Negative values display as crimson bars below a central baseline.
4.  **Anomaly Detection Scatter Plot:** Interactive scatter plot mapping rows by principal components. Outliers animate in glowing red, blinking periodically.
5.  **Mutual Correlation Heatmap:** Color-graded grid showing feature relationships. Colors scale from deep blue (-1) through charcoal (0) to vibrant emerald (+1).
6.  **Dataset Class Distribution:** Clean histogram with an overlay curve illustrating statistical density estimation.
7.  **Model Leaderboard Bar Chart:** Sorted horizontal comparison bars ranking algorithm accuracy, with confidence brackets.
8.  **ROC Area Curve:** Precise vector plot demonstrating true-positive and false-positive performance, displaying AUC values.
9.  **Model Confusion Matrix:** 2x2 grid representing True/False Positives/Negatives with interactive precision tooltips.
10. **Global Feature Importance:** Sorted bar list showing model weight structures.
11. **Local SHAP Force Chart:** Interactive game-theoretic visualizer showing positive forces pushing predictions higher (in emerald) and negative forces pulling them down (in crimson).
12. **SHAP Dependency Plot:** Scatter chart showing feature values against SHAP impacts to reveal non-linear patterns.
13. **Forecasting Confidence Envelope:** Time-series projecting past values, wrapped in a translucent blue confidence area.
14. **Decision Tree Visualizer:** Interactive tree node structure showing model decision splits.
15. **Dataset Sankey Diagram:** Directional flow mapping data moving from original sources to output categorizations.
16. **Macroeconomic Holiday Impacter:** Segmented bar chart showing holiday impacts on business seasonality.
17. **Model Training Validation Line:** Dual lines tracking training and validation losses over training epochs.
18. **Interactive Network Graph:** Nodes representing dataset entity relationships, responsive to drag interactions.

---

## 5. Enterprise Component Library

Every frontend element is built as a highly reusable, accessible, and self-contained TypeScript component.

### 5.1 Primitives Specifications

*   **`Button`:**
    *   *Props:* `variant` ('primary' | 'secondary' | 'glass' | 'danger'), `size` ('sm' | 'md' | 'lg'), `isLoading`, `iconLeft`, `iconRight`.
    *   *Design:* Glass variant uses `bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] transition-all`. Primary uses rich metallic white backgrounds with crisp black text.
*   **`Input`:**
    *   *Props:* `type`, `label`, `error`, `iconLeft`, `iconRight`, `helperText`.
    *   *Design:* Translucent inputs with floating labels that scale down on active focus. Border transitions from `border-zinc-800` to `border-zinc-400`.
*   **`Select` (Filtered Dropdown):**
    *   *Props:* `options` (Array), `value`, `onChange`, `searchable`, `placeholder`.
    *   *Design:* Sliding list container with a search box inside, supporting infinite-scroll listings.
*   **`Table` (Paginated Virtualized):**
    *   *Props:* `columns` (Array), `data` (Array), `onSort`, `paginated`, `selectedRows`.
    *   *Design:* Row selections trigger a floating footer containing batch actions. Left columns lock into place on horizontal scroll.
*   **`ChartCard`:**
    *   *Props:* `title`, `description`, `metric`, `trend`, `isLoading`, `children`.
    *   *Design:* Modular card housing visualizations, with action triggers for fullscreen expand, dataset download, and PNG export.
*   **`Modal`:**
    *   *Props:* `isOpen`, `onClose`, `title`, `size` ('md' | 'lg' | 'xl' | 'fullscreen'), `children`.
    *   *Design:* Renders inside a React Portal with a blurring backdrop (`backdrop-blur-md bg-black/60`). Spring-based entry scale animation.
*   **`Toast`:**
    *   *Props:* `title`, `description`, `type` ('success' | 'info' | 'warning' | 'error'), `duration`.
    *   *Design:* Stacks elegantly in the lower-right corner of the viewport, with a closing timer progress indicator line.

---

## 6. Frontend Blueprint Component Hierarchy

The diagram below outlines the react tree flow of InsightAI Enterprise:

```
                            [App.tsx]
                                │
                     [WorkspaceStoreProvider]
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
              [Public Routes]       [Private Routes]
                     │                     │
              [Landing/Auth Pages]  [WorkspaceWrapper] (Route Animations)
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
                  [Sidebar Panel]                        [Top Navbar]
                        │                                     │
           ┌────────────┴────────────┐             ┌──────────┴──────────┐
           ▼                         ▼             ▼                     ▼
     [WorkspaceSelector]      [RoutesListing]  [GlobalSearch]    [ProfileDropdown]
                                                   │
                                           [CommandPalette]
                                                   │
                                         ┌─────────┴─────────┐
                                         ▼                   ▼
                                  [Active Screen]    [AI Copilot Drawer]
                                         │                   │
                                   [Bento Grid]      [ChatInput / Logs]
                                         │
                        ┌────────────────┴────────────────┐
                        ▼                                 ▼
                  [Metric Cards]                    [Chart Cards]
                        │                                 │
                 [Trend Indicators]                 [SVG Visualizations]
```

---
*End of Complete Frontend Blueprint.*
