//Steps to run tests
1- Open Android Studio
2- In "More Actions", Open "Virtual Device Manager"
3- Select the "Pixel 3" device and click the Play button to launch the mobile emulator.(See capabilities in "wdio.conf.cjs")
4- Open a 1st separate CMD terminal in VScode and run this commande : 
appium
5- Open a 2nd separate CMD terminal in VScode and run test on local to run a specefic test like "add-notePO.spec.js":

npx wdio run config/wdio.android.conf.cjs --spec test/specs/android/TestsColorNote/add-notePO.spec.js
or 

** Open only one CMD terminal in VScode and run test on browserstack to run a specefic test like "add-notePO.spec.js":

npx wdio run config/wdio.android.bs.conf.cjs --spec test/specs/android/TestsColorNote/add-notePO.spec.js
or simple command:
npm run test:android:bs
  "type": "module",
========================================================================================
In order to find 'getCurrentActivity' result , we this working way:
1- I should have one device/emulator active.
2- Open Appium Inscpector and Start Session
3- Navigate to the "Session Information" tab
4- You will fin de SessionID on the Session URL link
Example :     
http://127.0.0.1:4724/session/8d129bcf-600d-4e0d-969d-0fdee965e286
5- Run this command a CMD terminal while your app is in the foreground:
curl -s http://127.0.0.1:4724/session/<SessionID>/appium/device/current_activity
Example :
curl -s http://127.0.0.1:4724/session/8d129bcf-600d-4e0d-969d-0fdee965e286/appium/device/current_activity
or
adb shell dumpsys activity activities | findstr /R /C:"mResumedActivity" /C:"ResumedActivity"

The result like this example:
{"value":".ApiDemos"}
========================================================================================
if I need to execute tests on Folder "TestsApiDemos", I should Activate ligne 66 and comment line 67 in file "wdio.conf.cjs".
if I need to execute tests on Folder "TestsColorNote", I should Activate ligne 67 and comment line 66 in file "wdio.conf.cjs"

========================================================================================
Finding Elements - Android !! Must Open "Appium Inspector" to check each element
- 1st Option: Accessibility ID
    - Cross-Platform compatibility
    - Preferred option

- Class Name/Tage
    - Not Unique (usually)
    - Ex: TexteView, Button , Layout

- Xpath
    - Go-to selector after Accessibility ID
    - Dynamic & Flexible
    - Long & Difficult to read

- Android UIAutomator
    - Additional search capabilities
========================================================================================
Page Object Model
- Popular design pattern, helps us to reduce code duplication & improves test maintenance
- Why POM?
    - Easier to maintain large projects
- Advantages
    - Code Separation between Page Class and Test Case
    - Single source of repository
    - Readability
========================================================================================
Config of BrowserStack

bs://35918e6a03680c48497e21350280c67ce0214b17

========================================================================================
Documentations
https://webdriver.io/docs/selectors/#android-uiautomator
https://developer.android.com/reference/androidx/test/uiautomator/UiSelector
https://appium.readthedocs.io/en/latest/en/writing-running-appium/android/uiautomator-uiselector/
https://www.browserstack.com/docs/app-automate/capabilities
https://webdriver.io/docs/autocompletion/#visual-studio-code-vscode
https://webdriver.io/docs/browserstack-service/
https://app-automate.browserstack.com/qig/get-started


