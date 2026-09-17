# AegisNet - Full Stack Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🛡️  AegisNet — Full Stack Environmental Mesh Launching" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start AI Microservice (FastAPI on port 8000)
Write-Host "[1/3] Starting FastAPI Cloud Correlation AI Microservice..." -ForegroundColor Yellow
$aiProcess = Start-Process python -ArgumentList "-m uvicorn main:app --host 127.0.0.1 --port 8000" -WorkingDirectory "$PSScriptRoot\ai-service" -PassThru

# 2. Start Express / Socket.IO Backend (Port 5001)
Write-Host "[2/3] Starting Express + Socket.IO Real-Time Backend..." -ForegroundColor Yellow
$backendProcess = Start-Process npm -ArgumentList "start" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

# 3. Start Frontend Dashboard (Vite on Port 5180)
Write-Host "[3/3] Starting Vite React 18 Ops Dashboard..." -ForegroundColor Yellow
$frontendProcess = Start-Process npm -ArgumentList "run dev -- --port 5180 --host" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "✅ All AegisNet Services Running:" -ForegroundColor Green
Write-Host "  - Frontend Ops Dashboard: http://localhost:5180" -ForegroundColor White
Write-Host "  - Backend API Gateway:   http://localhost:5001" -ForegroundColor White
Write-Host "  - AI Microservice:       http://localhost:8000/docs" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "To simulate live mesh traffic, open another terminal and run:" -ForegroundColor Cyan
Write-Host "  python simulator/mesh_simulator.py --scenario flood" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
