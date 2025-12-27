const path = require('path');

exports.config = {

    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // Tip: set `WDIO_LOG_LEVEL=debug` only when troubleshooting.
    logLevel: process.env.WDIO_LOG_LEVEL || 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'trace',
    //     '@wdio/appium-service': 'trace'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost:8080',
    //
    // Default timeout for all waitFor* commands.
    // Keep this reasonably low; use per-element timeouts for slow screens.
    waitforTimeout: 12000,

    // Polling interval for waitFor* commands (ms)
    waitforInterval: 250,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,


    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 90000
    },
    // ============
    // Hooks - UPDATED
    // ============

    before: async function (capabilities, specs) {
        console.log('🚀 Starting test session...');
    },

    beforeTest: async function (test, context) {
        console.log(`\n▶️  Starting test: ${test.title}`);
    },

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        const status = passed ? '✅ PASSED' : '❌ FAILED';
        console.log(`\n${status} Test: ${test.title}`);
        console.log(`⏱️  Duration: ${duration}ms`);

        // Print BrowserStack session URL
        if (driver?.sessionId) {
            const sessionUrl = `https://app-automate.browserstack.com/dashboard/v2/sessions/${driver.sessionId}`;
            console.log('\n╔═══════════════════════════════════════════════════════╗');
            console.log('║          BrowserStack Session Details                 ║');
            console.log('╠═══════════════════════════════════════════════════════╣');
            console.log(`║ Status: ${status}                                      ║`);
            console.log('║ View Live Session & Video:                             ║');
            console.log(`║ ${sessionUrl} ║`);
            console.log('╚═══════════════════════════════════════════════════════╝\n');
        }

        // CRITICAL: Mark test status on BrowserStack
        try {
            if (typeof driver !== 'undefined' && driver.sessionId) {
                await driver.executeScript(
                    'browserstack_executor: ' + JSON.stringify({
                        action: 'setSessionStatus',
                        arguments: {
                            status: passed ? 'passed' : 'failed',
                            reason: error ? error.message : ''
                        }
                    }), []
                );

                // Also set session name with result
                await driver.executeScript(
                    'browserstack_executor: ' + JSON.stringify({
                        action: 'setSessionName',
                        arguments: {
                            name: `${test.parent} - ${test.title} [${status}]`
                        }
                    }), []
                );
            }
        } catch (e) {
            console.log('⚠️  Could not update BrowserStack session:', e.message);
        }
    },

    after: async function (result, capabilities, specs) {
        console.log('\n✨ Test session completed');
    },

    onComplete: function (exitCode, config, capabilities, results) {
        console.log('\n╔══════════════════════════════════════════════════════╗');
        console.log('║           🎉 Test Execution Completed!               ║');
        console.log('╠══════════════════════════════════════════════════════╣');
        console.log('║ View all sessions at:                                 ║');
        console.log('║ https://app-automate.browserstack.com/dashboard     ║');
        console.log('╚══════════════════════════════════════════════════════╝\n');
    }

}
