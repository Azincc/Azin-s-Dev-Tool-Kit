# Feature Roadmap: Developer Tools Expansion

## 1. Overview
This document outlines the strategic roadmap for adding new utilities to Azin's Dev Toolkit. The goal is to evolve the platform from a simple formatter collection into a comprehensive developer companion.

## 2. Prioritization Methodology
Features are prioritized based on an **Impact vs. Effort** matrix:
*   **High Impact**: Solves frequent, daily developer pain points or high-friction tasks.
*   **Low Effort**: Can be implemented primarily on the frontend with existing libraries; no complex backend state required.

The roadmap is divided into three phases:
*   **Phase 1: Data Transformation (Quick Wins)** - High leverage of existing patterns.
*   **Phase 2: Network & Connectivity (External Interactions)** - Moderate complexity, external API dependencies.
*   **Phase 3: Deep Logic & State (Advanced Tools)** - Complex state management, backend requirements, or heavy logic.

## 3. Stacked Ranking & Phasing

| Rank | Feature | Phase | Impact | Effort | Rationale |
|------|---------|-------|--------|--------|-----------|
| 1 | **JSON/XML/YAML Converter** | 1 | High | Low | Extends existing JSON tools. High daily usage frequency. |
| 2 | **CSV/Excel Processor** | 1 | Med | Med | Strong data utility. Client-side libraries available. |
| 3 | **IP/Domain Lookup** | 2 | Med | Med | Useful for debugging. Requires external APIs (CORS handling). |
| 4 | **Code Snippet Manager** | 2 | Med | Med | "Sticky" feature. Starts with LocalStorage, needs sync later. |
| 5 | **SQL Assistant** | 3 | High | High | Complex parsing/formatting logic. Potential AI integration. |
| 6 | **API Mock Server** | 3 | High | High | Complex UI for defining schemas. Service Worker intercept. |
| 7 | **Short Link Generator** | 3 | Low | High | Hard dependency on backend database/worker for redirection. |

---

## 4. Feature Details

### 1. JSON/XML/YAML Converter (Enhanced)
**Scope**: Upgrade the existing `JsonTools` to support bi-directional conversion between JSON, XML, and YAML. Add file upload/download support.
**Target Users**: Backend developers dealing with config files (k8s, CI/CD) and API payloads.
**Success Metrics**: 
*   Time to convert format < 100ms.
*   Zero parsing errors for valid standard inputs.
**Dependencies**: `js-yaml`, `fast-xml-parser`.
**Repo Touchpoints**:
*   `pages/JsonToolkit.tsx`: Refactor `JsonTools` or split into `ConverterTools`.
*   `App.tsx`: Rename/Expand `/json` route or add `/converters`.
*   `locales/**`: Update `tools.ts` with new format labels.

### 2. CSV/Excel Processor
**Scope**: A spreadsheet-like view for CSV/Excel files. Features: View, Sort, Filter, Convert to JSON/SQL, Export.
**Target Users**: Data analysts, Developers seeding databases.
**Success Metrics**: 
*   Can handle 10MB+ files without browser freeze.
*   Accurate export to JSON/SQL INSERT statements.
**Dependencies**: `papaparse` (CSV), `xlsx` (Excel).
**Repo Touchpoints**:
*   `pages/DataTools.tsx`: New component.
*   `App.tsx`: New route `/csv-tools`.
*   `Sidebar`: New entry under "Formatters" or new group "Data".
*   `locales/**`: New translation section `tool.csv`.

### 3. IP/Domain Lookup
**Scope**: Tool to check current IP, perform DNS lookups (A, CNAME, MX), and Whois info.
**Target Users**: DevOps, Network Engineers.
**Success Metrics**: 
*   Accurate detection of user IP (IPv4/IPv6).
*   Fast resolution of DNS records.
**Dependencies**: 
*   **Risk**: CORS issues with browser-based DNS/Whois. May require a proxy function (Worker Backend).
*   External APIs (e.g., Cloudflare DoH, RDAP).
**Repo Touchpoints**:
*   `pages/NetworkTools.tsx`: New component.
*   `App.tsx`: New route `/network`.
*   `Sidebar`: New group "Network".

