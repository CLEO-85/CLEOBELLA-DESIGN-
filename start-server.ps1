# Start CLEOBELLA DESING Website Server
# This script starts a simple HTTP server on port 8000

$port = 8000
$root = $PSScriptRoot

Write-Host "`n🎉 CLEOBELLA DESING Website Server" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green
Write-Host "📱 Open your browser at: http://localhost:$($port)" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$($port)/")
$listener.Start()

# Auto-open browser
Start-Process "http://localhost:$($port)"

# Handle requests
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    # Get requested file path
    $path = $request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    
    $filePath = Join-Path $root $path.TrimStart('/')
    
    # Set content type
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $contentTypes = @{
        '.html' = 'text/html; charset=utf-8'
        '.css' = 'text/css'
        '.js' = 'application/javascript'
        '.jpg' = 'image/jpeg'
        '.jpeg' = 'image/jpeg'
        '.png' = 'image/png'
        '.gif' = 'image/gif'
        '.svg' = 'image/svg+xml'
        '.mp4' = 'video/mp4'
        '.webm' = 'video/webm'
        '.woff' = 'font/woff'
        '.woff2' = 'font/woff2'
    }
    $contentType = $contentTypes[$ext] -or 'application/octet-stream'
    
    # Serve file
    if (Test-Path $filePath -PathType Leaf) {
        $file = [System.IO.File]::OpenRead($filePath)
        $response.ContentType = $contentType
        $file.CopyTo($response.OutputStream)
        $file.Close()
        $response.StatusCode = 200
    } else {
        $response.StatusCode = 404
        $response.ContentType = 'text/plain'
        $notFound = '404 - File not found'
        $response.OutputStream.Write([System.Text.Encoding]::UTF8.GetBytes($notFound), 0, $notFound.Length)
    }
    
    $response.Close()
}

$listener.Close()
