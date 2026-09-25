# SkillProof – Student Skill and Achievement Verification Platform 🛡️

**SkillProof** is a modern, full-stack web application engineered for university students to aggregate, maintain, and share authenticated skills, certifications, software projects, internships, and competitive achievements. By bridging student achievements with authorized academic and industry verification, SkillProof eliminates resume fraud and provides recruiters with cryptographic confidence in candidate competencies.

---

## 🌟 Key Features

### For Students
- **Unified Academic & Professional Profile**: Maintain skills, certificates, projects, internships, and hackathon accomplishments in one place.
- **Document & Proof Upload**: Upload official certificate PDFs, offer/completion letters, repository links, or credential URLs.
- **Verification Workflow**: Submit any credential for official verification and track audit statuses in real-time.
- **Verified Badges**: Authenticated credentials receive prominent verification badges backed by evaluator remarks.
- **Public Recruiter Portfolio (`/profile/:username`)**: Sharable public profile link with verified badges and printable/exportable layout.
- **Profile Completeness Score**: Interactive gauge encouraging students to achieve complete professional representation.

### For Verifiers & Administrators
- **Dedicated Verifier Console**: View pending submissions across skills, certificates, projects, internships, and achievements.
- **Evidence Review**: Inspect uploaded proof documents, certificates, and external credentials directly.
- **Approve or Reject with Feedback**: Approve credentials to mark them as `Verified` or reject with clear feedback for student rectification.
- **Student Roster & Search**: Explore registered students, verified credential counts, and academic institutions.
- **Institutional Analytics**: Real-time statistics on total students, pending requests, approval rates, and category breakdowns.

### Discovery & Search
- **Talent Search Engine**: Filter students by name, college, technical skill, or project technology stack.
- **Interactive Filter Chips**: One-click filters for popular skills (e.g., React, Python, Cloud) and universities.

---

## 💻 Technology Stack

### Frontend
- **Framework**: React.js 19
- **Styling**: Tailwind CSS v4 (with custom glassmorphism and modern gradient design)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with centralized request/response interceptors)
- **Icons**: Lucide React + custom SVG brand icons

### Backend
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Architecture**: MVC (Models, Views/Controllers, Routes, Middleware, Services)
- **Authentication**: JWT (JSON Web Tokens) with 30-day persistent session support
- **Password Hashing**: `bcryptjs` (salted pre-save hashing)
- **File Uploads**: `multer` with file extension and MIME type filtering (PDF, PNG, JPG, JPEG, SVG)
- **Logging**: Morgan HTTP logger

### Database
- **Engine**: MongoDB (supports both local MongoDB and MongoDB Atlas)
- **ODM**: Mongoose 9 with custom indexes, schema validation, and virtual fields

---

## 🏗️ System Architecture

```
                       +-----------------------------+
                       |    React.js + Tailwind UI   |
                       | (Student & Verifier Portals)|
                       +--------------+--------------+
                                      |
                               REST API Calls
                               (JWT Bearer)
                                      v
                       +-----------------------------+
                       |     Express.js API Layer    |
                       +--------------+--------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+         +------------------+         +------------------+
| Auth Middleware  |         | Controllers / MVC|         | File Uploads     |
| (JWT & RBAC)     |         | Logic Engine     |         | (/uploads/ disk) |
+------------------+         +--------+---------+         +------------------+
                                      |
                                 Mongoose ODM
                                      |
                                      v
                       +-----------------------------+
                       | MongoDB Database / Atlas    |
                       | (Users, Skills, Certs, etc) |
                       +-----------------------------+
```

---

## 📁 Folder Structure

