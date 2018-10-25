const UTILS = require('../utils');

exports.deleteSandbox = () => describe('Testing sandbox deletion', function () {
    it('should navigate to the settings page', async () => {
        let gotToSettingsButton = await UTILS.getElementByCss('[data-qa="nav-settings"]');
        gotToSettingsButton.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let deleteSandboxButton = await UTILS.getElementByCss('[data-qa="delete-sandbox-button"]');
        deleteSandboxButton.click();
    });
});