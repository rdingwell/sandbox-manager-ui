const { Builder } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
require('chromedriver');
require('geckodriver');

const d = new Builder().forBrowser('chrome').build();
const rootURL = 'localhost:3001';
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

exports.init = describe('Initialize the test suite', function () {
    it('waits for the driver to start', () => d.then(_d => driver = _d));

    it('initialises the context', async () => {
        await driver.manage().window().maximize();
        await driver.get(rootURL);
    });
});