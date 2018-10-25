const UTILS = require('../utils');

exports.helpMenuButtonTest = describe('Testing if the help button is there', function () {
    it('should show the menu when help button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="header-help-button"]');
        button.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let menu = await UTILS.getElementByCss('[data-qa="help-menu-popover"]');
        expect(menu).not.toBeNull();
    });
    it('should close the menu when by clicking on the invisible overlay', async () => {
        let overlay = await UTILS.getElementByXPath('/html/body/div[4]');
        overlay.click();

        let menu = await UTILS.getElementByCss('[data-qa="help-menu-popover"]');
        expect(menu).toBeNull();
    });
});