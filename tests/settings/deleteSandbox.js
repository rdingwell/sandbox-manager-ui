const UTILS = require('../utils');

exports.deleteSandbox = () => describe('Testing sandbox deletion', function () {
    it('should navigate to the settings page', async () => {
        let gotToSettingsButton = await UTILS.getElementByCss('[data-qa="nav-settings"]');
        gotToSettingsButton.click();

        //Wait for the animation just in case
        await UTILS.wait(500);
    });
    it('should delete the sandbox', async () => {
        let deleteSandboxButton = await UTILS.getElementByCss('[data-qa="delete-sandbox-button"]');
        deleteSandboxButton.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let deleteVerificationCheckbox = await UTILS.getElementByCss('[data-qa="delete-sure-checkbox"]', 2000, false);
        deleteVerificationCheckbox.click();

        let sandboxDeleteButton = await UTILS.getElementByCss('[data-qa="sandbox-delete-button"]');
        sandboxDeleteButton.click();

        // await UTILS.waitForLoader('[data-qa="full-page-loader"]');
        await UTILS.wait(500);
        // await UTILS.waitForLoader('[data-qa="sandbox-loading-loader"]');
        // await UTILS.wait(1500);

        let currentUrl = await UTILS.getCurrentURL();
        expect(currentUrl.toString()).toEqual(expect.stringContaining('dashboard'));
    });
});