$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

function Fail($message) {
  Write-Host ""
  Write-Host $message -ForegroundColor Red
  exit 1
}

function Get-PythonCommand {
  $candidates = @("py", "python")

  foreach ($candidate in $candidates) {
    try {
      & $candidate --version *> $null

      if ($LASTEXITCODE -eq 0) {
        return $candidate
      }
    } catch {
    }
  }

  return $null
}

$pythonCommand = Get-PythonCommand

if (-not $pythonCommand) {
  Fail "Python was not found. Install Python 3 and make sure py or python works in PowerShell, then run this script again."
}

$url = "http://127.0.0.1:8000"

Write-Host ""
Write-Host "Starting local preview server..." -ForegroundColor Cyan
Write-Host "Project folder: $repoRoot" -ForegroundColor DarkGray
Write-Host "Preview URL: $url" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

if ($pythonCommand -eq "py") {
  & py -m http.server 8000
} elseif ($pythonCommand -eq "python") {
  & python -m http.server 8000
} else {
  & $pythonCommand -m http.server 8000
}
