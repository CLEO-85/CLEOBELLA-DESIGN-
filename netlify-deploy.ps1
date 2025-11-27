<#
netlify-deploy.ps1

This helper script will:
- Check for Netlify CLI (`netlify`) and offer to install it via `npm` if missing.
- Run `netlify login` (opens browser) if not authenticated.
- Run `netlify deploy --dir=. --prod` to deploy the current folder as a site.

Notes:
- You must have Node/npm installed (you do).
- `netlify deploy` is interactive when it needs to create or connect a site. Follow prompts.
- To create a site non-interactively you can create a site in the Netlify dashboard and use `netlify link --id <SITE_ID>`.

Usage:
Set-Location 'C:\Users\USER\Desktop\New folder (5)'
powershell -NoProfile -ExecutionPolicy Bypass -File .\netlify-deploy.ps1
# Then follow interactive prompts (login, site creation/selection)
# The script prints the deploy URL and the production URL (if you promote the deploy).
#>

$ErrorActionPreference = 'Stop'
$cwd = Get-Location
Write-Host "Netlify deploy helper — working folder: $cwd" -ForegroundColor Cyan

# Check for netlify CLI
$netlifyCmd = Get-Command netlify -ErrorAction SilentlyContinue
if (-not $netlifyCmd) {
    Write-Host "Netlify CLI not found. I can install it globally using npm (requires admin privileges)." -ForegroundColor Yellow
    $yn = Read-Host "Install netlify-cli globally now? (Y/n)"
    if ($yn -eq '' -or $yn -match '^(y|Y)') {
        Write-Host "Installing netlify-cli... this may take a minute."
        npm install -g netlify-cli
        $netlifyCmd = Get-Command netlify -ErrorAction SilentlyContinue
        if (-not $netlifyCmd) { Write-Host "Installation failed or netlify not on PATH. Try opening a new terminal or install manually." -ForegroundColor Red; exit 1 }
    } else {
        Write-Host "Skipping install. Exiting." -ForegroundColor Yellow
        exit 0
    }
}

# Ensure user is logged in
try {
    $whoami = netlify status 2>&1
    if ($whoami -match 'You are not logged in' -or $whoami -match 'Not logged in') {
        throw "not-logged-in"
    }
    Write-Host "Netlify CLI status:" -ForegroundColor Green; Write-Host $whoami
} catch {
    Write-Host "You need to log into Netlify in your browser. The CLI will open a login page now." -ForegroundColor Yellow
    netlify login
    Write-Host "After logging in, press Enter to continue..."; Read-Host
}

# Deploy (interactive). This will prompt to create/select a site if necessary.
Write-Host "Starting interactive deploy. Follow CLI prompts to create or select a site." -ForegroundColor Cyan
netlify deploy --dir="$cwd" --prod

Write-Host "Deploy finished (check the CLI output above for the site URL and deploy status)." -ForegroundColor Green
Write-Host "If the site was created during deploy, you can record the site ID and run 'netlify link --id <SITE_ID>' later to link this folder non-interactively." -ForegroundColor Yellow
