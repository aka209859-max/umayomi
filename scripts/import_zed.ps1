# JRDB ZED Import Script for Windows PowerShell
# Usage: .\import_zed.ps1

Write-Host "🚀 JRDB ZED Data Import Script" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DataPath = "E:\test_zed\ZED*.txt"
$StartDate = "2014-01-01"
$EndDate = "2025-08-24"

Write-Host "📋 Settings:" -ForegroundColor Yellow
Write-Host "  Data Path  : $DataPath"
Write-Host "  Start Date : $StartDate"
Write-Host "  End Date   : $EndDate"
Write-Host ""

# Check if files exist
$FileCount = (Get-ChildItem $DataPath -ErrorAction SilentlyContinue).Count

if ($FileCount -eq 0) {
    Write-Host "❌ Error: No files found at $DataPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solution:" -ForegroundColor Yellow
    Write-Host "  1. Copy all ZED files to E:\test_zed\"
    Write-Host "     Copy-Item E:\UMAYOMI\jrdb_data\PACI*\ZED*.txt E:\test_zed\ -Force"
    Write-Host ""
    Write-Host "  2. Or update `$DataPath in this script to your data location"
    Write-Host ""
    exit 1
}

Write-Host "✅ Found $FileCount files" -ForegroundColor Green
Write-Host ""

# Confirm
$Confirm = Read-Host "Start import? (Y/n)"
if ($Confirm -eq "n" -or $Confirm -eq "N") {
    Write-Host "❌ Import cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📥 Starting import..." -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location $PSScriptRoot\..

# Run import script
npx tsx scripts/import_jrdb_zed_standalone.ts $DataPath $StartDate $EndDate

Write-Host ""
Write-Host "✅ Script completed!" -ForegroundColor Green
Write-Host ""

# Wait for key press
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
