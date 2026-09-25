@echo off
title CardioCare Automated Test Suite
cd /d "%~dp0"

echo ========================================================
echo        Running CardioCare Full Test Suite
echo ========================================================
echo.

python backend\test_suite.py

echo.
pause
