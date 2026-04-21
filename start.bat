@echo off
echo ========================================
echo    CarRent CI - Demarrage du serveur
echo ========================================
echo.

cd backend

echo [1/3] Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
)

echo.
echo [2/3] Demarrage du serveur backend...
echo Le serveur va demarrer sur http://localhost:5000
echo.
echo IMPORTANT: Ne fermez pas cette fenetre !
echo.
start cmd /k "npm start"

echo.
echo [3/3] Attente du demarrage du serveur...
timeout /t 4 /nobreak >nul

cd ..

echo.
echo Ouverture du site dans le navigateur...
start http://localhost:5000
timeout /t 2 /nobreak >nul
start http://localhost:5000/admin/admin.html

echo.
echo ========================================
echo    Serveur demarre avec succes !
echo ========================================
echo.
echo - Site web:        http://localhost:5000
echo - Dashboard admin: http://localhost:5000/admin/admin.html
echo - API:             http://localhost:5000/api/vehicles
echo.
echo Pour arreter le serveur, fermez la fenetre du serveur.
echo.
pause
