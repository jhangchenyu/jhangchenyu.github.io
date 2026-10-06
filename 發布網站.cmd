@echo off
chcp 65001 >nul
pushd "%~dp0"
node tools\publish-site.cjs
set "publish_exit=%errorlevel%"
popd
pause
exit /b %publish_exit%
