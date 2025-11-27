@echo off
cd /d "%~dp0"
echo Starting CLEOBELLA DESING Website Server...
echo.
echo Opening website at: http://localhost:8000
timeout /t 2
start http://localhost:8000
cd /d "%~dp0"
powershell -Command "$ProgressPreference='SilentlyContinue'; $root='%cd%'; while($true) { $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $file = Join-Path $root $request.Url.LocalPath; if($request.Url.LocalPath -eq '/') { $file = Join-Path $root 'index.html' }; if(Test-Path $file -PathType Leaf) { $ext = [IO.Path]::GetExtension($file); $contentType = @{'.html'='text/html';'.css'='text/css';'.js'='application/javascript';'.jpg'='image/jpeg';'.png'='image/png';'.gif'='image/gif';'.mp4'='video/mp4';'.webm'='video/webm'}[$ext] -or 'application/octet-stream'; $response.ContentType = $contentType; [IO.File]::OpenRead($file) | %{ $response.OutputStream.Write($_,0,_.Length) }; $response.OutputStream.Close() } else { $response.StatusCode = 404; $response.Close() }; $listener.Close() }"
