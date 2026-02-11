@echo off
echo ========================================
echo  Restarting Next.js Dev Server
echo ========================================
echo.

echo [1/3] Killing processes on port 3000...
powershell -ExecutionPolicy Bypass -File "%~dp0kill-port-3000.ps1"

echo.
echo [2/3] Cleaning lock file...
if exist ".next\dev\lock" (
    del /F /Q ".next\dev\lock" 2>nul
    echo Lock file removed
) else (
    echo No lock file found
)

echo.
echo [3/3] Starting dev server...
echo ========================================
echo.
npm run dev
