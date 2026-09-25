# CardioCare AI — Production Deployment Guide
**Deploying Frontend on Vercel & Multi-Model Backend on Render**

---

## Architecture Overview

```
                                  +------------------------------------+
                                  |         Vercel (Frontend)          |
                                  |   https://cardiocare.vercel.app    |
                                  |   (React 18 + Vite + SPA Router)   |
                                  +-----------------+------------------+
                                                    |
                                                    | HTTPS REST API
                                                    | (VITE_API_URL)
                                                    v
                                  +------------------------------------+
                                  |          Render (Backend)          |
                                  |   https://cardiocare.onrender.com  |
                                  |   (FastAPI + Uvicorn + ML Models)  |
                                  +------------------------------------+
```

---

## Step 1: Push Code to GitHub (Prerequisite)

Both Render and Vercel automatically build and deploy directly from your GitHub repository.

1. Open your terminal in the project root directory:
   ```bash
   cd "C:\Users\shiho\Desktop\DU\Sem 5\Machine Learning\Project\Cardiovascular_Disease_Prediction2\Cardiovascular_Disease_Prediction_Fully_Integrated"
   ```

2. Initialize Git (if not already done):
   ```bash
   git init
   git branch -M main
   ```

3. Stage and commit the files (the provided `.gitignore` automatically excludes `venv` and `node_modules` while keeping the trained model `.pkl` files):
   ```bash
   git add .
   git commit -m "feat: complete CardioCare with mobile optimization and deployment configs"
   ```

4. Create a new repository on [GitHub](https://github.com/new) (e.g., named `CardioCare-AI`). Do not initialize with a README/license since code already exists.

5. Push your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/CardioCare-AI.git
   git push -u origin main
   ```

---

## Step 2: Deploy Backend on Render

Render will host the high-performance FastAPI server and both trained scikit-learn models (`HistGradientBoostingClassifier` and `RandomForestClassifier`).

### Option A: Using Render Web Service (Recommended & Simple)

1. Go to [Render Dashboard](https://dashboard.render.com/) and sign in.
2. Click the blue **"New +"** button in the top right and select **"Web Service"**.
3. Under **"Connect a repository"**, select your `CardioCare-AI` repository.
4. Fill in the following deployment parameters:
   - **Name**: `cardiocare-api` (or any unique name you prefer)
   - **Region**: Choose the region closest to you (e.g., *Singapore*, *Oregon*, or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: `backend` *(⚠️ Critical: must point to the backend directory)*
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`

5. Open **"Advanced Settings"** and add Environment Variables:
   - **Key**: `PYTHON_VERSION` &rarr; **Value**: `3.11.9`
   - **Key**: `ALLOWED_ORIGINS` &rarr; **Value**: `*` *(or your Vercel URL later)*

6. Click **"Deploy Web Service"**.
7. Wait 2–3 minutes for the build to finish. Once the status shows **"Live"**, copy your service URL:
   ```
   https://cardiocare-api-xxxx.onrender.com
   ```
8. **Verify Backend Health**:
   Open `https://cardiocare-api-xxxx.onrender.com/health` in your browser. You should see:
   ```json
   {
     "status": "ok",
     "model_loaded": true,
     "champion_active": true,
     "models_available": ["gradient_boosting", "random_forest"]
   }
   ```

> **Note on Render Free Tier**: Free web services spin down after 15 minutes of inactivity. When a new request arrives, it takes ~30–50 seconds to spin back up (cold start). Once active, inferences execute in sub-20ms.

---

## Step 3: Deploy Frontend on Vercel

Vercel will host the responsive React application with instant global edge caching and automatic SSL.

1. Go to [Vercel Dashboard](https://vercel.com/) and sign in.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your `CardioCare-AI` repository and click **"Import"**.
4. In the **"Configure Project"** settings:
   - **Project Name**: `cardiocare-ai` (or your preferred name)
   - **Framework Preset**: `Vite` *(auto-detected)*
   - **Root Directory**: Click **"Edit"** and select `frontend/react` *(⚠️ Critical! Do not leave as `./`)*
   - **Build and Output Settings**:
     - Build Command: `npm run build` *(default)*
     - Output Directory: `dist` *(default)*
     - Install Command: `npm install` *(default)*

5. Expand the **"Environment Variables"** section and add:
   - **NAME**: `VITE_API_URL`
   - **VALUE**: `https://cardiocare-api-xxxx.onrender.com` *(Paste your exact Render URL from Step 2 without a trailing slash)*

6. Click **"Deploy"**.
7. In about 30–45 seconds, Vercel will complete the build and provide a production URL:
   ```
   https://cardiocare-ai.vercel.app
   ```

---

## Step 4: Verification & Smoke Test

1. Open your Vercel URL in your desktop and mobile phone browser.
2. **Test Risk Engine (`/predictor`)**:
   - Tap **"Load High Risk Sample"** or adjust biometrics.
   - Click **"Run Risk Generator"**.
   - Verify that the LatticeLoader displays real-time progress and receives a clinical prediction payload with probability score and derived hemodynamics (BMI, pulse pressure, hypertension status).
3. **Test Model Benchmarks (`/insights`)**:
   - Verify the multi-model table displays the 6 evaluated architectures.
   - Verify column and row hover interactions and the mobile swipe hint pill.
4. **Test Mobile Navigation**:
   - Open on a smartphone viewport ($\le 640\text{px}$).
   - Tap the hamburger menu toggle to test the animated frosted-glass mobile navigation drawer.

---

## Troubleshooting Common Issues

| Issue | Cause | Solution |
|---|---|---|
| **Vercel returns 404 on page refresh** | SPA client-side routing not redirected to `index.html` | Ensure [`frontend/react/vercel.json`](file:///C:/Users/shiho/Desktop/DU/Sem%205/Machine%20Learning/Project/Cardiovascular_Disease_Prediction2/Cardiovascular_Disease_Prediction_Fully_Integrated/frontend/react/vercel.json) exists with rewrites to `/index.html` (already created). |
| **CORS error in browser console** | Backend rejecting requests from Vercel domain | We updated [`backend/main.py`](file:///C:/Users/shiho/Desktop/DU/Sem%205/Machine%20Learning/Project/Cardiovascular_Disease_Prediction2/Cardiovascular_Disease_Prediction_Fully_Integrated/backend/main.py) with regex `.*\.vercel\.app`. You can also set `ALLOWED_ORIGINS=*` on Render. |
| **Frontend connects to localhost in production** | `VITE_API_URL` not set in Vercel | Set `VITE_API_URL` in Vercel Project Settings &rarr; Environment Variables, then click "Redeploy". |
| **Render build fails on Python version** | Incompatible scikit-learn wheel | Set environment variable `PYTHON_VERSION=3.11.9` in Render. |
