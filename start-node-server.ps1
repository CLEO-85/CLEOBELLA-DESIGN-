# start-node-server.ps1 — ensures Node folder is on PATH for this session, verifies node/npm, starts server.js, and checks HTTP
$ErrorActionPreference = 'Stop'
$nodePath = 'C:\Program Files\nodejs'
if (-not (Test-Path $nodePath)) {
  Write-Host "Node install not found at $nodePath. Please install Node or update the path in this script." -ForegroundColor Red
  exit 1
}
# Add to PATH for this session
if (-not ($env:Path -split ';' | Where-Object { $_ -ieq $nodePath })) {
  $env:Path = $env:Path + ';' + $nodePath
  Write-Host "Added $nodePath to PATH for this PowerShell session"
} else {
  Write-Host "$nodePath already in PATH for this session"
}
# Verify versions
Write-Host "node version: $(node -v)"
Write-Host "npm version: $(npm -v)"
# Start server.js in a new process
Write-Host 'Starting server.js ...'
$proc = Start-Process -FilePath 'node' -ArgumentList 'server.js' -WorkingDirectory (Get-Location) -PassThru
Start-Sleep -Seconds 2
Write-Host "Started node process id: $($proc.Id)"
# Test HTTP
try {
  $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 5
  Write-Host "HTTP test succeeded: $($r.StatusCode)"
} catch {
  Write-Host "HTTP test failed: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host "If the server is running, open http://localhost:3000 in your browser."