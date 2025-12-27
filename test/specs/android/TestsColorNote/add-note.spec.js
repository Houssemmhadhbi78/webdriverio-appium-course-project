// describe block groups related tests together in Mocha test suite
describe('Android Native Feature Tests ', () => {
    xit('Skip Tutorial', async () => {
        const skipTutorialBtn = await $('id=com.socialnmobile.dictapps.notepad.color.note:id/btn_start_skip');
        await skipTutorialBtn.waitForDisplayed({ timeout: 5000 });
        await skipTutorialBtn.click();
        await expect(skipTutorialBtn).not.toBeDisplayed();
        await expect(await $('//*[@text="Add note"]')).toBeDisplayed();
    });

    xit('Add Note , save changes & verify note', async () => {
        await $('//*[@text="Add note"]').click();
        await $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/select_dialog_listview"]/android.widget.LinearLayout[1]').click();
        await expect(await $('//*[@text="Editing"]')).toBeDisplayed();

        // Enter Note Title and Note Body
        const NoteTitleField = await $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/edit_title"]');
        await NoteTitleField.setValue("Fav Anime List");

        // Add notes to body
        const NoteBodyField = await $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/edit_note"]');
        const noteText = ["Naruto", "One Piece", "AOT"].join("\n");
        await NoteBodyField.setValue(noteText);

        // Save the note by navigating back
        await driver.back();
        await driver.pause(2000);

        // Verify note is displayed
        const noteByTitle = await $('//*[@text="Fav Anime List"]');
        await expect(noteByTitle).toBeDisplayed();

        // Option 2: Verify by partial text match
        const noteByText = await $('android=new UiSelector().textContains("Naruto")');
        await expect(noteByText).toBeDisplayed();

    });

    it('Delete Note & verify Deleted note', async () => {
        // Handle tutorial if present (with noReset=true, it's likely already skipped)
        const skipTutorialBtn = await $('id=com.socialnmobile.dictapps.notepad.color.note:id/btn_start_skip');
        const isSkipBtnPresent = await skipTutorialBtn.isExisting();
        if (isSkipBtnPresent) {
            console.log('Tutorial detected - skipping...');
            await skipTutorialBtn.click();
            await driver.pause(1000);
        } else {
            console.log('Tutorial already skipped - proceeding to test');
        }

        // Ensure we're on the main notes list screen
        const addNoteBtn = await $('//*[@text="Add note"]');
        await addNoteBtn.waitForDisplayed({ timeout: 8000 });

        //Create Note to delete
        await addNoteBtn.click();
        await $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/select_dialog_listview"]/android.widget.LinearLayout[1]').click();
        await expect(await $('//*[@text="Editing"]')).toBeDisplayed();

        // Enter Note Title and Note Body
        const NoteTitleField = await $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/edit_title"]');
        await NoteTitleField.setValue("FavAnimeList");

        // Add notes to body
        const NoteBodyField = await $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/edit_note"]');
        const noteText = ["Naruto", "One Piece", "AOT"].join("\n");
        await NoteBodyField.setValue(noteText);

        // Save the note by navigating back
        await driver.back();
        await driver.back();
        
        // Wait for the note to appear in the list using the actual note title
        const noteToDelete = await $('//*[@text="FavAnimeList"]');
        await noteToDelete.waitForDisplayed({ timeout: 8000 });
        const noteToDeleteText = await noteToDelete.getText();
        console.log("Note to be deleted: " + noteToDeleteText);
        await noteToDelete.click();
        // Click menu button (3 dots )
        await $('android=new UiSelector().resourceId("com.socialnmobile.dictapps.notepad.color.note:id/menu_btn")').click();

        // Click Delete option
        await $('//*[@text="Delete"]').click();

        // Confirm deletion
        await driver.acceptAlert();

        // Verify the note is no longer in the main list
        //click on nav icon
        await $('android=new UiSelector().resourceId("com.socialnmobile.dictapps.notepad.color.note:id/icon_nav")').click()
        await $('android=new UiSelector().text("Trash Can")').click()

        const trashCanItem = await $('android=new UiSelector().resourceId("com.socialnmobile.dictapps.notepad.color.note:id/title")');
        const trashCanItemText = await trashCanItem.getText();
        console.log("Deleted note found in Trash Can: " + trashCanItemText);
        await expect(trashCanItemText).toBe(noteToDeleteText);
        await driver.pause(4000);

    });
});