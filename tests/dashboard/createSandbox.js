const UTILS = require('../utils');

exports.createSandbox = describe('Testing sandbox creation', function () {
    it('should show the menu when help button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="create-sandbox"]');
        button.click();

        //Wait for the animation just in case
        await UTILS.wait(500);
    });
});