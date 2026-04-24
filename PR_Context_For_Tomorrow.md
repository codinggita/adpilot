# AdPilot AI - Development Context & Handover

**Status:** IN PROGRESS  
**Current State:** PR 1, PR 2, and PR 3 are successfully merged into GitHub `main`. 

This document serves as the absolute source of truth for our **feature-wise PR strategy**. **Do not deviate from this ordered PR plan.** The repository has already been fully built locally; our strategy is strictly about executing clean, isolated `git add`, `git commit`, and `git push` routines without generating merge conflicts.

---

## 🛑 AI System Instructions for Tomorrow
When you continue development, you MUST follow the **One PR → Merge → Next PR** Git strategy:
1. Stop and ask the human user if they are ready for the next PR.
2. Ensure you branch from an updated main:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/[branch-name]
   ```
3. Stage ONLY the specific files listed for that PR step.
4. Run:
   ```bash
   git commit -m "feat: [Feature Description]"
   git push -u origin feature/[branch-name]
   ```
5. Hand back over to the user to merge on GitHub. Do NOT move to the next PR until the user explicitly says it has been successfully merged.

---

## ✅ What We Achieved So Far
1. **PR 1: Initial Project Scaffold [MERGED]**
   - We setup Vite configs, Tailwind configurations, and base `.gitignore` files. 
2. **PR 2: User Authentication System [MERGED]**
   - We delivered a fully vertical auth slice: MongoDB `User` models, Auth middleware, `usersController`, Express routes, RTK Query API slices, and the frontend `SignupLogin` and `ConnectGoogleAds` pages.
3. **PR 3: Application Core Shell & Layouts [MERGED]**
   - Handled React global architecture: `main.jsx`, routing via `App.jsx`, `Sidebar`, `TopBar`, and the protected `DashboardLayout` so the app is structurally secured.

---

## 🚀 What to do Tomorrow (Starting at PR 4)

Here is the exact file staging roadmap you must follow step-by-step:

### PR 4: Campaign Management Feature
**Branch:** `feature/campaigns`
**Base:** `main`  *(Make sure to pull `main` first!)*
**Files to add:**
- `server/models/Campaign.js`, `server/models/Keyword.js`
- `server/controllers/campaignController.js`, `server/routes/campaignRoutes.js`
- `client/src/store/api/campaignApi.js`
- `client/src/pages/Campaigns.jsx`
**Why:** Delivers Google Ads syncing, pausing, and campaign grid layout.

### PR 5: Analytics & Telemetry Feature
**Branch:** `feature/analytics`
**Base:** `main`
**Files to add:**
- `server/models/CampaignMetrics.js`
- `server/controllers/analyticsController.js`, `server/routes/analyticsRoutes.js`
- `client/src/store/api/analyticsApi.js`
- `client/src/pages/Analytics.jsx`
- `client/src/pages/MainDashBoard.jsx`
**Why:** Connects dashboard telemetry and visual charts to the metric data layer.

### PR 6: AI Optimizer Feature
**Branch:** `feature/ai-optimizer`
**Base:** `main`
**Files to add:**
- `server/models/AuditResult.js`
- `server/controllers/auditController.js`, `server/routes/auditRoutes.js`
- `client/src/store/api/auditApi.js`
- `client/src/pages/AiOptimizer.jsx`
**Why:** Encapsulates the entire logic for generative AI recommendations, scoring health, and applying fixes.

### PR 7: Automation & Rules Engine Feature
**Branch:** `feature/automation-rules`
**Base:** `main`
**Files to add:**
- `server/models/AutomationRule.js`, `server/models/RuleExecutionLog.js`
- `server/controllers/automationController.js`, `server/routes/automationRoutes.js`
- `client/src/store/api/rulesApi.js`
- `client/src/pages/AutomationRules.jsx`
**Why:** Delivers the fully isolated script compiler/scheduler where users can build IF/THEN automated rules.

### PR 8: Notification & TopBar Integration Feature
**Branch:** `feature/notifications`
**Base:** `main`
**Files to add:**
- `server/models/Notification.js`
- `server/controllers/notificationController.js`, `server/routes/notificationRoutes.js`
- `client/src/store/api/notificationsApi.js`
**Why:** Configures the realtime background notifications feed overlay dropdown.

### PR 9: Reporting Engine Feature
**Branch:** `feature/reporting`
**Base:** `main`
**Files to add:**
- `server/models/Report.js`
- `server/controllers/reportController.js`, `server/routes/reportRoutes.js`
- `client/src/store/api/reportsApi.js`
- `client/src/pages/Reports.jsx`
**Why:** Gives users the capacity to view and generate executive summary PDF reports.

### PR 10: Settings, Landing Page & Cleanup
**Branch:** `feature/settings-final-cleanup`
**Base:** `main`
**Files to add:**
- `client/src/pages/Settings.jsx`
- `client/src/pages/LandingPage.jsx`
- `server/utils/apiResponse.js`, `server/utils/seedDemoData.js`
- *Any remaining untracked `package.json` modifications or image assets*
**Why:** Finalizes global user configurations and hooks up the public landing page routing before official release!
