const { By, until } = require('selenium-webdriver')
const delay = require('delay')
const { addUser, getUser, buildDriver } = require('../utils')


const login = async (user) => {
    let driver = await buildDriver()
    let ele = null

    try {
        await driver.get('https://www.eventpop.me/')

        await driver.findElement(By.linkText('Sign in / Sign up')).click()

        // wait modal fade
        await delay(300)

        // fill email
        ele = await driver.withXpath('//*//*[@id="new_user"]/div[1]/div[1]/input')
        ele.sendKeys(user.email)

        // fill password
        ele = await driver.withXpath('//*[@id="new_user"]/div[1]/div[2]/input')
        ele.sendKeys(user.password)

        // click sign in
        ele = await driver.withXpath('//*[@id="new_user"]/div[2]/p[1]/button')
        ele.click()

        const url = await driver.getCurrentUrl()
        if(url !== 'https://www.eventpop.me/') {
            throw new Error('login fail')
        }
    } finally {
        await driver.quit()
    }
    return user
}

const loginFromUserRegister = async () => {
    // 0 - 51 is verify
    const users = await getUser('./src/eventpop/user-data.json', 0, 10)

    for(const user of users) {
        await login(user)
            .then(res => {
                console.log('[success] ==>', user.email)
            })
            .catch(err => {
                console.log('[err] ==>', user.email, err)
            })
    }
    return true
}

loginFromUserRegister()