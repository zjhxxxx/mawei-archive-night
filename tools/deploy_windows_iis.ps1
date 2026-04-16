$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$RepoZipUrl = "https://github.com/zjhxxxx/mawei-archive-night/archive/refs/heads/main.zip"
$TempRoot = "C:\mawei-deploy-temp"
$ZipPath = Join-Path $TempRoot "site.zip"
$ExtractPath = Join-Path $TempRoot "site"
$SiteRoot = "C:\inetpub\wwwroot"
$BackupRoot = "C:\inetpub\site-backups"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Write-Step($message) {
  Write-Host "==> $message" -ForegroundColor Cyan
}

function Ensure-IIS {
  Import-Module ServerManager
  $feature = Get-WindowsFeature Web-Server
  if ($feature.InstallState -ne "Installed") {
    Write-Step "Installing IIS"
    Install-WindowsFeature Web-Server -IncludeManagementTools | Out-Null
  }
  Import-Module WebAdministration
}

function Ensure-DefaultDocument {
  $defaultDocFilter = "system.webServer/defaultDocument/files"
  $exists = Get-WebConfigurationProperty -PSPath "IIS:\" -Filter $defaultDocFilter -Name "." |
    Where-Object { $_.value -eq "index.html" }
  if (-not $exists) {
    Add-WebConfigurationProperty -PSPath "IIS:\" -Filter $defaultDocFilter -Name "." -Value @{value="index.html"}
  }
}

Write-Step "Preparing temporary workspace"
New-Item -ItemType Directory -Force -Path $TempRoot | Out-Null
Remove-Item -LiteralPath $ZipPath -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $ExtractPath -Recurse -Force -ErrorAction SilentlyContinue

Write-Step "Downloading latest site package from GitHub"
Invoke-WebRequest -Uri $RepoZipUrl -OutFile $ZipPath

Write-Step "Extracting package"
Expand-Archive -LiteralPath $ZipPath -DestinationPath $ExtractPath -Force

$ProjectRoot = Get-ChildItem $ExtractPath -Directory | Select-Object -First 1
if (-not $ProjectRoot) {
  throw "Extracted project directory was not found."
}

Write-Step "Ensuring IIS is installed"
Ensure-IIS
Ensure-DefaultDocument

Write-Step "Backing up current site"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
$BackupPath = Join-Path $BackupRoot $Timestamp
New-Item -ItemType Directory -Force -Path $BackupPath | Out-Null
if (Test-Path $SiteRoot) {
  Get-ChildItem $SiteRoot -Force | ForEach-Object {
    Copy-Item $_.FullName -Destination $BackupPath -Recurse -Force
  }
}

Write-Step "Replacing site files"
Get-ChildItem $SiteRoot -Force | Remove-Item -Recurse -Force
Copy-Item (Join-Path $ProjectRoot.FullName "index.html") $SiteRoot -Force
Copy-Item (Join-Path $ProjectRoot.FullName "styles.css") $SiteRoot -Force
Copy-Item (Join-Path $ProjectRoot.FullName "script.js") $SiteRoot -Force
Copy-Item (Join-Path $ProjectRoot.FullName "output") $SiteRoot -Recurse -Force

Write-Step "Restarting IIS"
Restart-Service W3SVC -Force

Write-Step "Smoke testing local HTTP"
$response = Invoke-WebRequest -Uri "http://127.0.0.1" -UseBasicParsing
if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 400) {
  throw "Local HTTP check failed with status code $($response.StatusCode)."
}

Write-Host ""
Write-Host "Deployment completed." -ForegroundColor Green
Write-Host "Site root  : $SiteRoot"
Write-Host "Backup path: $BackupPath"
Write-Host "HTTP check : $($response.StatusCode)"
