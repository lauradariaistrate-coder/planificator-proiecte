@echo off
title Dezinstalare Planificator Proiecte
powershell -NoProfile -ExecutionPolicy Bypass -Command "$s=[IO.File]::ReadAllText('%~f0'); iex $s.Substring($s.LastIndexOf('#'+'PSSTART'))"
goto :eof
#PSSTART
$name = 'Planificator Proiecte'
foreach ($t in @((Join-Path ([Environment]::GetFolderPath('Desktop')) "$name.lnk"), (Join-Path ([Environment]::GetFolderPath('Programs')) "$name.lnk"))) { if (Test-Path $t) { Remove-Item $t -Force } }
if (Test-Path 'HKCU:\Software\Classes\planificator') { Remove-Item 'HKCU:\Software\Classes\planificator' -Recurse -Force }
$n = Join-Path $env:LOCALAPPDATA 'PlanificatorNotificari\notificare.ps1'
if (Test-Path $n) { $c = [IO.File]::ReadAllText($n); $c = $c -replace '\$url = "planificator:open"', '$url = "https://claude.ai/artifact/DJyAtkeNjuJaPtDTwd28rm"'; [IO.File]::WriteAllText($n, $c, (New-Object Text.UTF8Encoding($true))) }
$dir = Join-Path $env:LOCALAPPDATA 'PlanificatorBrisk'
Start-Sleep -Seconds 1
if (Test-Path $dir) { Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue }
Write-Host 'Aplicatia Planificator a fost dezinstalata. Datele raman in planificator (contul Claude).' -ForegroundColor Green
Read-Host 'Apasa Enter ca sa inchizi'
