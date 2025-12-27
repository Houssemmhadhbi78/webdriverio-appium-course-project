class AddNoteScreen {

    get skipBtn() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/btn_start_skip');
    }

    // Main add note button (Floating Action Button)
    get addNoteFAB() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/fab');
    }

    // Fallback selector using text
    get addNoteText() {
        return $('//*[@text="Add note"]');
    }

    // Method to get the add note button with fallback
    async getAddNoteButton() {
        try {
            // Try FAB first (more reliable)
            await this.addNoteFAB.waitForDisplayed({ timeout: 5000 });
            return this.addNoteFAB;
        } catch {
            // Fallback to text-based selector
            return this.addNoteText;
        }
    }

    get noteTypeDialogList() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/select_dialog_listview');
    }

    get selectTextNoteOptionByText() {
        return $('android=new UiSelector().textContains("Text")');
    }

    get SelectTextNoteOption() {
        // Known-stable selector (matches working implementation in add-note.spec.js)
        return $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/select_dialog_listview"]/android.widget.LinearLayout[1]');
    }
    get SelectCheckListNoteOption() {
        return $('//*[@resource-id="com.socialnmobile.dictapps.notepad.color.note:id/select_dialog_listview"]/android.widget.LinearLayout[2]');
    }

    get firstCheckedTextView() {
        return $('//android.widget.CheckedTextView[1]');
    }

    async tapTextNoteOption() {
        const candidates = [
            this.SelectTextNoteOption,
            this.selectTextNoteOptionByText,
            this.firstCheckedTextView
        ];

        for (const locator of candidates) {
            if (await locator.isDisplayed().catch(() => false)) {
                await locator.click();
                return;
            }
        }

        throw new Error('Text note option not available in note type dialog');
    }
    get TexteEditing() {
        return $('android=new UiSelector().text("Editing")');
    }
    get NoteEditTitleField() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/edit_title');
    }
    get NoteEditBodyField() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/edit_note');
    }
    get EditSaveBtn() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/edit_btn');
    }
    get NoteCreatedTitleField() {
        return $('id=com.socialnmobile.dictapps.notepad.color.note:id/title');
    }
    get ThreeDotsMenuBtn() {
        return $('android=new UiSelector().resourceId("com.socialnmobile.dictapps.notepad.color.note:id/menu_btn")');
    }
    get DeleteOption() {
        return $('android=new UiSelector().text("Delete")');
    }
    get IconNavBtn() {
        return $('android=new UiSelector().resourceId("com.socialnmobile.dictapps.notepad.color.note:id/icon_nav")');
    }
    get TrashCanOption() {
        return $('android=new UiSelector().text("Trash Can")');
    }
    get TrashCanItem() {
        return $('android=new UiSelector().resourceId("com.socialnmobile.dictapps.notepad.color.note:id/title")');
    }
}

export default new AddNoteScreen();