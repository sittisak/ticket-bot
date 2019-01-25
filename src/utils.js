require('chromedriver')
const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const jsonfile = require('jsonfile')

const addUser = async (file, obj) => {
    const oldData = await jsonfile.readFile(file)
    const newData = oldData.concat(obj)
    await jsonfile.writeFile(file, newData, { spaces: 2, EOL: '\r\n' })
    return true
}

const getUser = async (file, start=0, limit=-1) => {
    const data = await jsonfile.readFile(file)
    if(limit === -1) {
        return data.slice(start)
    }
    return data.slice(start, start+limit)
}

const buildDriver = async (headless = false) => {
    const chromeOptions = new chrome.Options()
    chromeOptions.addArguments('disable-infobars')
    if(headless) {
        chromeOptions.headless()
    }

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build()
    
    driver.withXpath = async (xpath) => {
        const ele = await driver.wait(until.elementLocated(By.xpath(xpath), 1000))
        await driver.wait(until.elementIsVisible(ele), 3000)
        return ele
    }

    driver.withCss = async (selector) => {
        const ele = await driver.wait(until.elementLocated(By.xpath(selector), 1000))
        await driver.wait(until.elementIsVisible(ele), 3000)
        return ele
    }

    return driver
}

module.exports = {
    addUser,
    getUser,
    buildDriver,
}