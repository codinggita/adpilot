# AdPilot AI 🚀

> AI-powered Google Ads optimization platform — automate campaigns, get smart recommendations, and maximize your ROAS.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)

## 🎨 Design & Prototyping

- **Interactive Prototype:** [View on Figma](https://www.figma.com/proto/hKfPVdWxNLbYTqGjX4JV41/AdPilot?node-id=5-2&viewport=490%2C547%2C0.19&t=MqwqqRQe7U6gbKwK-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A13&page-id=0%3A1)
- **Figma Design Files:** [View on Figma](https://www.figma.com/design/hKfPVdWxNLbYTqGjX4JV41/AdPilot?node-id=0-1&p=f)

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Real-time KPI overview with spend, clicks, conversions & ROAS metrics |
| **Campaign Manager** | Sync, pause, and manage Google Ads campaigns from one place |
| **AI Optimizer** | AI-powered audits with actionable fix recommendations |
| **Analytics** | Interactive charts and performance trend analysis |
| **Automation Rules** | IF / THEN rule builder to auto-manage bids and budgets |
| **Reports** | Generate and export weekly executive summary reports |
| **Notifications** | Real-time alerts for budget overruns and performance changes |

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Redux Toolkit (RTK Query) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT-based authentication |
| Integrations | Google Ads API (OAuth 2.0) |

## 📁 Project Structure

```
adpilot/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Sidebar, TopBar, ProtectedRoute
│   │   ├── layouts/            # DashboardLayout wrapper
│   │   ├── pages/              # All route-level page components
│   │   └── store/              # Redux store, API slices, auth slice
│   ├── index.html
│   └── vite.config.js
│
├── server/                     # Express backend
│   └── src/
│       ├── controllers/        # Route handler logic
│       ├── models/             # Mongoose schemas
│       ├── routes/             # API endpoint definitions
│       ├── middlewares/        # JWT auth middleware
│       ├── utils/              # Helpers & demo data seeder
│       └── config/             # Database connection
│
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** server or Atlas URI

### Installation

```bash
# Clone the repo
git clone https://github.com/atulXdev/adpilot.git
cd adpilot

# Setup server
cd server
npm install
cp .env.example .env    # Add your MongoDB URI & JWT secret
npm run dev

# Setup client (new terminal)
cd ../client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Create `server/.env` from the example:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/adpilot
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## 🤖 Demo Mode

No Google Ads credentials? No problem — the app enters **Demo Mode** on signup and seeds your account with realistic mock data so you can explore every feature immediately.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a PR.

## 📄 License

This project is licensed under the [MIT License](LICENSE).