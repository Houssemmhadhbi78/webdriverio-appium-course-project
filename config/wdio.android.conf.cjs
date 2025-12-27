const path = require('path');
const { config } = require('./wdio.shared.conf.cjs');

const isFastMode = ['1', 'true', 'yes'].includes(String(process.env.FAST_MODE || '').toLowerCase());
const skipDeviceInit = ['1', 'true', 'yes'].includes(String(process.env.SKIP_DEVICE_INIT || '').toLowerCase());

//
// ====================
// Runner Configuration
// ====================

config.runner = 'local';
config.hostname = 'localhost';
config.port = 4723;
config.path = '/';

// ============
// Specs
// ============
config.specs = [
    '../test/specs/android/**/*.js'
];
// ============
// Capabilities
// ============
config.capabilities = [{
    // capabilities for local Appium web tests on an Android Emulator
    platformName: 'Android',
    'appium:deviceName': 'Pixel 3',  // Nom exact de votre émulateur
    'appium:platformVersion': '16.0',  // Changé de 12.0 à 16.0
    'appium:automationName': 'UiAutomator2',
    //If I need to use App "ApiDemos-debug.apk" from my local machine, juste indicate the path to the apk file
    //'appium:app': path.join(process.cwd(), 'app/android/ApiDemos-debug.apk'),
    //If I need to use App "ColorNote+Notepad.apk" from my local machine, juste indicate the path to the apk file
    'appium:app': path.join(process.cwd(), 'app/android/ColorNote+Notepad.apk'),
    // Explicit package/activity prevents occasional "stuck on launcher" starts
    'appium:appPackage': 'com.socialnmobile.dictapps.notepad.color.note',
    'appium:appActivity': 'com.socialnmobile.colornote.activity.Main',
    // Wait for the app to fully come up
    'appium:appWaitPackage': 'com.socialnmobile.dictapps.notepad.color.note',
    'appium:appWaitActivity': 'com.socialnmobile.colornote.activity.*',
    'appium:appWaitDuration': 30000,
    'appium:autoGrantPermissions': true,

    // Speed/stability tweaks
    // Reset app state between test runs to ensure clean test environment.
    // Set to true if you want faster runs and your tests handle existing state.
    'appium:noReset': false,
    // Disables window/transition animations (often saves seconds on emulators)
    'appium:disableWindowAnimation': true,
    // Avoid repeated UiAutomator2 server re-install (faster subsequent runs)
    'appium:skipServerInstallation': true,

    // FAST_MODE=1: skip some Appium extras to reduce overhead
    // (useful locally on emulator; if anything becomes flaky, unset FAST_MODE)
    'appium:skipLogcatCapture': isFastMode,
    // NOTE: skipping device init can leave the emulator locked and break element lookup.
    // Enable only if you are sure the device is already unlocked.
    'appium:skipDeviceInitialization': skipDeviceInit
}];

// Test runner services
// Services take over a specific job you don't want to take care of. They enhance
// your test setup with almost no effort. Unlike plugins, they don't add new
// commands. Instead, they hook themselves up into the test process.
config.services = ['appium'];  // Appium est démarré manuellement

exports.config = config;