const { Key } = require('selenium-webdriver');
const UTILS = require('../utils');

exports.login = describe('Login into the system', function () {
    it('should enter the correct username and password', async () => {
        let username = await UTILS.getElementById('j_username');
        let password = await UTILS.getElementById('j_password');
        await username.sendKeys('admin', Key.TAB);
        await password.sendKeys('password', Key.ENTER);
    });

    it('should redirect to the dashboard after login', async () => {
        await UTILS.wait(5000);

        let handles = await UTILS.driver.getAllWindowHandles();
        await UTILS.driver.switchTo().window(handles[0]);

        await UTILS.waitForElementCSS('[data-qa="dashboard-page"]');
        let dashboard = UTILS.getElementByCss('[data-qa="dashboard-page"]');
        expect(dashboard).not.toBeNull();
    });
});
