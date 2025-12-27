import AddNoteScreen from './add-note.screen.js';
//Create Skip Note Screen fonction
class EditNoteScreen {
    async SkipTutorial() {
        const appPackage = 'com.socialnmobile.dictapps.notepad.color.note';
        const appActivity = 'com.socialnmobile.colornote.activity.Main';

        // If the emulator is locked, element lookups will fail.
        try {
            if (await driver.isLocked()) {
                await driver.unlock();
            }
        } catch {
            // ignore (not supported on all setups)
        }

        // Ensure the app is launched and in foreground (sometimes we end up on the launcher).
        try {
            const currentPackage = await driver.getCurrentPackage().catch(() => null);
            if (currentPackage !== appPackage) {
                try {
                    await driver.activateApp(appPackage);
                } catch {
                    // Fallback if activateApp isn't supported
                    await driver.startActivity(appPackage, appActivity);
                }
            }
        } catch {
            // ignore
        }

        // Wait for the app to render *something* recognizable (startup can be slow with emulator/noReset)
        const allowBtn = $('id=com.android.permissioncontroller:id/permission_allow_button');
        const allowForegroundBtn = $('id=com.android.permissioncontroller:id/permission_allow_foreground_only_button');

        try {
            await driver.waitUntil(
                async () => {
                    const [hasSkip, hasFab, hasAddText, hasEditing, hasAllow, hasAllowFg] = await Promise.all([
                        AddNoteScreen.skipBtn.isExisting(),
                        AddNoteScreen.addNoteFAB.isExisting(),
                        AddNoteScreen.addNoteText.isExisting(),
                        AddNoteScreen.TexteEditing.isExisting(),
                        allowBtn.isExisting(),
                        allowForegroundBtn.isExisting()
                    ]);
                    return hasSkip || hasFab || hasAddText || hasEditing || hasAllow || hasAllowFg;
                },
                {
                    timeout: 25000,
                    interval: 500,
                    timeoutMsg: 'App did not reach a recognizable screen (tutorial/main/edit/permissions) in time'
                }
            );
        } catch (e) {
            const currentPackage = await driver.getCurrentPackage().catch(() => null);
            const currentActivity = await driver.getCurrentActivity().catch(() => null);
            console.log(`Startup debug: package=${currentPackage} activity=${currentActivity}`);
            await driver.saveScreenshot('./logs/skipTutorial-startup-failure.png').catch(() => null);
            throw e;
        }

        // Handle Android runtime permission dialogs if they pop up
        for (let i = 0; i < 3; i++) {
            if (await allowBtn.isDisplayed().catch(() => false)) {
                await allowBtn.click();
                continue;
            }
            if (await allowForegroundBtn.isDisplayed().catch(() => false)) {
                await allowForegroundBtn.click();
                continue;
            }
            break;
        }

        // Skip tutorial if present (it may not exist when noReset=true)
        if (await AddNoteScreen.skipBtn.isExisting()) {
            console.log('Tutorial detected - skipping...');
            await AddNoteScreen.skipBtn.click();
        } else {
            console.log('Tutorial already skipped - proceeding to main screen verification');
        }

        // Ensure we end up on the notes list (FAB/Add note).
        // With noReset=true the app can reopen on an "Editing" screen or other sub-screens.
        for (let attempt = 0; attempt < 3; attempt++) {
            if (await AddNoteScreen.addNoteFAB.isDisplayed().catch(() => false)) {
                return;
            }
            if (await AddNoteScreen.addNoteText.isDisplayed().catch(() => false)) {
                return;
            }

            // If we're in the editor (or another sub-screen), go back and re-check.
            await driver.back();
            await driver.pause(250);
        }

        // Final explicit wait with clear message
        try {
            await AddNoteScreen.addNoteFAB.waitForDisplayed({
                timeout: 8000,
                timeoutMsg: 'Add note FAB button not found after skipping tutorial'
            });
        } catch {
            console.log('FAB not found, trying text-based selector...');
            await AddNoteScreen.addNoteText.waitForDisplayed({
                timeout: 8000,
                timeoutMsg: 'Add note element not found. App might be showing a different screen after tutorial.'
            });
        }
    }
    //Create Edit Note Screen fonction
    async AddAndSaveNote(noteHeading, noteBody) {
        //SECTION - Add Note - use FAB button
        const addNoteButton = await AddNoteScreen.getAddNoteButton();
        await addNoteButton.click();

        // Give the app a moment to react after click
        await driver.pause(1000);

        // Wait for either the dialog or the editor fields to appear
        await driver.waitUntil(
            async () => {
                // Check for dialog
                const hasDialog = await AddNoteScreen.noteTypeDialogList.isExisting().catch(() => false);
                if (hasDialog) return true;

                // Check for dialog option
                const hasOption = await AddNoteScreen.SelectTextNoteOption.isExisting().catch(() => false);
                if (hasOption) return true;

                // Check if we're already in editor by looking for edit fields (more reliable than "Editing" text)
                const hasTitle = await AddNoteScreen.NoteEditTitleField.isExisting().catch(() => false);
                const hasBody = await AddNoteScreen.NoteEditBodyField.isExisting().catch(() => false);
                if (hasTitle || hasBody) return true;

                // Check for "Editing" text as fallback
                return await AddNoteScreen.TexteEditing.isExisting().catch(() => false);
            },
            {
                timeout: 10000,
                interval: 500,
                timeoutMsg: 'Note type dialog or editor did not appear after clicking Add note'
            }
        );

        // If dialog is present, select the text option
        const hasDialog = await AddNoteScreen.noteTypeDialogList.isDisplayed().catch(() => false);
        if (hasDialog) {
            console.log('Dialog detected - selecting Text option...');
            try {
                await AddNoteScreen.SelectTextNoteOption.click();
                await driver.pause(500);
            } catch {
                // Fallback: try text-based selector
                const textOption = await $('android=new UiSelector().textContains("Text").className("android.widget.CheckedTextView")');
                if (await textOption.isExisting()) {
                    await textOption.click();
                    await driver.pause(500);
                }
            }
        }

        // Wait for editor fields to be available (more reliable than waiting for "Editing" text)
        await driver.waitUntil(
            async () => {
                const hasTitle = await AddNoteScreen.NoteEditTitleField.isDisplayed().catch(() => false);
                const hasBody = await AddNoteScreen.NoteEditBodyField.isDisplayed().catch(() => false);
                return hasTitle || hasBody;
            },
            {
                timeout: 8000,
                interval: 500,
                timeoutMsg: 'Editor fields (title/body) did not appear. App might be on a different screen.'
            }
        );

        //add a Note Title
        await AddNoteScreen.NoteEditTitleField.setValue(noteHeading);

        // Add notes Body
        await AddNoteScreen.NoteEditBodyField.setValue(noteBody);

        // FIRST BACK: Save the note (closes edit screen, saves note)
        await driver.back();

        // SECOND BACK: Return to notes list
        await driver.back();

        // Verify note appears in list using text selector - this wait replaces the pauses
        const noteElement = await $(`//*[@text="${noteHeading}"]`);
        await noteElement.waitForDisplayed({ timeout: 8000 });
    }
}

export default new EditNoteScreen();