@echo off
echo === Hollow Expense Tracker - Fix and Run ===
echo.

echo [1/3] Killing any existing Node processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Clearing Vite cache...
if exist "node_modules\.vite" (
    rd /s /q "node_modules\.vite"
    echo Cache cleared!
) else (
    echo No cache found.
)

echo [3/3] Starting dev server with fresh deps...
npm run dev -- --force

pause
