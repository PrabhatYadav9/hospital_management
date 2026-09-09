# 🏥 MedFlow OS — Hospital Patient Management System

A full-stack, production-ready Hospital Patient Management System built with **React 19 + Vite** on the frontend and **Flask + MongoDB Atlas** on the backend.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 JWT Authentication | Admin login with secure token auth |
| 👤 Patient CRUD | Admit, view, edit, discharge, delete |
| 📊 Live Dashboard | Real-time stats from MongoDB aggregations |
| 🔍 Search & Filter | Server-side search by name, ID, disease, doctor |
| 📄 Pagination | Server-side paginated patient list |
| 📥 CSV Export | One-click download of all patient records |
| 🎨 Premium UI | Apple HIG inspired — white cards, blue accents |
| 📱 Responsive | Works on mobile, tablet, and desktop |

---

## 📁 Project Structure

```
hospital management/
├── backend/                    # Flask REST API
│   ├── app.py                  # Flask app factory
│   ├── config.py               # Environment variables
│   ├── database.py             # MongoDB Atlas singleton
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Your secrets (never commit)
│   ├── .env.example            # Reference template
│   ├── controllers/
│   │   ├── patient_controller.py
│   │   ├── dashboard_controller.py
│   │   └── auth_controller.py
│   ├── routes/
│   │   ├── patient_routes.py
│   │   ├── dashboard_routes.py
│   │   └── auth_routes.py
│   ├── models/
│   │   ├── patient_model.py
│   │   └── user_model.py
│   ├── middleware/
│   │   └── auth_middleware.py
│   └── utils/
│       ├── response_utils.py
│       └── id_generator.py
└── frontend/                   # React + Vite app
    └── src/
        ├── services/           # Axios API layer
        ├── hooks/              # usePatients, useDashboard, useAuth
        ├── context/            # AuthContext
        ├── pages/              # Dashboard, Patients, AddPatient, Login
        └── components/         # PatientTable, Navbar, Sidebar, etc.
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **MongoDB Atlas** account (free tier works fine)

---

### 2. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create a free cluster
2. Click **Connect** → **Drivers** → Copy the connection string
3. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

---

### 3. Backend Setup

```bash
cd "hospital management/backend"

# Create Python virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env and paste your real MongoDB URI:
MONGODB_URI=mongodb+srv://youruser:yourpass@yourcluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=hospital_management
JWT_SECRET=generate_a_strong_random_secret_here
PORT=5000
```

**Generate a strong JWT secret:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Start the backend:**
```bash
python app.py
```

The API will start at: `http://localhost:5000`

**Seed the admin user (first time only):**
```bash
curl -X POST http://localhost:5000/api/auth/seed
```
Default credentials:
- **Email:** `admin@hopehospital.com`
- **Password:** `Admin@123`

> ⚠️ Change the password after first login. Disable the `/seed` endpoint in production.

---

### 4. Frontend Setup

```bash
cd "hospital management/frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at: `http://localhost:5173`

---

### 5. Environment Variables (Optional)

To point the frontend to a different API URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 REST API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login with email/password |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Get current user |
| POST | `/api/auth/seed` | — | Create first admin (disable in prod) |

### Patients
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/patients/` | ✅ | List all patients (search/filter/sort/page) |
| POST | `/api/patients/` | ✅ | Admit new patient |
| GET | `/api/patients/:id` | ✅ | Get patient by ID |
| PUT | `/api/patients/:id` | ✅ | Update patient record |
| DELETE | `/api/patients/:id` | ✅ | Delete patient |
| PATCH | `/api/patients/:id/discharge` | ✅ | Discharge patient |

**Query Parameters for GET `/api/patients/`:**
- `search` — search by name, ID, disease, or doctor
- `status` — filter by `Admitted` or `Discharged`
- `gender` — filter by `Male`, `Female`, or `Other`
- `doctor` — filter by doctor name (partial match)
- `page` — page number (default: 1)
- `limit` — results per page (default: 10, max: 100)
- `sortBy` — field to sort by (default: `createdAt`)
- `sortOrder` — `asc` or `desc` (default: `desc`)

### Dashboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/stats` | ✅ | Aggregated stats + charts |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |

---

## 🔐 Auth Flow

1. User visits any page → redirected to `/login`
2. Login with credentials → JWT issued (24h expiry)
3. Token stored in `localStorage` as `hms_token`
4. All API requests include `Authorization: Bearer <token>`
5. On 401 → auto-logout + redirect to `/login`
6. Logout button in Navbar clears token and redirects

---

## 🏗️ Tech Stack

### Frontend
- **React 19** + **Vite** — modern build tooling
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — smooth page animations
- **React Router DOM v7** — client-side routing
- **Axios** — HTTP client with interceptors
- **React Hot Toast** — toast notifications
- **Lucide React** — clean icon library

### Backend
- **Flask** — lightweight Python web framework
- **Flask-CORS** — cross-origin request handling
- **PyMongo** — MongoDB driver
- **PyJWT** — JWT token generation/verification
- **bcrypt** — password hashing
- **python-dotenv** — environment variable loading

### Database
- **MongoDB Atlas** — cloud-hosted NoSQL database

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend && npm run build
# Deploy dist/ to Vercel
```

Set environment variable in Vercel:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Railway / Render / EC2)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

Set environment variables in your cloud platform:
- `MONGODB_URI`
- `JWT_SECRET`
- `DATABASE_NAME`

---

## 🛡️ Security Notes

- All routes except `/api/auth/login` and `/api/health` require a valid JWT
- Passwords are hashed with bcrypt (12 salt rounds)
- JWT tokens expire after 24 hours
- CORS is restricted to known origins
- **Disable `/api/auth/seed` in production**

---

## 📸 Default Admin Credentials

After seeding:
- **Email:** `admin@hopehospital.com`
- **Password:** `Admin@123`

> **Change this password immediately after first login.**

---

*Hospital Patient Management System — Phase 2 (Full-Stack)*