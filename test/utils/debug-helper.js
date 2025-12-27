/**
 * Debug helper utilities for troubleshooting element locator issues
 */
class DebugHelper {
    /**
     * Print the current page source to console
     * Useful for debugging when elements are not found
     */
    async printPageSource() {
        try {
            const source = await driver.getPageSource();
            console.log('\n========== PAGE SOURCE ==========');
            console.log(source);
            console.log('=================================\n');
            return source;
        } catch (error) {
            console.error('Error getting page source:', error.message);
        }
    }

    /**
     * Take a screenshot and save it
     * @param {string} filename - Name for the screenshot file
     */
    async takeScreenshot(filename = 'debug-screenshot') {
        try {
            const timestamp = new Date().getTime();
            const filepath = `./screenshots/${filename}-${timestamp}.png`;
            await driver.saveScreenshot(filepath);
            console.log(`Screenshot saved: ${filepath}`);
            return filepath;
        } catch (error) {
            console.error('Error taking screenshot:', error.message);
        }
    }

    /**
     * Find all elements with text containing the search term
     * @param {string} searchText - Text to search for
     */
    async findElementsWithText(searchText) {
        try {
            const xpath = `//*[contains(@text, "${searchText}")]`;
            const elements = await $$(xpath);
            console.log(`\nFound ${elements.length} elements containing "${searchText}"`);

            for (let i = 0; i < elements.length; i++) {
                const text = await elements[i].getText();
                const resourceId = await elements[i].getAttribute('resource-id');
                const className = await elements[i].getAttribute('class');
                console.log(`  [${i}] Text: "${text}", Resource-ID: "${resourceId}", Class: "${className}"`);
            }

            return elements;
        } catch (error) {
            console.error('Error finding elements:', error.message);
            return [];
        }
    }

    /**
     * List all visible buttons on the screen
     */
    async listVisibleButtons() {
        try {
            const buttons = await $$('//android.widget.Button | //android.widget.ImageButton');
            console.log(`\nFound ${buttons.length} buttons:`);

            for (let i = 0; i < buttons.length; i++) {
                const isDisplayed = await buttons[i].isDisplayed();
                if (isDisplayed) {
                    const text = await buttons[i].getAttribute('text');
                    const contentDesc = await buttons[i].getAttribute('content-desc');
                    const resourceId = await buttons[i].getAttribute('resource-id');
                    console.log(`  [${i}] Text: "${text}", Desc: "${contentDesc}", ID: "${resourceId}"`);
                }
            }
        } catch (error) {
            console.error('Error listing buttons:', error.message);
        }
    }

    /**
     * Wait and log what's happening
     * @param {number} seconds - Number of seconds to wait
     * @param {string} message - Message to log
     */
    async waitAndLog(seconds, message = '') {
        console.log(`Waiting ${seconds}s... ${message}`);
        await driver.pause(seconds * 1000);
    }

    /**
     * Check if element exists and is displayed
     * @param {WebdriverIO.Element} element - Element to check
     * @param {string} elementName - Name for logging
     */
    async checkElement(element, elementName) {
        try {
            const exists = await element.isExisting();
            const displayed = exists ? await element.isDisplayed() : false;
            console.log(`Element "${elementName}": exists=${exists}, displayed=${displayed}`);
            return { exists, displayed };
        } catch (error) {
            console.error(`Error checking element "${elementName}":`, error.message);
            return { exists: false, displayed: false };
        }
    }
}

export default new DebugHelper();
