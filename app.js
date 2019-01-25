require('chromedriver')
const {Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const delay = require('delay')

const chromeOptions = new chrome.Options()
chromeOptions.addArguments('disable-infobars')
// chromeOptions.headless()

const getEle = async (driver, xpath) => {
    const ele = await driver.wait(until.elementLocated(By.xpath(xpath), 1000))
    await driver.wait(until.elementIsVisible(ele), 5000)
    return ele
}

const run = async () => {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build()
    let ele = null
    
    try {
        await driver.get('https://www.eventpop.me/e/4591-rimphamusicfestival7')

        // await driver.findElement(By.linkText('Sign in / Sign up')).click()

        // expan amount ticket
        ele = await getEle(driver, '//*[@id="place-order"]/div[1]/div/div/div[1]/div[3]/span/span[1]/span')
        ele.click()

        // select 2 ticcket 
        ele = await getEle(driver, '//*[@id="select2-ticket_types_16194_quantity-results"]/li[3]')
        ele.click()

        // buy ticket
        ele = await getEle(driver, '//*[@id="submit-order"]')
        ele.click()

        // go to login
        ele = await getEle(driver, '//*[@id="signin-modal"]/div/div[2]/div[2]/p[2]/a')
        // wait modal fade
        await delay(300)
        ele.click()

        ele = await getEle(driver, '//*[@id="user_email"]')
        ele.sendKeys('bankmagic@gmail.com')

        ele = await getEle(driver, '//*[@id="user_password"]')
        ele.sendKeys('12345')

        
       


        // await driver.findElement(By.xpath('//*[@id="signin-modal"]/div/div[2]/div[2]/p[2]/a')).click()

        //*[@id="signin-modal"]/div/div[2]/div[2]/p[2]/a
        

        // const aa = await signIn.getRect()
        // console.log('--->', aa, signIn)
        // signIn.sendKeys('bbankmamgic')


        // await driver.actions({bridge: true}).click(signIn).perform()
        // const actions = await new ActionSequence(driver)
        // actions.mouseMove(signIn).click().perform()


        // const drop1 = driver.findElement())
        // drop1.click()
        // await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    } finally {
        // await driver.quit();
    }
}

run().then()
