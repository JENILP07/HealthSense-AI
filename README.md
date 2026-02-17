# HealthSense-AI: Cardiovascular Risk Prediction

HealthSense-AI (Vital Clarity Engine) is a full-stack health technology application that predicts the risk of cardiovascular disease using machine learning. By analyzing key health metrics like blood pressure, cholesterol, and lifestyle factors, it provides users with an instant risk assessment.

## 🚀 Features

- **Predictive Analytics:** Uses a Gradient Boosting model to assess heart disease risk.
- **Interactive UI:** A modern, responsive dashboard built with React and shadcn/ui.
- **Real-time Assessment:** Instant probability scores and risk labels (High/Low).
- **Comprehensive Metrics:** Analyzes age, BMI, blood pressure, glucose, and more.
- **Visual Insights:** Risk gauges and charts for better data interpretation.

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI
- **ML Library:** scikit-learn
- **Data Handling:** Pandas, NumPy
- **Server:** Uvicorn

### Frontend
- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** TanStack Query (React Query)
- **API Client:** Axios

## 📂 Project Structure

```text
HealthSense-AI/
├── Backend/                # Python FastAPI server
│   ├── models/             # Trained ML models (.pkl)
│   ├── main.py             # API entry point
│   └── requirements.txt    # Python dependencies
└── Frontend/               # React Vite application
    ├── src/
    │   ├── api/            # API interaction logic
    │   ├── components/     # UI components
    │   ├── services/       # API service configuration
    │   └── pages/          # Main application views
    └── package.json        # Frontend dependencies
```

## ⚙️ Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or bun

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the API server:
   ```bash
   python main.py
   ```
   The API will run at `http://localhost:8000`.

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` in your browser.

## 🧪 Testing
The backend includes test scripts to verify API functionality:
```bash
cd Backend
python test_api.py
```

## 📝 License
This project is for educational purposes. See the license of the original dataset/model if applicable.
