# GEMINI.md - Project Context

## Project Overview
**HealthSense-AI** (also referred to as "Vital Clarity Engine") is a cardiovascular risk prediction application. It leverages a Machine Learning model to analyze patient health metrics and provide a risk assessment for heart disease.

The project is divided into a **FastAPI backend** for ML inference and a **React frontend** for user interaction.

## Main Technologies
- **Backend:** 
  - [FastAPI](https://fastapi.tiangolo.com/): High-performance Python API framework.
  - [scikit-learn](https://scikit-learn.org/): Machine learning library used for the Gradient Boosting model.
  - [joblib](https://joblib.readthedocs.io/): Model serialization.
  - [pandas](https://pandas.pydata.org/) & [numpy](https://numpy.org/): Data manipulation.
- **Frontend:**
  - [React](https://reactjs.org/) (TypeScript): UI library.
  - [Vite](https://vitejs.dev/): Frontend build tool.
  - [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/): Styling and UI components.
  - [TanStack Query](https://tanstack.com/query/latest): Data fetching and state management.
  - [Axios](https://axios-http.com/): HTTP client.

## Architecture
- **API Communication:** The frontend sends patient data to the `/predict` endpoint of the backend.
- **Data Schema:** 
  - `PatientData` includes age, gender, height, weight, blood pressure (ap_hi, ap_lo), cholesterol, glucose, and lifestyle factors (smoke, alco, active).
- **Inference Pipeline:**
  - The backend loads a pre-trained Gradient Boosting model (`tuned_gb_best.pkl`), a scaler (`scaler.pkl`), and a probability threshold (`best_threshold.pkl`).
  - Input features are scaled and augmented with engineered features like BMI and categorical bins before prediction.

## Building and Running

### Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Navigate to the `Frontend` directory:
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
   The application will be accessible at `http://localhost:8080` (or the port specified by Vite).

## Key Files & Directories
- `Backend/main.py`: The entry point for the FastAPI application.
- `Backend/models/`: Contains the serialized machine learning artifacts.
- `Frontend/src/services/api.ts`: Centralized API service for communicating with the backend.
- `Frontend/src/components/HealthInputForm.tsx`: The primary form for patient data entry.
- `Frontend/src/components/PredictionResults.tsx`: Component for displaying prediction results and risk gauges.

## Development Conventions
- **Frontend:** Uses functional components with TypeScript. Component-based architecture with `shadcn/ui` for consistency.
- **Backend:** Pydantic models for request/response validation. Logging is implemented to track server status and prediction errors.
- **CORS:** Configured in `Backend/main.py` to allow requests from the frontend (defaults to `*` in development).
