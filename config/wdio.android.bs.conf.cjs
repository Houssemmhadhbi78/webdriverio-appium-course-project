const path = require('path');
const { config } = require('./wdio.shared.conf.cjs');
require('dotenv').config();

// ============
// BrowserStack Credentials
// ============
config.user = process.env.BROWSERSTACK_USERNAME;
config.key = process.env.BROWSERSTACK_ACCESS_KEY;

config.hostname = 'hub.browserstack.com';
config.specs = ['./test/specs/android/TestsColorNote/*.spec.js'];
// ============
// Capabilities
// ============
config.capabilities = [{
    // capabilities for local Appium web tests on an Android Emulator
    platformName: 'Android',
    'appium:deviceName': 'Google Pixel 5',  // Nom exact de votre émulateur
    'appium:platformVersion': '11.0',  // Changé de 12.0 à 16.0
    'appium:automationName': 'UiAutomator2',
    'appium:app': 'bs://35918e6a03680c48497e21350280c67ce0214b17',
    // 'appium:autoGrantPermissions': true,

    'bstack:options': {
        projectName: 'My First WebDriverIO Mobile Project on Android device',
        buildName: 'Test regression',
        sessionName: 'ColorNote - Delete note',
        debug: true,          // enables extra debugging (screenshots, etc.)
        networkLogs: true,    // enables network logs
        deviceLogs: true,     // enables device logs
        appiumLogs: true,
        video: true,  // Explicitly enable video recording
        local: false,
        // Optional: enable interactive debugging
        interactiveDebugging: true,
        // IMPORTANT: Enable test observability
        consoleLogs: 'verbose',
        // This ensures proper test reporting
        buildTag: 'regression',
        // Custom build identifier with timestamp
        buildIdentifier: `${new Date().getTime()}`
    }
}],
    // Test runner services

    config.services = [
        ['browserstack'
            , {
                // Enable test observability
                testObservability: false,
                testObservabilityOptions: {
                    projectName: 'My First WebDriverIO Mobile Project',
                    buildName: 'Test regression',
                    buildTag: 'android-tests'
                },
                // Enable test reporting to BrowserStack
                browserstackLocal: false,
                opts: {
                    forceLocal: false
                }
            }]
    ];

exports.config = config;