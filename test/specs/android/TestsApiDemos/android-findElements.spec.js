//describe block groups related tests together in Mocha
describe('Android Elements Tests ', () => {
    // 'it' defines an individual test case within the test suite
    xit('Find Elements by Accessibility ID ', async () => { //xit to skip the test
        // Find element using Accessibility ID
        const AppOption = await $('~App');
        //click on the found element
        await AppOption.click();
        //Assertion 
        const actionBar = await $('~Action Bar');
        await expect(actionBar).toBeExisting();
        // Go back to previous screen
        await driver.back();

    });

    xit('Find Elements by class name ', async () => { //xit to skip the test
        // Find element using class name
        const btnAccessinlity1 = await $('android.widget.TextView');
        //Assertion 
        await expect(btnAccessinlity1).toHaveText('API Demos');
    });

    xit('Find Elements by Xpath ', async () => { //xit to skip the test
        // Find 1st element using Xpath -(//tagname[@attribute='value'])
        const btnApp = await $('//android.widget.TextView[@content-desc="App"]');
        //click on the founded 1st element
        await btnApp.click();
        // Find 2nd element using Xpath -(//tagname[@attribute='value'])
        const btnAlertDialogs = await $('//android.widget.TextView[@content-desc="Alert Dialogs"]');
        //click on the founded 2nd element
        await btnAlertDialogs.click();
        // Find 3rd element using Xpath and ressource-id -(//tagname[@attribute='value'])
        const btnListDialogs = await $('//android.widget.Button[@resource-id="io.appium.android.apis:id/select_button"]');
        //click on the founded 3rd element
        await btnListDialogs.click();
        // Find 4th element using Xpath (//tagname[@attribute='value'])
        const HeaderTitle = await $('//android.widget.TextView[@resource-id="android:id/text1" and @text="Command two"]');
        //click on the founded 4th element
        await HeaderTitle.click();
        //Assertion 
        const messageText = await $('//android.widget.TextView[@resource-id="android:id/message"]');
        await expect(messageText).toHaveText('You selected: 1 , Command two');

        // Go back multiple times to return to home screen
        await driver.back(); // Close dialog
        await driver.back(); // Back from Alert Dialogs
        await driver.back(); // Back from App menu
    });

    xit('Find Elements by UIAutomator ', async () => {
        // Find element by text contains using UIAutomator
        await $('android=new UiSelector().textContains("App")').click();
        // Find element by text contains using UIAutomator and store it in a variable first
        const alertElement = await $('android=new UiSelector().textContains("Alert")');
        await alertElement.click();
    });

    // Working with multiple elements with $$
    xit('Find multiple elements  ', async () => {
        const expectedList = [
            "API Demos", "Access'ibility", "Accessibility", "Animation", "App", "Content", "Graphics", "Media", "NFC", "OS", "Preference", "Text", "Views"
        ];
        const actualList = [];
        // Find multiple elements
        const textList = await $$('android.widget.TextView');
        // print the number of elements found
        console.log("===================== Number of elements: " + textList.length);

        // loop through them
        for (const textElement of textList) {
            const text = await textElement.getText();
            actualList.push(text);
        }
        console.log("===================== Actual List: " + actualList);
        // Assertion to compare actualList with expectedList
        await expect(actualList).toEqual(expectedList);
    });
    //Exercie - Text Field Inputs
    it('Text Field Inputs ', async () => {
        // 1st Click on element "Views"
        await $('~Views').click();
        // 2nd Click on element "Auto Complete"
        await $('android=new UiSelector().textContains("Auto Complete")').click();
        // 3rd Click on element "1. Screen Top"
        await $('android=new UiSelector().textContains("Screen Top")').click();
        // 4th Enter a name of country in the text field
        const textField = await $('android=new UiSelector().resourceId("io.appium.android.apis:id/edit")');
        await textField.addValue("Canada");
        // Validate the entered text in the text field
        await expect(textField).toHaveText("Canada");
    });
});
