@echo off
REM Startet die Katzengesundheits-App lokal im Browser.
title Katzengesundheit
cd /d "%~dp0"

REM Python finden (py-Launcher bevorzugt, sonst python)
where py >nul 2>nul
if %errorlevel%==0 (
    py "%~dp0start.py"
    goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
    python "%~dp0start.py"
    goto :eof
)

echo.
echo  Python wurde nicht gefunden.
echo  Alternativ kannst du die Datei "index.html" direkt im Browser oeffnen.
echo.
pause
