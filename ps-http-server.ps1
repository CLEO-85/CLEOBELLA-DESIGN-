# Simple PowerShell HTTP server (serves current directory)
$Prefix = "http://localhost:3000/"
$Root = Get-Location
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Prefix)
try {
    $Listener.Start()
    Write-Host "Serving $($Root.Path) on $Prefix"
    while ($Listener.IsListening) {
        $Context = $Listener.GetContext()
        Start-Job -ArgumentList $Context,$Root -ScriptBlock {
            param($Context,$Root)
            try {
                $Request = $Context.Request
                $Response = $Context.Response
                $urlPath = $Request.Url.AbsolutePath
                if ($urlPath -eq "/") { $file = Join-Path $Root "index.html" }
                else {
                    $rel = $urlPath.TrimStart('/').Replace('/','\\')
                    $file = Join-Path $Root $rel
                }
                if (-not (Test-Path $file)) {
                    $Response.StatusCode = 404
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
                    $Response.OutputStream.Write($buffer,0,$buffer.Length)
                    $Response.Close()
                    return
                }
                $bytes = [System.IO.File]::ReadAllBytes($file)
                $ext = [System.IO.Path]::GetExtension($file).ToLower()
                switch ($ext) {
                    '.html' { $type='text/html' }
                    '.css'  { $type='text/css' }
                    '.js'   { $type='application/javascript' }
                    '.png'  { $type='image/png' }
                    '.jpg'  { $type='image/jpeg' }
                    '.jpeg' { $type='image/jpeg' }
                    '.svg'  { $type='image/svg+xml' }
                    '.mp4'  { $type='video/mp4' }
                    '.webm' { $type='video/webm' }
                    default { $type='application/octet-stream' }
                }
                $Response.ContentType = $type
                $Response.ContentLength64 = $bytes.Length
                $Response.OutputStream.Write($bytes,0,$bytes.Length)
                $Response.Close()
            } catch {
                try { $Context.Response.StatusCode = 500; $Context.Response.Close() } catch {}
            }
        } | Out-Null
    }
} catch {
    Write-Host "Server error: $_"
} finally {
    if ($Listener -and $Listener.IsListening) { $Listener.Stop(); $Listener.Close() }
}
