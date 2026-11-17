# YoLearn.ai — Question Bank Management System

A production-ready, scalable, AI-powered Question Bank Management System designed as the central single source of truth for educational questions across the Indian ecosystem, including:
- **K-12 Schooling** (Classes 1–12, CBSE, ICSE, State Boards, NCERT)
- **Competitive Examinations** (JEE Main, JEE Advanced, NEET-UG, CUET, and others)

The system supports all question formats, complete academic taxonomy mapping, LaTeX math rendering via KaTeX, versioning, duplicate detection, bulk document ingestion (PDF, DOCX, XLSX, CSV), AI-assisted extraction & auto-tagging, and SME approval workflows.

---

## 1. System Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, KaTeX Math Engine.
- **Backend**: Next.js API Routes, TypeScript, RESTful endpoints.
- **Database & ORM**: PostgreSQL / SQLite via Prisma ORM with relational mapping and JSONB structures.
- **Search & Deduplication**: Text normalization, token Jaccard similarity, SHA-256 content hashing, and full-text search.
- **AI Engine**: Modular provider abstraction supporting Google Gemini API (`gemini-1.5-pro`, `gemini-1.5-flash`), OpenAI, or an intelligent local heuristic adapter (`mock_gemini`).

---

## 2. Core Modules Implemented

| Module | Route | Capabilities |
|---|---|---|
| **1. Central Dashboard** | `/` | 10 database-derived KPI cards, distribution charts by subject, exam, question type, and real-time recent activity streams. |
| **2. Question Repository** | `/questions` | Searchable & filterable table, multi-select filters, pagination, KaTeX previews, bulk actions (Approve, Reject, Archive, Export JSON). |
| **3. Question Creation & Rich Editor** | `/questions/create` | 10 distinct sections, dynamic editor for MCQ, MSQ, Numerical, Match the following, Assertion-Reason, Subjective rubrics, live student preview (Desktop/Mobile). |
| **4. Question Detail View** | `/questions/[id]` | Full specification, academic hierarchy, KaTeX math equations, version diff comparison, SME verification checklist, duplicate alerts. |
| **5. Academic Taxonomy** | `/taxonomy` | Configurable 8-level hierarchy: Segment → Board/Exam → Class → Subject → Chapter → Topic → Subtopic → Concept. Add/delete items without code changes. |
| **6. Bulk Upload & Extraction** | `/upload` | PDF OCR and Excel/CSV ingestion workflow, job status dashboard (Uploaded, Processing, Completed, Partially Failed), retry failed questions, downloadable CSV template. |
| **7. AI Question Generator** | `/ai-generator` | Synthesize questions from syllabus topics with confidence scores for academic relevance and answer accuracy. |
| **8. Duplicate Detection** | `/duplicates` | Exact match, normalized hash, and fuzzy similarity detection. Side-by-side comparison with Keep Both, Archive Duplicate, and Merge Sources decisions. |
| **9. Review & Approval Queue** | `/review` | Status-based workflow (Draft → Pending Review → Approved / Rejected / Changes Requested), SME verification checklists. |
| **10. Question Collections** | `/groups` | Parent-child question structures for comprehension passages, case studies, shared diagrams, and linked child question sets. |
| **11. Analytics & Completeness** | `/analytics` | Coverage metrics, difficulty distributions, AI tagging accuracy, and metadata health. |
| **12. User & Role Management** | `/users` | Role-based access control (RBAC) matrix for Super Admin, QB Manager, SME, Reviewer, Content Manager, and Viewer. |
| **13. Question Types** | `/question-types` | Specifications, marking schemes, and rules across Objective, Numerical, Matching, Reasoning, Comprehension, and Subjective formats. |
| **14. Settings** | `/settings` | AI provider configuration, model versioning, duplicate thresholds, and environment status. |

---

## 3. Quickstart & Running Instructions

### Prerequisites
- Node.js LTS (v20+ or v26+)
- npm or pnpm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
A default `.env` file is provided:
```env
DATABASE_URL="file:./dev.db"
AI_PROVIDER="mock_gemini"
AI_API_KEY=""
AI_MODEL="gemini-1.5-pro"
PORT=3000
```
> **Note on PostgreSQL**: To point to a PostgreSQL instance, update `DATABASE_URL="postgresql://user:password@localhost:5432/yolearn_qb?schema=public"` and change `provider = "postgresql"` in `prisma/schema.prisma`.

### 3. Generate Prisma Client & Sync Database
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Database with Realistic Exam Questions
```bash
node prisma/seed.js
```
This populates the database with realistic JEE Advanced, NEET-UG, CBSE Class 12, and NCERT Exemplar questions across Physics, Chemistry, Mathematics, and Biology, complete with LaTeX equations, sources, taxonomies, version histories, and duplicate pairs.

### 5. Run the Application
For development:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

For production:
```bash
npm run build
npm start
```

### 6. Run Integration & Database Tests
```bash
node test/e2e-test.js
```

---

## 4. Role-Based Access Control (RBAC)

The top navigation bar includes a role switcher to simulate permissions for:
- **Super Admin**: Full administrative authority.
- **QB Manager**: Manage question lifecycle and review workflows.
- **Subject Matter Expert (SME)**: Verify formulas, answers, solutions, and marking rubrics.
- **Reviewer**: Approve, reject, or request changes on questions.
- **Content Manager**: Ingest documents, upload PDFs/Excel sheets, and draft questions.
- **Viewer**: Read-only access to repository and analytics.

---

## 5. Question Type Support

- **Objective**: MCQ (Single Correct), MSQ (Multiple Correct with partial marking), True / False.
- **Numerical**: Floating point with configurable tolerance, Integer type, Interval ranges.
- **Matching**: List I & List II pairs, Matrix Match (Rows to column combinations).
- **Reasoning**: Assertion & Reason, Statement I & Statement II.
- **Comprehension**: Reading passages, Case Studies, Common Data sets with child questions.
- **Subjective**: Short Answer, Long Answer with multi-criteria marking rubrics.
