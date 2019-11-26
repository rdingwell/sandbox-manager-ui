const { Builder, Capabilities } = require('selenium-webdriver');
const { setDriver } = require('../utils');
require('selenium-webdriver/chrome');
// require('selenium-webdriver/firefox');
// require('chromedriver');
// require('geckodriver');

const cap = Capabilities.chrome();
cap.set('chromeOptions', {
    'args': ["--disable-extensions", "--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox", "--headless"]
    // 'args': ["--disable-extensions", "--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox"]
});
const d = new Builder().forBrowser('chrome').withCapabilities(cap).build();
// const rootURL = 'http://localhost:3001';
const rootURL = 'https://sandbox-test.logicahealth.org';
let driver;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 30 * 3;

exports.init = describe('Initialize the test suite', function () {
    it('should wait for the driver to start', () => d.then(_d => driver = _d));

    it('should initialize the context', async () => {
        // await driver.manage().window().maximize();
        await driver.get(rootURL);
        setDriver(driver);
    });
});
