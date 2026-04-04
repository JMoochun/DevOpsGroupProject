# Azure DevOps Boards — rubric (copy-paste reference)

Do this in the **Azure DevOps** website (not in Git). **Jenkins** is separate; this is only for the **Agile / Boards** marks.

**Screenshots:** Your instructor asked for your **Centennial ID** (username or email) visible in captures.

---

## Rubric (what you must show)

| Requirement | Minimum |
|-------------|---------|
| Work item **types** | **4 different types** (e.g. Epic, Feature, Bug, Task — or your process’s equivalents) |
| Items per type | **2 items per type** → **8 work items** minimum |
| Board | **Kanban** board + **backlog** |
| Assignment | Each work item has an **assigned** project member |
| Lifecycle | Each work item goes through **all stages/columns** on the board (e.g. New → Active → Resolved → Closed/Done — use whatever your project uses, but every item should be demonstrated through the full flow) |

---

## Quick setup (high level — follow the Azure UI)

1. Go to **https://dev.azure.com** and sign in.
2. **New organization** (if needed) → create an **organization** name you can use for the course.
3. **Create project** → name it (e.g. `COMP231-Inventory-DevOps`), visibility as required by your instructor.
4. Open **Boards** → **Work items** / **Boards** (Kanban). Use the **Backlog** view so you can show backlog + board.
5. Ensure your process shows **Epic, Feature, Bug, Task** (or map your 4 types to what your process provides — Basic, Agile, or Scrum templates differ slightly).

---

## Sample work items you can copy and adapt (inventory theme)

Create **2 per type** (8 total). Assign **you** and **your partner** so every item has an assignee.

**Epic (×2)**  
- `Epic: Inventory management system — DevOps delivery`  
- `Epic: Course COMP231 — pipeline and quality gates`

**Feature (×2)**  
- `Feature: Jenkins CI pipeline (build, test, SonarQube)`  
- `Feature: GitHub workflow (issues, PRs, code review)`

**Bug (×2)**  
- `Bug: [describe a real small bug you fixed or will fix]`  
- `Bug: [describe another — link to GitHub issue # if you want]`

**Task (×2)**  
- `Task: Configure Jenkins job from SCM + SCM poll`  
- `Task: Azure Boards — Kanban and backlog demo`

*(Replace bracket text with real titles tied to your repo so the demo matches GitHub/Jenkins.)*

---

## Demo checklist (before presentation)

- [ ] **Backlog** view: at least 8 items visible across 4 types.
- [ ] **Board** (Kanban): columns/stages are clear; you can show items **moved through each stage** (do this for each item over the project, or walk through examples live).
- [ ] Every item shows an **Assignee** (you or partner).
- [ ] Browser window or profile shows **Centennial ID** in screenshots or live share.

---

## Alignment with GitHub (recommended)

Use the **same themes** as your GitHub Issues (e.g. same feature/bug names) so the story is one line: Boards → Issues → branches → Jenkins.

---

## Partner split (example)

- **Person A:** Creates Epics + Features, keeps board updated for first half of sprint.  
- **Person B:** Bugs + Tasks, moves items to **Done** and verifies backlog for demo.

---

## What was *not* included elsewhere

- **Azure Pipelines** (`azure-pipeline.yaml`) — **not** required if you chose **Jenkins** for CI/CD.  
- **Boards** — **required** for Agile marks; this file is the full copy-paste reference for that part.
