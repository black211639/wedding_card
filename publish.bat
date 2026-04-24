@echo off
setlocal

cd /d "%~dp0"

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo PowerShell not found. Cannot run publish.ps1
  pause
  exit /b 1
)

powershell.exe -ExecutionPolicy Bypass -File "%~dp0publish.ps1"

if errorlevel 1 (
  echo.
  echo Upload failed. Check the messages above.
  pause
  exit /b 1
)

echo.
echo Done. Press any key to close.
pause >nul
