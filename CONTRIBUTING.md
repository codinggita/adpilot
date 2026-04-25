# Contributing to AdPilot AI

Thank you for your interest in contributing to AdPilot AI! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create a branch** from `main` for your feature or fix
4. **Install dependencies** for both client and server (see README)
5. **Make your changes**, following the conventions below
6. **Push** to your fork and open a **Pull Request**

## 📁 Project Structure

```
adpilot/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── layouts/      # Page layout wrappers
│       ├── pages/        # Route-level views
│       └── store/        # Redux + RTK Query state
├── server/          # Express.js backend
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── models/       # Mongoose schemas
│       ├── routes/       # API route definitions
│       └── middlewares/  # Auth & error handling
```

## 🔀 Branch Naming

Use descriptive branch names:

- `feature/campaign-filters` – new functionality
- `fix/auth-token-expiry` – bug fixes
- `chore/update-deps` – maintenance tasks
- `docs/api-reference` – documentation changes

## 📝 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add campaign budget alerts
fix: resolve token refresh loop
docs: update API endpoint table
chore: bump mongoose to v8
```

## ✅ Before Submitting a PR

- [ ] Code runs without errors (`npm run dev` for both client & server)
- [ ] No eslint warnings or errors
- [ ] PR description clearly explains **what** and **why**
- [ ] One feature/fix per PR — keep diffs small and reviewable

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.
