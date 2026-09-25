# Cardiovascular Disease Prediction

## Frontend + Backend integration

The React **Risk Engine / Risk Generator** is fully connected to the FastAPI backend.

When the user clicks **Run Risk Generator**:

1. React collects the patient inputs.
2. React sends a `POST /predict` request to FastAPI.
3. FastAPI calculates BMI, pulse pressure and hypertension.
4. FastAPI sends the 14 required model features to `cardiovascular_model.pkl`.
5. The trained Random Forest model returns the prediction and probability.
6. FastAPI returns the result to React.
7. React displays the risk probability, risk status and derived features.

No prediction is calculated in the React frontend.

## Project structure

```text
Cardiovascular_Disease_Prediction/
├── backend/
│   ├── main.py
│   ├── cardiovascular_model.pkl
│   ├── requirements.txt
│   └── start_backend.bat
├── frontend/
│   ├── react/
│   │   ├── src/
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── start_frontend.bat
│   └── streamlit/
├── datasets/
├── processed_datasets/
└── notebooks/
```

## Run backend

Open CMD 1:

```bat
cd backend
python app.py
```

Backend:
- API: http://localhost:8001
- Health check: http://localhost:8001/health
- Swagger docs: http://localhost:8001/docs

## Run React frontend

Open CMD 2:

```bat
cd frontend\react
npm run dev
```

Frontend:
- http://localhost:5173

The frontend calls:

```text
POST http://localhost:8001/predict
```

You can change the API URL by creating `.env` inside `frontend/react`:

```text
VITE_API_URL=http://localhost:8001
```

## Quick start using batch files

## Quick Start (Easiest Method)

Simply double-click **`run_all.bat`** in the project root directory.
It will:
1. Start the FastAPI backend on `http://localhost:8001`
2. Start the React frontend on `http://localhost:5173`
3. Automatically open your browser to the platform

To run the automated 20-test verification suite, double-click **`test_all.bat`**.

## Individual Service Commands

Backend CMD:

```bat
cd backend
python app.py
```

Frontend CMD:

```bat
cd frontend\react
npm run dev
```

Backend:
- API: http://localhost:8001
- Health check: http://localhost:8001/health
- Swagger docs: http://localhost:8001/docs

### Frontend

Open a second CMD and go to:

```bat
cd frontend\react
```

Then simply run:

```bat
npm run dev
```

Open the Vite URL shown in the terminal, normally:

`http://localhost:5173`

### First-time setup only

If this is a fresh computer/project copy, install backend packages once:

```bat
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

And install frontend packages once:

```bat
cd frontend\react
npm install
```

After that, normal startup is only:

**CMD 1**
```bat
cd backend
python app.py
```

**CMD 2**
```bat
cd frontend\react
npm run dev
```
