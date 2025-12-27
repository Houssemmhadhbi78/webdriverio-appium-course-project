import AddNoteScreen from '../../../screenObjects/android/add-note.screen.js';
import EditNoteScreen from '../../../screenObjects/android/edit-notes.screen.js';

describe('Android Native Feature Tests ', () => {
    before(async () => {
        //SECTION - Skip
        await EditNoteScreen.SkipTutorial();
        //SECTION - Create Note : Note Title and Note Body
        await EditNoteScreen.AddAndSaveNote("FavAnimeList", ["Naruto", "One Piece", "AOT"].join("\n"));
        // AddAndSaveNote() already navigates back to notes list, so no need for extra backs
    });
    it('Delete Note & verify Deleted note', async () => {
        //SECTION - Delete Note
        // click on created note to open it by text
        const noteElement = await $('//*[@text="FavAnimeList"]');
        await noteElement.waitForDisplayed({ timeout: 8000 });
        await noteElement.click();

        // Wait for menu button to be displayed after note opens
        await AddNoteScreen.ThreeDotsMenuBtn.waitForDisplayed({ timeout: 8000 });

        // Click menu button (3 dots )
        await AddNoteScreen.ThreeDotsMenuBtn.click();

        // Click Delete option
        await AddNoteScreen.DeleteOption.click();

        // Confirm deletioncl
        await driver.acceptAlert();

        //click on nav icon
        await AddNoteScreen.IconNavBtn.click();
        await AddNoteScreen.TrashCanOption.click();

        // Verify the note is no longer in the main list
        const trashCanItemText = await AddNoteScreen.TrashCanItem.getText();

        await expect(trashCanItemText).toBe("FavAnimeList");


    });
});