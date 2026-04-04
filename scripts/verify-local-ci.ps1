# Local backup check before Jenkins (Windows PowerShell)
# Uses npm install (forgiving on Windows file locks). Jenkins uses npm ci in Jenkinsfile.
# Run from repo root:  .\scripts\verify-local-ci.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

function Invoke-NpmStep {
    param([string[]]$Arguments)
    & npm @Arguments
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host "== Server: npm install + test:coverage ==" -ForegroundColor Cyan
Set-Location "$root\server"
Invoke-NpmStep @("install")
Invoke-NpmStep @("run", "test:coverage")

Write-Host "== Client: npm install + test:coverage + build ==" -ForegroundColor Cyan
Set-Location "$root\client"
Invoke-NpmStep @("install")
Invoke-NpmStep @("run", "test:coverage")
Invoke-NpmStep @("run", "build")

Write-Host "== OK - ready for Jenkins / Sonar (sonar-scanner runs on CI) ==" -ForegroundColor Green
Set-Location $root
