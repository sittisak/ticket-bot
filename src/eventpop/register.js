require('chromedriver')
const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const delay = require('delay')
const jsonfile = require('jsonfile')

const chromeOptions = new chrome.Options()
chromeOptions.addArguments('disable-infobars')
// chromeOptions.headless()

const getEle = async (driver, xpath) => {
    const ele = await driver.wait(until.elementLocated(By.xpath(xpath), 1000))
    await driver.wait(until.elementIsVisible(ele), 5000)
    return ele
}

const register = async (user) => {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
        .build()
    let ele = null

    try {
        await driver.get('https://www.eventpop.me/')

        await driver.findElement(By.linkText('Sign in / Sign up')).click()

        // go to signup
        ele = await getEle(driver, '//*[@id="new_user"]/div[2]/p[2]/a')
        // wait modal fade
        await delay(300)
        ele.click()

        // fill email
        ele = await getEle(driver, '//*[@id="new_user"]/div[1]/fieldset[1]/div[1]/input')
        ele.sendKeys(user.email)

        // fill password
        ele = await getEle(driver, '//*[@id="new_user"]/div[1]/fieldset[1]/div[2]/input')
        ele.sendKeys(user.password)

        // fill password confirmation
        ele = await getEle(driver, '//*[@id="user_password_confirmation"]')
        ele.sendKeys(user.password)

        // fill frist name
        ele = await getEle(driver, '//*[@id="user_firstname"]')
        ele.sendKeys(user.firstName)

        // fill last name
        ele = await getEle(driver, '//*[@id="user_lastname"]')
        ele.sendKeys(user.lastName)

        // expan year of birth
        ele = await getEle(driver, '//*[@id="new_user"]/div[1]/fieldset[2]/div[4]/div[1]/span/span[1]/span')
        ele.click()

        // select year of birth
        ele = await getEle(driver, `//*[@id="select2-user_birthyear-results"]/li[${2014 - user.yearOfBirth}]`)
        ele.click()

        // select gender
        ele = await getEle(driver, `//*[@id="new_user"]/div[1]/fieldset[2]/div[5]/span[3]/label`)
        ele.click()

         // scroll
        ele = await driver.wait(until.elementLocated(By.xpath('//*[@id="signin-modal"]'), 1000))
        await driver.executeScript('arguments[0].scrollTop = arguments[1]', ele, 200)

        // click sign up
        ele = await getEle(driver, '//*[@id="signin-modal"]/div/div[2]/div[2]/form/div[2]/p/button')
        ele.click()

        const url = await driver.getCurrentUrl()
        if(url === 'https://www.eventpop.me/users') {
            throw new Error('register fail')
        }
    } finally {
        await driver.quit();
    }

    return user
}


const registers = async () => {
    const userData = await jsonfile.readFile('./src/user-data.json')
        .then(obj => obj)
        .catch(error => console.error(error))
    const eventpopUsers = []

    for(let i=12; i < 50; i++) {
        await register(userData[i])
            .then(user => {
                eventpopUsers.push(user)
                console.log('[success] ==>', userData[i].email)
            })
            .catch(err => {
                console.log('[err] ==>', userData[i].email)
            })
    }

    await jsonfile.writeFile('./src/eventpop/user-data.json', eventpopUsers)
        .then(res => console.log('Write complete'))
        .catch(error => console.error(error))

    return true
}

registers()



// {"email":"edward.kirlin@gmail.com","password":"RCUESwIMcY2kSSi","name":"Edward Kirlin","firstName":"Edward","lastName":"Kirlin","yearOfBirth":1998,"gender":"male"},{"email":"andreane.harvey@gmail.com","password":"Jkm6XxQLK6_kVEy","name":"Andreane Harvey","firstName":"Andreane","lastName":"Harvey","yearOfBirth":1989,"gender":"female"},{"email":"daija.schinner@gmail.com","password":"jTuFU7fmHMXIheV","name":"Daija Schinner","firstName":"Daija","lastName":"Schinner","yearOfBirth":1999,"gender":"female"},{"email":"thea.becker@gmail.com","password":"wCiCkgtfUpg29zq","name":"Thea Becker","firstName":"Thea","lastName":"Becker","yearOfBirth":1989,"gender":"female"},{"email":"jerrell.abbott@gmail.com","password":"NHMD9YnR_K3r9D2","name":"Jerrell Abbott","firstName":"Jerrell","lastName":"Abbott","yearOfBirth":1998,"gender":"male"},{"email":"lelah.ryan@gmail.com","password":"g9MWK43fdxhSYH8","name":"Lelah Ryan","firstName":"Lelah","lastName":"Ryan","yearOfBirth":1991,"gender":"female"},{"email":"emmalee.legros@gmail.com","password":"FYcSffCBnAidDrD","name":"Emmalee Legros","firstName":"Emmalee","lastName":"Legros","yearOfBirth":1993,"gender":"female"},{"email":"ola.ruecker@gmail.com","password":"jB5x_lK6Mc6s96D","name":"Ola Ruecker","firstName":"Ola","lastName":"Ruecker","yearOfBirth":1991,"gender":"male"},{"email":"alta.bins@gmail.com","password":"GxFYHL4lvcbrRue","name":"Alta Bins","firstName":"Alta","lastName":"Bins","yearOfBirth":1992,"gender":"male"}