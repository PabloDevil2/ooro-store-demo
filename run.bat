@echo off
REM Ooro Store Demo — Quick Start Script for Windows
REM This script sets up and runs the dashboard locally

setlocal enabledelayedexpansion

echo.
echo 🚀 Ooro Store Demo — Starting...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detected
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

REM Start dev server
echo 🔥 Starting dev server...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Dashboard is running!
echo.
echo 📍 Open your browser and navigate to:
echo    http://localhost:5173
echo.
echo 🔐 Demo Login Credentials:
echo    Email:    admin@oorostore.com
echo    Password: Admin@12345
echo.
echo ℹ️  Running in DEMO MODE ^(no backend required^)
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start the dev server
call npm run dev

pause