### 4. Code Snippet Manager
**Scope**: A library to save, categorize, and search frequent code snippets.
**Target Users**: All developers.
**Success Metrics**: 
*   Fast search/retrieval.
*   Persistence across reloads (LocalStorage).
**Dependencies**: 
*   LocalStorage / IndexedDB.
*   Future: Cloud Sync (requires Auth & Backend).
**Repo Touchpoints**:
*   `pages/SnippetTools.tsx`: New component.
*   `App.tsx`: New route `/snippets`.
*   `components/ui/Shared.tsx`: Enhanced Modal/Form components.

### 5. SQL Assistant
**Scope**: Advanced SQL formatter, query builder helper, and schema visualizer (DDL -> ER Diagram).
**Target Users**: Backend Developers, DBAs.
**Success Metrics**: 
*   Correct formatting of complex nested queries.
*   Visualizer renders readable diagrams for <50 tables.
**Dependencies**: `sql-formatter` (upgrade), Diagramming lib (e.g., `mermaid` or `reactflow`).
**Repo Touchpoints**:
*   `pages/SqlTools.tsx`: New component (move out of `CodeTools`).
*   `App.tsx`: New route `/sql`.

### 6. API Mock Server
**Scope**: Define API endpoints (method, path, status, response body) and intercept browser network requests to return mocks.
**Target Users**: Frontend developers prototyping without backend.
**Success Metrics**: 
*   Intercepts `fetch` and `XHR` reliably.
*   Intuitive UI for defining rules.
**Dependencies**: Service Worker, `msw` (Mock Service Worker) library.
**Repo Touchpoints**:
*   `src/mocks`: New directory for worker logic.
*   `pages/MockServer.tsx`: UI configuration.
*   `App.tsx`: Service Worker registration logic.

### 7. Short Link Generator
**Scope**: Input a long URL, get a short URL. Manage/delete active links.
**Target Users**: Sharing internal resources, debugging deep links.
**Success Metrics**: 
*   Link redirects successfully.
*   Analytics (click count) tracking.
**Dependencies**: 
*   **Critical**: Backend DB (Key-Value store like KV or Redis) and Compute (Lambda/Worker) to handle redirects.
*   Cannot be purely client-side.
**Repo Touchpoints**:
*   `pages/LinkTools.tsx`: UI for creation/management.
*   `backend/`: (New) Serverless functions for redirection logic.

---

## 5. Execution Plan & Staffing

### Milestones
1.  **M1: The Converter Suite (Weeks 1-2)**
    *   Deliverables: Enhanced JSON/YAML converter, CSV Processor.
    *   Staffing: 1 Frontend Engineer.
    *   Testing: Unit tests for conversion logic.

2.  **M2: Network & Utilities (Weeks 3-4)**
    *   Deliverables: IP Lookup, Snippet Manager (Local).
    *   Staffing: 1 Frontend Engineer.
    *   Architecture: Establish "Worker Proxy" pattern for CORS requests (IP/DNS).

3.  **M3: Advanced Engineering (Month 2)**
    *   Deliverables: SQL Assistant, Mock Server.
    *   Staffing: 1 Senior Frontend Engineer (Complex UI & Service Workers).

4.  **M4: Backend Services (Month 3)**
    *   Deliverables: Short Link Generator, Snippet Sync.
    *   Staffing: 1 Fullstack Engineer (Backend focus).
    *   Infrastructure: Deploy backend/DB resources.

### Optimization Notes (from Architecture Report)
*   **Bundle Size**: New libraries (Excel, XML, YAML parsers) are heavy. Utilize **Code Splitting** (React `lazy` + `Suspense`) for all new routes to keep initial load time low.
*   **Worker Backend**: Develop a shared Cloudflare Worker / Lambda wrapper to handle backend tasks (DNS proxy, Short Link storage) to keep the client "serverless" but capable.
