@echo off
setlocal

cd /d "%~dp0"

where powershell.exe >nul 2>nul
if errorlevel 1 (
  echo PowerShell not found. Cannot run preview.ps1
  pause
  exit /b 1
)

powershell.exe -ExecutionPolicy Bypass -File "%~dp0preview.ps1"

if errorlevel 1 (
  echo.
  echo Preview server failed to start. Check the messages above.
  pause
  exit /b 1
)
