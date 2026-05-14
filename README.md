# 💰 Finance Tracker

A full-stack finance management application to track your income, expenses, and transactions. This project features a **Django REST API** backend and a **React + Vite** frontend, providing a complete solution for personal finance tracking.

## 🚀 Live Demo
- [Finance-Track](https://deepak-finance-track.netlify.app/)
- **Backend Status**: ⚠️ *Free tier service – spins down after 15 minutes of inactivity. Initial load may take 30-40 seconds.*

---
## ✨ Features

- ✅ **Transaction Management** – Add, edit, and delete income/expense records
- ✅ **Category Tracking** – Organize transactions by customizable categories
- ✅ **Dashboard Overview** – Visual summaries of your financial health
- ✅ **RESTful API** – Clean, documented API endpoints
- ✅ **Responsive Design** – Works seamlessly on desktop and mobile devices
- ✅ **CORS Enabled** – Frontend can securely communicate with the backend API

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, React Router 7, Axios, Tailwind CSS |
| **Backend** | Django 6.0, Django REST Framework, django-cors-headers |
| **Database** | SQLite  |
| **Deployment** | Netlify (frontend), Render (backend) |

## 📁 Project Structure

```
Finance-Tracker-SPCL/
├── backend/                 # Django backend
│   ├── finance_track/       # Project configuration
│   ├── app/                 # Main application (models, views, serializers)
│   ├── db.sqlite3           # Local database
│   ├── manage.py
│   └── requirements.txt
├── frontend/                # React + Vite frontend
│   ├── src/                 # Source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/        # API calls
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 💻 Local Development Setup

### Prerequisites

- **Python 3.12+** and **pip**
- **Node.js 18+** and **npm**

### Backend (Django) Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000`

### Frontend (React + Vite) Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_URL=http://localhost:8000/api/
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The application will open at `http://localhost:5173`

## 🔌 API Endpoints

The backend provides the following main endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/` | List all transactions |
| POST | `/api/transactions/` | Create a new transaction |
| GET | `/api/transactions/<id>/` | Retrieve a specific transaction |
| PUT/PATCH | `/api/transactions/<id>/` | Update a transaction |
| DELETE | `/api/transactions/<id>/` | Delete a transaction |
| GET | `/api/categories/` | List all categories |
| GET | `/api/dashboard/` | Get summary statistics |

> **Note**: All endpoints are relative to your backend URL (e.g., `http://localhost:8000` in development, or `https://finance-tracker-spcl.onrender.com` in production).

## 🚢 Deployment

### Backend Deployment (Render)

1. Push your backend code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Use these settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn finance_track.wsgi:application`
   - **Python Version**: 3.12
5. Click **Deploy**

> ⚠️ **Note**: The free tier spins down after 15 minutes of inactivity. The first request after sleep will take 30-60 seconds to respond.

### Frontend Deployment (Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy using Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod --dir=dist
   ```

   Or connect your GitHub repository to Netlify for automatic deploys.

3. **Important**: Set the production API URL as an environment variable in Netlify:
   ```bash
   netlify env:set VITE_API_URL "https://finance-tracker-spcl.onrender.com/api/"
   ```

   Then rebuild and redeploy:
   ```bash
   npm run build && netlify deploy --prod --dir=dist
   ```

## 🔐 Environment Variables

### Frontend (Vite)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8000/
```

For production, set `VITE_API_URL` to your live backend URL.

## 🔮 Future Improvements

- [ ] User authentication (login/signup)
- [ ] Data visualization charts (Chart.js or Recharts)
- [ ] Export transactions to CSV/PDF
- [ ] Budget planning feature
- [ ] Recurring transactions
- [ ] Dark mode toggle
- [ ] Docker containerization
- [ ] Comprehensive test suite


## 📄 License

This project is open source and available under the **MIT License**.

## 🙏 Acknowledgements

- Built with Django REST Framework and React
- Icons by FontAwesome (via React Icons)
- Styling with Tailwind CSS
- Deployed on Render (backend) and Netlify (frontend)

---

## 📬 Contact

**Deepak Maharana**  
- GitHub: [@deepakmaharana278](https://github.com/deepakmaharana278)
- Project Repository: [Finance-Tracker-SPCL](https://github.com/deepakmaharana278/Finance-Tracker-SPCL)

---

<div align="center">
  Made with 💰 for better financial tracking
</div>

