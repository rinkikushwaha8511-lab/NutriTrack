# NutriTrack — Diet & Nutrition Tracker

NutriTrack is a full-stack, Mongoose-backed Diet & Nutrition Tracking web application. It enables users to monitor daily meal intake, track calories and macronutrients (protein, carbs, fats, fiber), log water consumption, record weight progress with automatic BMI calculation, and receive personalized food suggestions. 

It also includes a role-protected **Admin Control Center** for user role management, food database catalog CRUD, category administration, and analytics reports.

---

## Tech Stack

- **Frontend**: React + JavaScript (Vite) + Recharts + React Icons
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) + bcryptjs password hashing
- **HTTP Client**: Axios
- **Architecture**: Model-View-Controller (MVC)

---

## Key Features

### User Features
1. **Interactive Dashboard**: Real-time summary of consumed vs. remaining calories, macronutrients breakdown, daily water intake, current weight, BMI status, and goal progress bars.
2. **Food Search & Catalog**: Search items by keyword or category with nutritional details per serving size.
3. **Meal Logging**: Log meals (Breakfast, Lunch, Dinner, Snacks) with automatic server-side nutrition calculation based on serving size.
4. **Water Tracker**: Record daily water intake (ml) with progress indicators towards daily hydration targets.
5. **Weight Log & BMI Calculator**: Track weight over time and compute BMI categorized according to WHO standards (Underweight, Normal, Overweight, Obesity).
6. **Progress Analytics**: Recharts visual analytics over 7 days, 30 days, or 3 months.
7. **Personalized Food Suggestions**: Scoring engine recommending food items based on remaining calorie/protein targets, dietary preferences, and fitness goals.
8. **User Profile & Goal Management**: Customizable profile settings, daily calorie targets, and BMR/TDEE goal auto-calculator.

### Admin Features
1. **Admin Security**: Secured via JWT token verification (`protect`) and database role checking (`adminOnly`).
2. **Admin Dashboard**: System-wide count statistics for total users, admins, food catalog items, meals, water entries, and weight records.
3. **User Management (CRUD)**: View users with search/role filters, toggle user roles (`user` $\leftrightarrow$ `admin`), delete accounts (with self-demotion & self-deletion guards).
4. **Food Catalog Management (CRUD)**: Add, edit, and remove items from the master food database with duplicate name prevention and macro validation.
5. **Categories Management (CRUD)**: Create, edit, and delete food categories with auto-seeding of standard default categories.
6. **Admin Reports**: System analytics reports over configurable ranges (`7d`, `30d`, `3m`) for Users, Food Items, Meals, Water, and Weight logs.

---

## Folder Structure

```text
NutriTrack/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── adminController.js    # Admin statistics, Users, Food Items & Category CRUD
│   │   ├── adminReportController.js # System-wide analytics reports
│   │   ├── authController.js     # User registration & login (JWT)
│   │   ├── dashboardController.js# Daily overview & calorie remaining calculations
│   │   ├── foodItemController.js # Master food catalog query APIs
│   │   ├── foodSuggestionController.js # Personalized recommendation scoring
│   │   ├── goalController.js     # User goal management & BMR/TDEE calculator
│   │   ├── mealController.js     # Meal logging & server-side macro calculation
│   │   ├── progressController.js # Historical progress aggregation
│   │   ├── userController.js     # Profile management
│   │   ├── waterController.js    # Water intake tracking
│   │   └── weightController.js   # Weight logging & BMI calculation
│   ├── middleware/
│   │   ├── adminMiddleware.js    # Admin role checking (adminOnly)
│   │   ├── authMiddleware.js     # JWT verification (protect)
│   │   └── errorMiddleware.js    # 404 & global error handling
│   ├── models/
│   │   ├── Category.js           # Category schema
│   │   ├── FoodItem.js           # Master food database catalog schema
│   │   ├── Goal.js               # Daily targets schema
│   │   ├── Meal.js               # Logged meal entry schema
│   │   ├── User.js               # User account schema (role: user/admin)
│   │   ├── Water.js              # Water intake log schema
│   │   └── WeightLog.js          # Weight record schema
│   ├── routes/                   # Express route definitions
│   ├── utils/                    # Date utilities & seeders
│   ├── server.js                 # Express application entry point
│   ├── create_test_admin.js      # Seed test admin account script
│   └── test_*.js                 # Integration test suites
└── frontend/
    ├── src/
    │   ├── components/           # PublicHeader, PublicFooter, Navbar, Sidebar, etc.
    │   ├── pages/                # Home, Login, Register, Dashboard, Meals, Admin Pages, etc.
    │   ├── services/             # Axios API instance
    │   ├── App.jsx               # React Router configuration
    │   ├── index.css             # Global CSS & Design System
    │   └── main.jsx              # React DOM entry point
    └── package.json
```

