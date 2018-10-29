const UTILS = require('../utils');

exports.selectSandbox = () => describe('Testing sandbox selection', function () {
    it('should navigate to the selected sandbox page', async () => {
        let button = await UTILS.getElementByCss('[data-qa="sandbox-AUTOTESTSANDBOX1"]');
        button.click();

        let appsPageWraooer = await UTILS.getElementByCss('[data-qa="app-page-wrapper"]', 2500);
        expect(appsPageWraooer).not.toBeNull();

        let currentUrl = await UTILS.getCurrentURL();
        expect(currentUrl.toString()).toEqual(expect.stringContaining('AUTOTESTSANDBOX1'));
    });
});