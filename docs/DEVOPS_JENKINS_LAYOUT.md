# DevOps group project — layout (Jenkins path)

This document maps the **course rubric** to what lives in this repo, what you configure in **Jenkins**, and what you still do in **GitHub** and **Azure DevOps Boards**.  
**Do not push** until your group agrees; use this as a shared checklist with your partner.

---

## 1. Important: Azure DevOps Boards vs Jenkins

- **Jenkins** satisfies the **CI/CD pipeline** parts of the rubric (this repo’s `Jenkinsfile`).
- The assignment **still requires Agile tracking in Azure DevOps Boards** (work items, Kanban, backlog, assignments, stages). That is done in the **Azure DevOps web UI** (not in this repository). Your instructor’s screen captures need your **Centennial ID** visible in those boards.

---

## 2. GitHub — Source control (10 marks)

| Rubric item | What to do |
|-------------|------------|
| Code in Git | Already in Git; keep `main` as integration branch. |
| Main branch history | Before demo: `git log main` from project start → end (screenshot with ID visible). |
| ≥2 **features** on non-`main` branches + git log | Create branches like `12-feature-add-export` (issue prefix), merge via PR. |
| ≥2 **bugs** on non-`main` branches + git log | Same pattern: `34-fix-login-validation`, etc. |
| **4 GitHub Issues** | Create issues for real work (feature/bug/chore). |
| **4 Pull Requests** | Each PR: **reviewer**, **linking keyword** in description (`Closes #12`), branch name uses **issue number** prefix. |

### Suggested issue → branch → PR pattern

1. Create Issue **#10** — e.g. “Add inventory export”.
2. Branch: `10-feature-inventory-export` (from `main`).
3. PR into `main`: title/description includes `Closes #10`; assign a **code reviewer** (your partner).
4. Repeat for bugs with `fix` branches.

**Partner split:** one person owns Issues/PRs 1–2 + Jenkins verification; the other owns 3–4 + SonarQube/Jenkins agent docs — adjust as you like.

---

## 3. Azure DevOps Boards (10 marks)

Not stored in Git. In Azure DevOps:

- At least **4 work item types** (e.g. Epic, Feature, Bug, Task).
- **2 items per type** on a **Kanban** board with **backlog**.
- Each item: **assigned** to a member, moved through **all stages** (e.g. New → Active → Resolved → Done).

Use the same themes as your GitHub issues so the story is coherent for the demo.

---

## 4. Jenkins — Continuous Integration (14 marks)

| Rubric item | Where it is satisfied |
|-------------|------------------------|
| **SCM poll** | `Jenkinsfile` → `triggers { pollSCM('H/15 * * * *') }`. You can also enable **Poll SCM** on the multibranch/job UI. |
| **Jenkinsfile in repo** | Root `Jenkinsfile`. |
| **Declarative pipeline + checkout + build tool** | Declarative `pipeline`; **Checkout** stage; **npm** for Node (Express + Vite). |
| **SonarQube** | Stage **SonarQube analysis** + root `sonar-project.properties`. Jenkins needs **SonarQube Scanner** on the agent and **SonarQube** server configured under **Manage Jenkins** (name `SonarQube` must match `withSonarQubeEnv('SonarQube')` in `Jenkinsfile`, or rename both to match). |
| **Build** | **Build** stage: `client` → `npm run build`. |
| **Test + coverage** | **Test** stage: `server` and `client` → `npm run test:coverage` (Vitest + `@vitest/coverage-v8`, LCOV for Sonar). |
| **Blue Ocean** | Install **Blue Ocean** plugin; open pipeline run → **Open Blue Ocean** for stage history (not a file in repo). |

### Jenkins job setup (summary)

1. New **Pipeline** (or Multibranch) from **SCM**, repo URL + credentials.
2. Script path: `Jenkinsfile`.
3. Install **SonarQube Scanner** on the agent (or use an agent image that includes `sonar-scanner`).
4. **SonarQube**: create project key matching `sonar.projectKey` in `sonar-project.properties` (or adjust the file to match your Sonar server).
5. If the scanner name is not `SonarQube`, change the string inside `withSonarQubeEnv('...')` in `Jenkinsfile` to match.

### Windows-only Jenkins agents

The `Jenkinsfile` uses `sh` (Unix shell). Either use a **Linux** agent, or duplicate stages with `bat` for Windows (e.g. `npm ci` → `bat 'npm ci'` in `server`).

---

## 5. Jenkins — Continuous Delivery / Deployment (6 marks)

| Rubric item | Implementation |
|-------------|----------------|
| **Deliver** | **Deliver** stage creates `inventory-release.tgz` (client `dist` + server `package.json` / lock / `src`). |
| **Deploy Dev / QAT / Staging / Production** | **Mock** `echo` steps as placeholders; rubric allows mock if a real environment is not applicable. Replace later with real scripts (SSH, Docker, Azure, etc.). |

`post { always { archiveArtifacts ... } }` stores the tarball and coverage for grading screenshots.

---

## 6. Files in this repo (DevOps backup)

| Item | Purpose |
|------|---------|
| `Jenkinsfile` | Declarative pipeline: checkout, install, build, test+coverage, SonarQube, deliver, deploy mocks; SCM poll. |
| `sonar-project.properties` | Sonar sources, tests, LCOV paths. |
| `server/` / `client/` | `test:coverage`, `@vitest/coverage-v8`, Vitest LCOV settings. |
| `.github/ISSUE_TEMPLATE/` | Feature + bug templates (issue # branch naming). |
| `.github/pull_request_template.md` | `Closes #`, reviewer, branch checklist. |
| `docs/AZURE_DEVOPS_BOARDS_CHECKLIST.md` | Agile rubric (Azure Boards UI). |
| `docs/DEVOPS_JENKINS_LAYOUT.md` | This guide. |
| `scripts/verify-local-ci.ps1` | Windows: `npm install` + tests + build (Jenkins still uses `npm ci`). |

## 7. Before you push (group agreement)

- [ ] Partner reviewed `Jenkinsfile` and Sonar property names.
- [ ] Decide SonarQube **project key** and Jenkins **credential/server** names.
- [ ] Plan **4 issues** and **4 PRs** with issue-style branch names (templates help).
- [ ] Azure Boards columns match your process and everyone appears on work items.

---

## 8. Quick local verification (before Jenkins)

```bash
cd server && npm ci && npm run test:coverage
cd ../client && npm ci && npm run test:coverage && npm run build
```

On Windows you can use `.\scripts\verify-local-ci.ps1` (uses `npm install` if locks are tight). Re-sync lockfiles with `npm install` in `server/` and `client/` if `npm ci` fails.

SonarQube analysis only runs where `sonar-scanner` and the server are configured (typically Jenkins).
