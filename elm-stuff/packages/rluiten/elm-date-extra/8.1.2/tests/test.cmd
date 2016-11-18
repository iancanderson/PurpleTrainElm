@echo off
:loop
elm.exe make TestRunner.elm --output program.js
node program.js

echo Press key to run test again
pause
goto loop
