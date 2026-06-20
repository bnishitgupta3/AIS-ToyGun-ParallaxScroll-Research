# ─────────────────────────────────────────────────────────────────────────────
# deploy-coming-soon.ps1
# One-command deploy for the standalone SONIQ Toys "Coming Soon" teaser.
#
# Run this from the `coming-soon` branch:  ./deploy-coming-soon.ps1
#
# It will:
#   1. Build the React app (frontend/) into frontend/build
#   2. Sync the build to the private S3 bucket (Mumbai)
#   3. Invalidate the CloudFront cache so visitors get the new version
#
# Notes:
#   * --no-verify-ssl is required because of corporate TLS interception.
#   * The site is served at https://www.soniqtoys.com via CloudFront.
# ─────────────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

# --- Config (see memory/coming-soon-hosting.md) ---
$Bucket   = "soniqtoys-coming-soon"
$DistId   = "E2KXHFJGLHTY83"
$Region   = "ap-south-1"
$Frontend = Join-Path $PSScriptRoot "frontend"
$Build    = Join-Path $Frontend "build"

Write-Host "==> Building frontend..." -ForegroundColor Cyan
Push-Location $Frontend
$env:CI = "false"
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Build failed." }
Pop-Location

Write-Host "==> Syncing build to s3://$Bucket ..." -ForegroundColor Cyan
aws s3 sync $Build "s3://$Bucket" --delete --region $Region --no-verify-ssl
if ($LASTEXITCODE -ne 0) { throw "S3 sync failed." }

Write-Host "==> Invalidating CloudFront cache ($DistId) ..." -ForegroundColor Cyan
aws cloudfront create-invalidation --distribution-id $DistId --paths "/*" --no-verify-ssl
if ($LASTEXITCODE -ne 0) { throw "CloudFront invalidation failed." }

Write-Host ""
Write-Host "Done. Live at https://www.soniqtoys.com (allow ~1-2 min for the invalidation)." -ForegroundColor Green
