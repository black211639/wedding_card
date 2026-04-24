$ErrorActionPreference = "Stop"

if ($null -ne (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue)) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

function Fail($message) {
  Write-Host ""
  Write-Host $message -ForegroundColor Red
  exit 1
}

function Run-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Args
  )

  & git @Args
  if ($LASTEXITCODE -ne 0) {
    Fail ("Git command failed: git " + ($Args -join " "))
  }
}

function Get-GitConfigValue {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Args
  )

  $result = & git @Args 2>$null
  if ($LASTEXITCODE -ne 0) {
    return ""
  }

  return ($result | Out-String).Trim()
}

if (-not (Test-Path (Join-Path $repoRoot ".git"))) {
  Fail "Missing .git. This folder is not a Git repository."
}

& git --version *> $null
if ($LASTEXITCODE -ne 0) {
  Fail "Git was not found. Please install Git first."
}

$currentBranch = (& git branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) {
  Fail "Could not determine the current branch."
}

if ([string]::IsNullOrWhiteSpace($currentBranch)) {
  Run-Git -Args @("checkout", "-b", "main")
  $currentBranch = "main"
}

if ($currentBranch -ne "main") {
  Write-Host "Current branch is $currentBranch. Switching to main..." -ForegroundColor Yellow
  Run-Git -Args @("checkout", "main")
}

$remoteUrl = (& git remote get-url origin 2>$null).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($remoteUrl)) {
  Fail "Remote origin was not found. Configure the GitHub remote first."
}

$gitUserName = Get-GitConfigValue -Args @("config", "--get", "user.name")
$gitUserEmail = Get-GitConfigValue -Args @("config", "--get", "user.email")

if ([string]::IsNullOrWhiteSpace($gitUserName)) {
  do {
    $gitUserName = Read-Host "Git user.name is not set. Enter the name to use for this repository"
  } while ([string]::IsNullOrWhiteSpace($gitUserName))

  Run-Git -Args @("config", "user.name", $gitUserName)
}

if ([string]::IsNullOrWhiteSpace($gitUserEmail)) {
  do {
    $gitUserEmail = Read-Host "Git user.email is not set. Enter the email to use for this repository"
  } while ([string]::IsNullOrWhiteSpace($gitUserEmail))

  Run-Git -Args @("config", "user.email", $gitUserEmail)
}

$status = (& git status --porcelain)
if ($LASTEXITCODE -ne 0) {
  Fail "Could not read git status."
}

if (-not $status) {
  Write-Host ""
  Write-Host "No changes detected. Nothing to upload." -ForegroundColor Yellow
  exit 0
}

$hasCommit = $true
& git rev-parse --quiet --verify HEAD > $null 2>&1
if ($LASTEXITCODE -ne 0) {
  $hasCommit = $false
}

if (-not $hasCommit) {
  Write-Host ""
  Write-Host "First sync with the existing GitHub repo." -ForegroundColor Yellow
  Write-Host "Creating the first local commit before merging remote main..." -ForegroundColor Yellow
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = Read-Host "Enter commit message (press Enter to use the default message)"

if ([string]::IsNullOrWhiteSpace($commitMessage)) {
  $commitMessage = "update wedding card $timestamp"
}

Write-Host ""
Write-Host "Uploading to GitHub..." -ForegroundColor Cyan

Run-Git -Args @("add", ".")
Run-Git -Args @("commit", "-m", $commitMessage)

if (-not $hasCommit) {
  Run-Git -Args @("pull", "origin", "main", "--allow-unrelated-histories", "--no-rebase", "--no-edit")
}

Run-Git -Args @("push", "-u", "origin", "main")

Write-Host ""
Write-Host "Push completed." -ForegroundColor Green
Write-Host "GitHub Pages should refresh in a few minutes." -ForegroundColor Green
