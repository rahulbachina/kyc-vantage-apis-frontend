@echo off
echo ========================================
echo  Fixing 404 Error - Full Clean Restart
echo ========================================
echo.

echo [1/4] Stopping all Node processes...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    taskkill /F /IM node.exe >nul 2>&1
    echo Node processes stopped
) else (
    echo No Node processes running
)

timeout /t 2 /nobreak >nul

echo.
echo [2/4] Cleaning .next cache...
if exist ".next" (
    rmdir /S /Q ".next"
    echo Cache cleaned
) else (
    echo No cache to clean
)

echo.
echo [3/4] Cleaning lock file...
if exist ".next\dev\lock" (
    del /F /Q ".next\dev\lock" 2>nul
    echo Lock file removed
)

echo.
echo [4/4] Starting fresh dev server...
echo ========================================
echo.
echo Please wait while rebuilding...
echo.
npm run dev
