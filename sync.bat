@echo off
echo Menyinkronkan ke GitHub...
cd C:\Users\Administrator\dev-workspace
git add .
git commit -m "sync: %date% %time%"
git push origin main
echo.
echo Sync selesai! Cek: https://github.com/Albertensen/Web-Dan-App
pause
