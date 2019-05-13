const { Key } = require('selenium-webdriver');
const UTILS = require('../utils');

exports.login = describe('Login into the system', function () {
    it('should enter the correct username and password', async () => {
        await UTILS.waitForElementXPATH('//*[@id="root"]/div/div/div/div[2]/div[1]/div/div[3]/div[1]/div/form/div[1]/button');
        let loginButton = await UTILS.getElementByXPath('//*[@id="root"]/div/div/div/div[2]/div[1]/div/div[3]/div[1]/div/form/div[1]/button');
        loginButton.click();

        await UTILS.wait(2000);

        let handles = await UTILS.driver.getAllWindowHandles();
        await UTILS.driver.switchTo().window(handles[1]);

        await UTILS.waitForElementXPATH('//*[@id="identifierId"]');
        let username = await UTILS.getElementByXPath('//*[@id="identifierId"]');
        await username.sendKeys('dimitar@interopion.com', Key.ENTER);

        await UTILS.waitForElementXPATH('//*[@id="password"]/div[1]/div/div[1]/input');
        let password = await UTILS.getElementByXPath('//*[@id="password"]/div[1]/div/div[1]/input');
        await password.sendKeys('Fuck_Off86', Key.ENTER);

        await UTILS.driver.switchTo().window(handles[0]);

        await UTILS.waitForElementCSS('[data-qa="dashboard-page"]');
    });
});