```
SkillProof1/
├── server/
│   ├── config/
│   │   └── db.js                       # Database connection
│   ├── controllers/
│   │   ├── authController.js           # Register, login, getMe, updatePassword
│   │   ├── userController.js           # Student profile, public profile, directory
│   │   ├── skillController.js          # Skills CRUD & verification
│   │   ├── certificateController.js    # Certificates CRUD & uploads
│   │   ├── projectController.js        # Projects CRUD & demo links
│   │   ├── internshipController.js     # Internships CRUD & verification
│   │   ├── achievementController.js    # Hackathons & awards CRUD
│   │   ├── verificationController.js   # Verifier approval / rejection queue
│   │   └── searchController.js         # Student talent search
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT authentication & role authorization
│   │   ├── uploadMiddleware.js         # Multer proof file storage & validation
│   │   └── errorMiddleware.js          # 404 & global exception handler
│   ├── models/
│   │   ├── User.js                     # Student & Verifier schema
│   │   ├── Skill.js                    # Skills & proficiency schema
│   │   ├── Certificate.js              # Certificates schema
│   │   ├── Project.js                  # Projects schema
│   │   ├── Internship.js               # Internships schema
│   │   ├── Achievement.js              # Achievements schema
│   │   └── VerificationRequest.js      # Audit trail & request schema
│   ├── routes/                         # Express API route modules
│   ├── uploads/                        # Uploaded proof documents
│   ├── app.js                          # Express application setup
│   ├── server.js                       # Server entry point
│   ├── seeder.js                       # Database demo seeder
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── Navbar.jsx              # Global header navigation
│   │   │   ├── Sidebar.jsx             # Student & Verifier sidebars
│   │   │   ├── StatCard.jsx            # Modern metrics cards
│   │   │   ├── VerificationBadge.jsx   # Status indicator badge
│   │   │   ├── ProofViewerModal.jsx    # Evidence document previewer
│   │   │   ├── ConfirmationDialog.jsx  # Action confirmation modal
│   │   │   ├── SkillCard.jsx           # Skill item card
│   │   │   ├── CertificateCard.jsx     # Certificate card
│   │   │   ├── ProjectCard.jsx         # Project card
│   │   │   ├── InternshipCard.jsx      # Internship card
│   │   │   └── AchievementCard.jsx     # Achievement card
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Authentication & session provider
│   │   │   └── ToastContext.jsx        # Toast notification system
│   │   ├── layouts/
│   │   │   ├── StudentLayout.jsx       # Student dashboard layout
│   │   │   ├── AdminLayout.jsx         # Verifier console layout
│   │   │   └── PublicLayout.jsx        # Landing & public view layout
│   │   ├── pages/                      # Page views
│   │   │   ├── LandingPage.jsx         # Hero, features, and workflows
│   │   │   ├── LoginPage.jsx           # Sign in with 1-click demo buttons
│   │   │   ├── RegisterPage.jsx        # Sign up with role selection
│   │   │   ├── StudentDashboard.jsx    # Student metrics & quick actions
│   │   │   ├── StudentProfilePage.jsx  # Edit profile & upload avatar
│   │   │   ├── SkillsPage.jsx          # Skills matrix & filters
│   │   │   ├── CertificatesPage.jsx    # Certificate management
│   │   │   ├── ProjectsPage.jsx        # Project showcases
│   │   │   ├── InternshipsPage.jsx     # Work experience & proofs
│   │   │   ├── AchievementsPage.jsx    # Awards & competition records
│   │   │   ├── VerificationTrackerPage.jsx # Student verification status tracker
│   │   │   ├── AdminDashboard.jsx      # Verifier overview & review table
│   │   │   ├── AdminVerificationRequestsPage.jsx # Audit & approval queue
│   │   │   ├── AdminStudentsPage.jsx   # Student directory
│   │   │   ├── PublicProfilePage.jsx   # Public recruiter view (/profile/:username)
│   │   │   └── SearchProfilesPage.jsx  # Student talent search
│   │   ├── services/
│   │   │   └── api.js                  # Centralized Axios client
│   │   ├── App.jsx                     # Route declarations
│   │   └── main.jsx                    # React root mounting
│   ├── vite.config.js
│   └── package.json
│
├── test_suite.js                       # 20-point automated integration tests
├── package.json                        # Root workspace scripts
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
NODE_ENV=development
# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/skillproof
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/skillproof?retryWrites=true&w=majority
JWT_SECRET=skillproof_super_secure_jwt_secret_key_2026_dev
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Installation & Running Locally

### 1. Install All Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install in `server` and `client` individually via `cd server && npm install`, `cd ../client && npm install`)*

### 2. Seed Database with Demo Accounts & Verified Records
```bash
npm run seed
```

This populates:
- **Student 1 (Alex Rivera)**: `alex@skillproof.edu` / `password123` (100% profile, verified AWS certificates, projects, and hackathon wins).
- **Student 2 (Priya Sharma)**: `priya@skillproof.edu` / `password123` (Contains 5 pending submissions ready for verifier review).
- **Verifier / Admin (Dr. Marcus Vance)**: `verifier@skillproof.edu` / `admin123` (Authorized institutional credential auditor).

### 3. Start Frontend & Backend Concurrently
From the project root:
```bash
npm run dev
```

- **Backend (Server) runs on**: `http://localhost:5000`
- **Frontend (Client) runs on**: `http://localhost:5173`

