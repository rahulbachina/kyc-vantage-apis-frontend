@echo off
echo Pushing to Vercel repository...
echo.
echo You may need to enter your GitHub credentials:
echo Username: rahulgpu
echo Password: Use a Personal Access Token (not your password)
echo.
echo To create a token: https://github.com/settings/tokens
echo.
git push https://github.com/rahulgpu/kycapyfront-new.git main --force
pause
