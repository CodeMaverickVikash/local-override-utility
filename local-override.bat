@echo off

echo ----------------------------------------------------------------
echo ---------------------- Local override utility ----------------------
echo ----------------------------------------------------------------

chdir /d D:\
cd D:\ABOS\adoddle\adoddle-web\src\main\webapp\adoddleapp
call ng build app1 --configuration production --output-path C:\Users\VikashMaskhare\Desktop\development\local-override-utility\adoddleqaak.asite.com\scripts\ng-vendor
echo Build Sucessfull

chdir /d C:\
xcopy /Y C:\Users\VikashMaskhare\Desktop\development\local-override-utility\adoddleqaak.asite.com\scripts\header-files\.headers C:\Users\VikashMaskhare\Desktop\development\local-override-utility\adoddleqaak.asite.com\scripts\ng-vendor

cd C:\Users\VikashMaskhare\Desktop\development\local-override-utility
call npm run startwork

pause