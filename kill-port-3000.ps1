# Kill processes using port 3000
Write-Host "Finding processes on port 3000..." -ForegroundColor Yellow

$connections = netstat -ano | Select-String ":3000"
$pids = @()

foreach ($line in $connections) {
    if ($line -match '\s+(\d+)\s*$') {
        $pid = $matches[1]
        if ($pid -and $pid -ne "0" -and $pids -notcontains $pid) {
            $pids += $pid
        }
    }
}

if ($pids.Count -eq 0) {
    Write-Host "No processes found on port 3000" -ForegroundColor Green
    exit 0
}

Write-Host "Found $($pids.Count) process(es) using port 3000:" -ForegroundColor Cyan
foreach ($pid in $pids) {
    try {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "  - PID $pid ($($process.ProcessName))" -ForegroundColor White
        }
    } catch {
        Write-Host "  - PID $pid" -ForegroundColor White
    }
}

Write-Host "`nKilling processes..." -ForegroundColor Yellow
foreach ($pid in $pids) {
    try {
        Stop-Process -Id $pid -Force -ErrorAction Stop
        Write-Host "  ✓ Killed PID $pid" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Failed to kill PID $pid : $_" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Green