---

## Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/NutriTrack
JWT_SECRET=your_jwt_secret_key_here
```

---

## Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Server running locally on port `27017`

### 1. Backend Setup

```bash
cd backend
npm install

# Seed the default admin account (admin@test.com / Admin@123)
node create_test_admin.js

# Start backend dev server (runs on port 5000)
npm run dev
# or
node server.js
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start Vite frontend dev server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Credentials for Testing

- **Admin Account**:
  - Email: `admin@test.com`
  - Password: `Admin@123`
  - Role: `admin`

- **Normal User Account**:
  - You can register a new account from the Register page or test with any user credentials.

---

## API Overview

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login user & return JWT token

### User Routes (Protected - `protect`)
- `GET /api/dashboard` — Get today's nutrition overview
- `GET /api/users/profile` — Get profile details
- `PUT /api/users/profile` — Update profile
- `GET /api/food-items` — Search master food catalog
- `POST /api/meals` — Log a meal
- `GET /api/meals/today` — Get today's logged meals
- `POST /api/water` — Log water intake (ml)
- `POST /api/weight` — Log body weight (kg)
- `GET /api/progress?range=7d|30d|3m` — Get progress analytics
- `GET /api/food-suggestions` — Get personalized food recommendations

### Admin Routes (Protected - `protect`, `adminOnly`)
- `GET /api/admin/dashboard` — System counts overview
- `GET /api/admin/users` — List all users (search & role filter)
- `PUT /api/admin/users/:id/role` — Toggle user role
- `DELETE /api/admin/users/:id` — Delete user account
- `POST /api/admin/food-items` — Add catalog item
- `PUT /api/admin/food-items/:id` — Update catalog item
- `DELETE /api/admin/food-items/:id` — Remove catalog item
- `GET /api/admin/categories` — Get categories list
- `POST /api/admin/categories` — Add category
- `PUT /api/admin/categories/:id` — Update category
- `DELETE /api/admin/categories/:id` — Remove category
- `GET /api/admin/reports/users` — User analytics report
- `GET /api/admin/reports/foods` — Food database report
- `GET /api/admin/reports/meals?range=7d|30d|3m` — Meal analytics report
- `GET /api/admin/reports/water?range=7d|30d|3m` — Water analytics report
- `GET /api/admin/reports/weight?range=7d|30d|3m` — Weight analytics report

---

## Testing

Run integration tests from the `backend/` directory:

```bash
cd backend

# Run Admin Authentication & Dashboard tests
node test_admin.js

# Run Admin Users, Food Items & Categories CRUD tests
node test_item11.js

# Run Admin Reports tests
node test_admin_reports.js

# Run User Dashboard & Nutrition calculation tests
node test_dashboard.js

# Run Meal Tracking tests
node test_meals.js

# Run Progress Analytics tests
node test_progress.js

# Run Food Suggestions tests
node test_food_suggestions.js
```

---

## Project Notes & Limitations

- **Email Service**: Forgot/Reset password pages provide complete UI flows; backend email sending via SMTP is deliberately unconfigured for local development.
- **BMI Disclaimer**: BMI values are calculated according to standard WHO mathematical formulas for informational purposes only.
