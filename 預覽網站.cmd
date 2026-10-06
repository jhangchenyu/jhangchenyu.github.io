@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 預覽啟動後，請開啟 http://localhost:4173/jhangchenyu.github.io/
call npm start
pause
