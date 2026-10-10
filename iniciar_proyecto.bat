@echo off
chcp 65001 >nul
echo ========================================================
echo  Iniciando Plataforma de Minería de Datos
echo ========================================================
echo.

set PHP_EXE=C:\xampp\php\php.exe

if not exist "%PHP_EXE%" (
    echo [ERROR] No se encontro PHP en %PHP_EXE%.
    echo Por favor verifique la instalacion de XAMPP.
    pause
    exit /b 1
)

echo [1/3] Iniciando Servidor PHP Backend en http://localhost:8000...
start "Backend PHP - Mineria de Datos" "%PHP_EXE%" -S localhost:8000

echo [2/3] Iniciando Frontend React (Vite) en http://localhost:5173...
cd /d "%~dp0frontend"
start "Frontend React - Mineria de Datos" cmd /c "npm run dev"

echo [3/3] Abriendo aplicativo en el navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================================
echo  Proyecto corriendo con exito:
echo  - Aplicacion React (La Maquina): http://localhost:5173
echo  - Interfaz Grafica PHP:          http://localhost:8000/index.php
echo  - API PHP:                       http://localhost:8000/api/index.php
echo ========================================================
echo.