---

## 🧪 Automated End-to-End Test Suite

Run the comprehensive 20-point test suite:
```bash
node test_suite.js
```

### Verified Test Cases:
1. System Health API is operating
2. Student Registration with password hashing & JWT token
3. Student Login & credentials validation
4. Student Profile Update & Completeness Metric
5. Add Skill CRUD
6. Add Certificate
7. Add Project
8. Add Internship
9. Add Achievement
10. Submit Certificate for Verification
11. View My Verification Requests
12. Verifier / Admin Login
13. Verifier View Pending Queue
14. Verifier Approve Request
15. Certificate Status updated to Verified with Remarks
16. Public Profile Page with Verified Credentials
17. Search API querying students by name
18. Search API querying students by technology in projects
19. Role-based authorization blocks Student from Verifier routes (403 Forbidden)
20. Invalid Login returns 401 Unauthorized

---

## 📡 REST API Overview

### Authentication
- `POST /api/auth/register` — Register student or verifier account
- `POST /api/auth/login` — Authenticate and receive JWT token
- `POST /api/auth/logout` — Invalidate session
- `GET /api/auth/me` — Get current logged-in user profile

### User & Directory
- `GET /api/users/profile` — Get profile with dashboard analytics
- `PUT /api/users/profile` — Update student profile & avatar
- `GET /api/users/:username` — Public student portfolio (no login needed)
- `GET /api/users/students` — Verifier student directory

### Skills, Certificates, Projects, Internships, Achievements
- `GET /api/skills` | `POST /api/skills` | `PUT /api/skills/:id` | `DELETE /api/skills/:id`
- `GET /api/certificates` | `POST /api/certificates` | `PUT /api/certificates/:id` | `DELETE /api/certificates/:id`
- `GET /api/projects` | `POST /api/projects` | `PUT /api/projects/:id` | `DELETE /api/projects/:id`
- `GET /api/internships` | `POST /api/internships` | `PUT /api/internships/:id` | `DELETE /api/internships/:id`
- `GET /api/achievements` | `POST /api/achievements` | `PUT /api/achievements/:id` | `DELETE /api/achievements/:id`

### Verification Workflow
- `POST /api/verification/submit` — Submit any item for verification
- `GET /api/verification/my-requests` — Student verification tracker
- `GET /api/verification/pending` — Verifier review queue
- `GET /api/verification/all` — Verifier all submissions filter
- `GET /api/verification/stats` — Verifier dashboard statistics
- `PUT /api/verification/:id/approve` — Approve request & issue verified badge
- `PUT /api/verification/:id/reject` — Reject request with feedback remarks

### Search
- `GET /api/search` — Query students by name, college, skill, or technology

---

## 🔒 Security & Data Protection

- **Password Hashing**: Passwords hashed with `bcryptjs` (salt factor 10) before MongoDB persistence.
- **JWT Protection**: Secure tokens verified on all private endpoints.
- **Role-Based Access Control (RBAC)**: Strict separation preventing students from accessing verifier review routes.
- **File Validation**: Multi-layer inspection of MIME types and extensions restricting uploads to safe formats (PDF, JPG, PNG, SVG) up to 10MB.
- **Data Sanitization**: Passwords stripped from all JSON responses.

---

## 🔮 Future Enhancements

- **Blockchain Credential Anchoring**: Mint Soulbound NFTs (SBTs) on Polygon / Ethereum for decentralized verification.
- **Institutional Single Sign-On (SSO)**: SAML 2.0 / OAuth integration with university identity providers.
- **Automated Skill Assessments**: In-platform coding challenges and automated code review grading.
- **AI Proof OCR**: Automated optical character recognition to instantly cross-reference certificate serial numbers against issuing databases.

---

## 📄 License
MIT License. Built for university student empowerment and authentic recruitment.
