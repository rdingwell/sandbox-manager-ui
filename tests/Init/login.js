const { Key } = require('selenium-webdriver');
const UTILS = require('../utils');

exports.login = describe('Login into the system', function () {
    it('should enter the correct username and password', async () => {
        let username = await UTILS.getElementById('j_username');
        let password = await UTILS.getElementById('j_password');
        await username.sendKeys('admin', Key.TAB);
        await password.sendKeys('password', Key.ENTER);
    });
});