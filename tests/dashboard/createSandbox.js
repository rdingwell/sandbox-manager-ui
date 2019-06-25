let { Key } = require('selenium-webdriver');

const UTILS = require('../utils');

exports.createSandbox = () => describe('Testing sandbox creation', function () {
    it('should show the creation modal when the button is clicked', async () => {
        let button = await UTILS.getElementByCss('[data-qa="create-sandbox"]', 2000);
        button.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let dialog = await UTILS.getElementByCss('[data-qa="create-sandbox-dialog"]');
        expect(dialog).not.toBeNull();
    });

    it('should close when the close button is pressed', async () => {
        let closeButton = await UTILS.getElementByCss('[data-qa="modal-close-button"]');
        closeButton.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let dialog = await UTILS.getElementByCss('[data-qa="create-sandbox-dialog"]');
        expect(dialog).toBeNull();
    });

    it('should update the sandbox id based on the entered name', async () => {
        let button = await UTILS.getElementByCss('[data-qa="create-sandbox"]');
        button.click();

        //Wait for the animation just in case
        await UTILS.wait(500);

        let name = await UTILS.getElementByCss('[data-qa="sandbox-create-name"]');
        name.sendKeys(process.env.SANDBOX_NAME, Key.TAB);

        // let id = await UTILS.getElementByCss('[data-qa="sandbox-create-id"]');
        // let generatedId = await id.getAttribute('value');

        // expect(generatedId).toBe('AUTOTESTSANDBOX3');

        let description = await UTILS.getElementByCss('[data-qa="sandbox-create-description"]');
        description.sendKeys('Sample auto description');
    });

    it('should select the correct FHIR version', async () => {
        let versionSelect = await UTILS.getElementByCss('[data-qa="sandbox-version"]');
        versionSelect.click();

        await UTILS.waitForElementCSS('[data-qa="fhir-stu3"]');
        let stu3 = await UTILS.getElementByCss('[data-qa="fhir-stu3"]');
        stu3.click();
        await UTILS.wait(500);
    });

    it('should create a sandbox', async () => {
        let createButton = await UTILS.getElementByCss('[data-qa="sandbox-submit-button"]');
        createButton.click();

        await UTILS.waitForElementCSS('[data-qa="sandbox-creating-loader"]');
        await UTILS.wait(500);
        await UTILS.waitForElementCSS('[data-qa="sandbox-loading-loader"]');
        await UTILS.wait(1500);

        let currentUrl = await UTILS.getCurrentURL();
        expect(currentUrl.toString()).toEqual(expect.stringContaining('AUTOTESTSANDBOX3'));
    });
});
