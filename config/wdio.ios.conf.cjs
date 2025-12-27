const path = require('path');
const { config } = require('./wdio.shared.conf.cjs');

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
    './test/specs/ios/*.js'
];
// ============
// Capabilities
// ============
config.capabilities = [{
    // capabilities for local Appium web tests on an iOS Simulator
    platformName: 'iOS',
    'appium:platformVersion': '14.5',
    'appium:deviceName': 'iPhone 12',
    'appium:automationName': 'XCUITest',
    'appium:app': path.join(process.cwd(), 'app/ios/MVCTodo.zip'), // Remplacez par le chemin réel de votre application iOS
    'appium:noReset': true
}];

// Test runner services
// Services take over a specific job you don't want to take care of. They enhance
// your test setup with almost no effort. Unlike plugins, they don't add new
// commands. Instead, they hook themselves up into the test process.
config.services = ['appium'];  // Appium est démarré manuellement

exports.config = config;