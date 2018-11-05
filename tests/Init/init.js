const { Builder } = require('selenium-webdriver');
const { setDriver } = require('../utils');
// require('selenium-webdriver/chrome');
require('selenium-webdriver/firefox');
// require('chromedriver');
require('geckodriver');

const d = new Builder().forBrowser('firefox').build();
const rootURL = 'http://localhost:3001';
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5;

exports.init = describe('Initialize the test suite', function () {
    it('should wait for the driver to start', () => d.then(_d => driver = _d));

    it('should initialize the context', async () => {
        await driver.manage().window().maximize();
        await driver.get(rootURL);
        setDriver(driver);
    });
});