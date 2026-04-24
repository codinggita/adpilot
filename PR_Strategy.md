You are a senior software engineer helping me structure my project into multiple clean GitHub pull requests.

I have already built most (or all) of my project locally. Now I want to split it into 10–15 small, review-friendly PRs.

### 🎯 Goal:

* Each PR should contain **small, meaningful changes** (1–2 pages or 1 feature max)
* No PR should have huge changes (avoid 1000+ line diffs)
* PRs must be **independent or minimally dependent**
* After each PR is merged, the next PR should be created cleanly
* There should be **ZERO merge conflicts**

---

### 📦 Your Tasks:

1. **Analyze Project Structure**

   * Break the project into logical parts (UI, components, API, auth, utils, etc.)

2. **Create PR Plan (10–15 PRs)**
   For each PR, provide:

   * PR Title
   * What files/features it includes
   * Why it is isolated
   * Dependency (if any)

3. **Branch Strategy**

   * Use naming like:

     * feature/navbar
     * feature/login-ui
     * feature/api-integration
   * Explain base branch (main/dev)
   * Ensure each branch is created from updated main

4. **Step-by-Step Git Commands**
   For EACH PR:

   * Create branch
   * Add only specific files (not all changes)
   * Commit with proper message
   * Push and create PR

5. **Commit Guidelines**

   * Small commits
   * Semantic messages like:

     * feat: add login UI
     * fix: validation bug in form
     * refactor: split navbar component

6. **Avoid Merge Conflicts Strategy**

   * Always pull latest main before new branch
   * Don’t edit same files in multiple PRs
   * Suggest rebasing if needed

7. **Optional Advanced**

   * Suggest using Draft PRs
   * Suggest stacking PRs if needed
   * Suggest folder-wise commits if project already built

---

### ⚠️ Important Constraints:

* Do NOT include unrelated files in PR
* Do NOT mix multiple features in one PR
* Keep PR size small and reviewable
* Maintain logical development flow

---

### 🧠 Output Format:

* Give a clear PR breakdown (PR1 → PR15)
* Provide commands for each
* Keep it practical and developer-friendly

Now generate the full PR splitting plan for my project.
