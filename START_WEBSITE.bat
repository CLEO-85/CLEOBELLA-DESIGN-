@echo off
REM Start CLEOBELLA DESING Website

cd /d "%~dp0"

echo.
echo   ================================
echo   CLEOBELLA DESING Website Server
echo   ================================
echo.
echo   Opening website at: http://localhost:8000
echo.

REM Use Python built-in server if available
python -m http.server 8000

REM If Python not available, use PowerShell
if errorlevel 1 (
    echo.
    echo   Python not found. Starting PowerShell HTTP Server...
    echo.
    powershell -NoProfile -Command "
    $port = 8000
    $root = Get-Location
    $listener = [System.Net.HttpListener]::new()
    $listener.Prefixes.Add('http://localhost:' + $port + '/')
    $listener.Start()
    Write-Host 'Server started at http://localhost:' $port -ForegroundColor Green
    start 'http://localhost:' + $port
    while($true) {
        $context = $listener.GetContext()
        $path = $context.Request.Url.LocalPath
        if($path -eq '/') { $path = '/index.html' }
        $file = Join-Path $root $path.TrimStart('/')
        if(Test-Path $file) {
            $context.Response.ContentType = 'text/html'
            $content = [System.IO.File]::ReadAllBytes($file)
            $context.Response.OutputStream.Write($content, 0, $content.Length)
        }
        $context.Response.Close()
    }
    "
)

pause
