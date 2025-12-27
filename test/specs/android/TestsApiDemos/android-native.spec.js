// describe block groups related tests together in Mocha test suite
describe('Android Native Feature Tests ', () => {
    // 'it' defines an individual test case within the test suite
    xit('Access an Activity directly ', async () => {
        // Starts a specific Android activity directly without navigating through the app UI
        // First parameter: package name, Second parameter: activity name to launch
        await driver.startActivity("io.appium.android.apis", "io.appium.android.apis.app.AlertDialogSamples");

        // Pauses test execution for 3 seconds (3000 milliseconds) to allow the activity to fully load
        await driver.pause(3000);

        // Finds an element using XPath selector that contains the text "App/Alert Dialogs"
        // The $ is WebDriverIO's shorthand for finding a single element
        const AlertAppDialogs = await $('//*[@text="App/Alert Dialogs"]');

        // Assertion: Verifies that the AlertAppDialogs element exists in the DOM
        // The test will fail if this element is not found on the screen
        await expect(AlertAppDialogs).toExist();
    });

    xit('Working with Dialog Boxes', async () => {
        // Starts a specific Android activity directly without navigating through the app UI
        await driver.startActivity("io.appium.android.apis", "io.appium.android.apis.app.AlertDialogSamples");
        //Click on the 'OK Cancel dialog with a message' button to open the dialog box
        const OKCancelDialogWithaMessage = await $('~OK Cancel dialog with a message');
        await OKCancelDialogWithaMessage.click();
        //get alert text from the dialog box
        const alertText = await driver.getAlertText();
        console.log("Alert Text is: " + alertText);

        // Accepts the dialog box (equivalent to clicking 'OK')
        // await driver.acceptAlert();

        // Dismisses the dialog box (equivalent to clicking 'Cancel')
        //await driver.dismissAlert();

        //Click on 'OK' button in the dialog box
        // const okButton = await $('//*[@resource-id="android:id/button1"]');
        // await okButton.click();

        //Click on 'Cancel' button in the dialog box
        const cancelButton = await $('//*[@resource-id="android:id/button2"]');
        await cancelButton.click();

        // Assertion: Verify that the dialog box is no longer present after accepting it
        const dialogBox = await $('//*[@resource-id="android:id/alertTitle"]');
        await expect(dialogBox).not.toExist();

    });

    xit('Vertical Scrolling', async () => {

        const AppOption = await $('~App');
        await AppOption.click();
        const ActivityOption = await $('~Activity');
        await ActivityOption.click();
        //1st way Scroll to the end of the screen (not stable way if  element gets moved)
        // await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(1,5)');

        //2nd way Scroll to an element with the text "Secure Surfaces" using UiScrollable -more stable way
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("Secure Surfaces")').click();

        // Find element by text contains using UIAutomator and store it in a variable first
        const secureDialogTitle = await $('android=new UiSelector().text("Secure Dialog")');
        //Assertion
        await expect(secureDialogTitle).toExist();
    });

    xit('Horizontal Scrolling', async () => {
        // Start the Gallery1 activity directly
        await driver.startActivity("io.appium.android.apis", "io.appium.android.apis.view.Gallery1");
        // 1st way to Scroll to the end of the horizontal gallery- forward
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollForward()');
        await driver.pause(3000);
        // Scroll to the end of the horizontal gallery - backward
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollBackward()');
        await driver.pause(3000);
    });

    it('Exercice-Scrolling', async () => {
        // Start the DateWidgets1 directly View-> Date Widgets -> 1. Dialog
        await driver.startActivity("io.appium.android.apis", "io.appium.android.apis.view.DateWidgets1");
        //Get the current Dtae from the screen
        const currentDate = await $('//*[@resource-id="io.appium.android.apis:id/dateDisplay"]');
        console.log("Current Date is ===>: " + await currentDate.getText());
        //Click on Change Date button
        const changeDateButton = await $('~change the date');
        await changeDateButton.click();
        //Scroll to the right month 
        await $('android=new UiScrollable(new UiSelector().scrollable(true)).setAsHorizontalList().scrollForward()');
        //Select 10th date from the calendar
        const date10 = await $('//*[@text="10"]');
        await date10.click();
        //Click on OK button
        const okButton = await $('//*[@resource-id="android:id/button1"]');
        await okButton.click();
        //Verify the selected date
        const updatedDate = await $('//*[@resource-id="io.appium.android.apis:id/dateDisplay"]');
        console.log("Updated Date is ===>: " + await updatedDate.getText());
        await expect(updatedDate).toHaveText(/.*10.*/);
        await expect(updatedDate).not.toEqual(currentDate);
        await driver.pause(3000);
    });
});
