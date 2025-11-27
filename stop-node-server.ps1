# stop-node-server.ps1
# Finds Node processes that were started with `server.js` in their command line and stops them.
# Usage: Run from the project folder (or anywhere). Requires permission to stop the processes.

$ErrorActionPreference = 'Continue'
Write-Host "Searching for node processes with 'server.js' in the command line..." -ForegroundColor Cyan

try {
    $matches = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -and ($_.CommandLine -match 'server\.js') }
} catch {
    Write-Host "Failed to query processes: $_" -ForegroundColor Yellow
    $matches = @()
}

if ($matches -and $matches.Count -gt 0) {
    foreach ($p in $matches) {
        $pid = $p.ProcessId
        $cmd = $p.CommandLine
        Write-Host "Stopping PID $pid -- $cmd" -ForegroundColor Yellow
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Stopped process $pid" -ForegroundColor Green
        } catch {
            Write-Host "Failed to stop $pid: $_" -ForegroundColor Red
        }
    }
    exit 0
}

# If none found by command line, list node processes and offer to stop them
Write-Host "No processes with 'server.js' in the command line were found." -ForegroundColor Yellow
$nodeProcs = Get-Process -Name node -ErrorAction SilentlyContinue
if (-not $nodeProcs) {
    Write-Host "No 'node' processes are currently running." -ForegroundColor Green
    exit 0
}

Write-Host "Found the following 'node' processes:" -ForegroundColor Cyan
$nodeProcs | Format-Table Id, ProcessName, StartTime -AutoSize

$answer = Read-Host "Do you want to stop all shown 'node' processes? (y/N)"
if ($answer -match '^(y|Y)') {
    foreach ($np in $nodeProcs) {
        try {
            Stop-Process -Id $np.Id -Force -ErrorAction Stop
            Write-Host "Stopped PID $($np.Id)" -ForegroundColor Green
        } catch {
            Write-Host "Failed to stop PID $($np.Id): $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No processes were stopped." -ForegroundColor Yellow
}
