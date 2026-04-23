# AdPilot AI

AdPilot is an AI-powered SaaS platform designed to optimize Google Ads campaigns automatically. It features a robust dashboard for analytics, smart AI campaign auditing and recommendations, and an automation rule builder to maximize your Return on Ad Spend (ROAS).

## 🎨 Design & Prototyping

- **Interactive Prototype:** [View on Figma](https://www.figma.com/proto/hKfPVdWxNLbYTqGjX4JV41/AdPilot?node-id=5-2&viewport=490%2C547%2C0.19&t=MqwqqRQe7U6gbKwK-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A13&page-id=0%3A1)
- **Figma Design Files:** [View on Figma](https://www.figma.com/design/hKfPVdWxNLbYTqGjX4JV41/AdPilot?node-id=0-1&p=f)

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS (v4), Redux Toolkit (RTK Query)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Integrations:** Google Ads API (OAuth 2.0)

## 📁 Project Structure

The repository is built as a monorepo split into standard `client` and `server` environments.

```text
adpilot/
├── client/                     # Frontend React Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, global styles
│   │   ├── components/         # Reusable UI components (Sidebar, TopBar, etc.)
│   │   ├── layouts/            # Page layout wrappers (DashboardLayout)
│   │   ├── pages/              # Main route views (Dashboard, Optimizer, Settings, etc.)
│   │   ├── store/              # Redux logic
│   │   │   ├── api/            # RTK Query API slices (usersApi, campaignApi, etc.)
│   │   │   └── slices/         # Standard Redux slices (authSlice)
│   │   ├── App.jsx             # React Router configuration
│   │   └── index.css           # Global Tailwind CSS directives and design tokens
│   ├── index.html
│   ├── postcss.config.js       # PostCSS configuration
│   ├── tailwind.config.js      # Tailwind theme and utility configuration
│   └── vite.config.js          # Vite build tool configuration
│
├── server/                     # Backend Node.js Environment
│   ├── controllers/            # Business logic for route endpoints
│   ├── middleware/             # Custom express middleware (auth, error handling)
│   ├── models/                 # Mongoose database schemas
│   ├── routes/                 # Express API route definitions
│   ├── utils/                  # Helper functions and demo-data seeders
│   ├── server.js               # Main Express application entry point
│   ├── .env.example            # Environment variable template
│   └── package.json    
│
├── AdPilot-AI-PRD.txt          # Product Requirements Document
└── README.md                   # This file
```

## 🛠 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB server or URI

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/atulXdev/adpilot.git
   cd adpilot
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   # Copy .env.example to .env and fill in your MongoDB URI and Auth secrets
   cp .env.example .env
   npm run dev
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the Application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🤖 Demo Mode
If you do not have authorized Google Ads OAuth credentials configured, the application will automatically enter **Demo Mode** on signup. This seeds your dashboard with realistic mock data allowing you to explore the AI optimization workflows immediately.