const { By, until } = require('selenium-webdriver')
const delay = require('delay')
const { addUser, getUser, buildDriver } = require('../utils')


const register = async (user) => {
    let driver = await buildDriver()
    let ele = null

    try {
        await driver.get('https://www.eventpop.me/')

        await driver.findElement(By.linkText('Sign in / Sign up')).click()

        // go to signup
        ele = await driver.withXpath('//*[@id="new_user"]/div[2]/p[2]/a')
        // wait modal fade
        await delay(300)
        ele.click()

        // fill email
        ele = await driver.withXpath('//*[@id="new_user"]/div[1]/fieldset[1]/div[1]/input')
        ele.sendKeys(user.email)

        // fill password
        ele = await driver.withXpath('//*[@id="new_user"]/div[1]/fieldset[1]/div[2]/input')
        ele.sendKeys(user.password)

        // fill password confirmation
        ele = await driver.withXpath('//*[@id="user_password_confirmation"]')
        ele.sendKeys(user.password)

        // fill frist name
        ele = await driver.withXpath('//*[@id="user_firstname"]')
        ele.sendKeys(user.firstName)

        // fill last name
        ele = await driver.withXpath('//*[@id="user_lastname"]')
        ele.sendKeys(user.lastName)

        // expan year of birth
        ele = await driver.withXpath('//*[@id="new_user"]/div[1]/fieldset[2]/div[4]/div[1]/span/span[1]/span')
        ele.click()

        // select year of birth
        ele = await driver.withXpath(`//*[@id="select2-user_birthyear-results"]/li[${2014 - user.yearOfBirth}]`)
        ele.click()

        // select gender
        ele = await driver.withXpath(`//*[@id="new_user"]/div[1]/fieldset[2]/div[5]/span[3]/label`)
        ele.click()

         // scroll
        ele = await driver.wait(until.elementLocated(By.xpath('//*[@id="signin-modal"]'), 1000))
        await driver.executeScript('arguments[0].scrollTop = arguments[1]', ele, 500)

        // click sign up
        ele = await driver.withXpath('//*[@id="signin-modal"]/div/div[2]/div[2]/form/div[2]/p/button')
        ele.click()

        const url = await driver.getCurrentUrl()
        if(url === 'https://www.eventpop.me/users') {
            throw new Error('register fail')
        }
    } finally {
        await driver.quit()
    }
    return user
}

const registersFromUserdata = async () => {
    // start index at 52, limit 1
    const users = await getUser('./src/user-data.json', 52, 1)
    const obj = []

    for(const user of users) {
        await register(user)
            .then(res => {
                obj.push(user)
                console.log('[success] ==>', user.email)
            })
            .catch(err => {
                console.log('[err] ==>', user.email, err)
            })
    }
    addUser('./src/eventpop/user-data.json', obj)
    return true
}

registersFromUserdata()