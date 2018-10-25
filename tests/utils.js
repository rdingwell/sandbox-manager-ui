const { Builder, By, Key, until } = require('selenium-webdriver');

const waitUntilTime = 10000;

async function getElementById (id) {
    const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime);
    return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}

async function getElementByXPath (xpath) {
    const el = await driver.wait(
        until.elementLocated(By.xpath(xpath)),
        waitUntilTime
    );
    return await driver.wait(until.elementIsVisible(el), waitUntilTime);
}