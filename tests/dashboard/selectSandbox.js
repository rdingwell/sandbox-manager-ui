const UTILS = require('../utils');

const selectSandbox = async () => {
    let button = await UTILS.getElementByCss('[data-qa="sandbox-AUTOTESTSANDBOX1"]');
    button.click();

    let appsPageWraooer = await UTILS.getElementByCss('[data-qa="app-page-wrapper"]', 5000);
    expect(appsPageWraooer).not.toBeNull();

    let currentUrl = await UTILS.getCurrentURL();
    expect(currentUrl.toString()).toEqual(expect.stringContaining('AUTOTESTSANDBOX1'));
};

exports.testSandboxSelection = () => describe('Testing sandbox selection', function () {
    it('should navigate to the selected sandbox page', async () => {
        await selectSandbox();
    });
});

exports.selectSandbox = selectSandbox;