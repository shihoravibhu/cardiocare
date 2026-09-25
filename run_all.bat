@echo off
title CardioCare Launcher
cd /d "%~dp0"

echo ========================================================
echo         Starting CardioCare Platform
echo ========================================================
echo.

echo [1/3] Starting FastAPI Backend on port 8001...
start "CardioCare Backend (Port 8001)" cmd /k "cd /d "%~dp0backend" && python app.py"

echo [2/3] Starting React Frontend on port 5173...
start "CardioCare React Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend\react" && npm run dev"

echo [3/3] Opening Browser...
timeout /t 3 >nul
start http://localhost:5173

echo.
echo ========================================================
echo  All services launched! Keep the CMD windows open.
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:8001
echo   - API Docs: http://localhost:8001/docs
echo ========================================================
pause
