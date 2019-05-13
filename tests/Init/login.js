const { Key } = require('selenium-webdriver');
const UTILS = require('../utils');

exports.login = describe('Login into the system', function () {
    it('should open the login page', async () => {
        await UTILS.waitForElementXPATH('//*[@id="root"]/div/div/div/div[2]/div[1]/div/div[3]/div[1]/div/form/div[1]/button');
        let loginButton = await UTILS.getElementByXPath('//*[@id="root"]/div/div/div/div[2]/div[1]/div/div[3]/div[1]/div/form/div[1]/button');
        expect(loginButton).not.toBeNull();
        loginButton.click();
    });

    it('should click the see the login credentials form', async () => {
        await UTILS.wait(2000);
        let handles = await UTILS.driver.getAllWindowHandles();
        expect(handles.length).toBe(2);
        await UTILS.driver.switchTo().window(handles[1]);
    });

    it('find the username filed and enter the data in it', async () => {
        await UTILS.waitForElementXPATH('//*[@id="identifierId"]');
        let username = await UTILS.getElementByXPath('//*[@id="identifierId"]');
        expect(username).not.toBeNull();
        await username.sendKeys('dimitar@interopion.com', Key.ENTER);
    });

    it('should find the password fields and enter the data in it', async () => {
        await UTILS.waitForElementXPATH('//*[@id="password"]/div[1]/div/div[1]/input');
        let password = await UTILS.getElementByXPath('//*[@id="password"]/div[1]/div/div[1]/input');
        expect(password).not.toBeNull();
        await password.sendKeys('Fuck_Off86', Key.ENTER);
    });

    it('should redirect to the dashboard after login', async () => {
        let handles = await UTILS.driver.getAllWindowHandles();
        await UTILS.driver.switchTo().window(handles[0]);

        let print = async () => {
            let source = await UTILS.driver.getPageSource();
            console.log(source);
        };

        let timer = setInterval(print, 1000);

        await UTILS.waitForElementCSS('[data-qa="dashboard-page"]');
        let dashboard = UTILS.getElementByCss('[data-qa="dashboard-page"]');
        expect(dashboard).not.toBeNull();

        clearInterval(timer);
    });
});
