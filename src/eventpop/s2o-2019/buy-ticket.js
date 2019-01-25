const { By, until } = require('selenium-webdriver')
const delay = require('delay')
const Observable = require('object-observer')
const { addUser, getUser, buildDriver } = require('../../utils')


// const buy = async (user) => {
//     let driver = await buildDriver()
//     let ele = null

//     try {
//         await driver.get('https://www.eventpop.me/')

//         await driver.findElement(By.linkText('Sign in / Sign up')).click()

//         // go to signup
//         ele = await driver.withXpath('//*[@id="new_user"]/div[2]/p[2]/a')
//         // wait modal fade
//         await delay(300)
//         ele.click()

//         // fill email
//         ele = await driver.withXpath('//*[@id="new_user"]/div[1]/fieldset[1]/div[1]/input')
//         ele.sendKeys(user.email)

//         // fill password
//         ele = await driver.withXpath('//*[@id="new_user"]/div[1]/fieldset[1]/div[2]/input')
//         ele.sendKeys(user.password)

//         // fill password confirmation
//         ele = await driver.withXpath('//*[@id="user_password_confirmation"]')
//         ele.sendKeys(user.password)

//         // fill frist name
//         ele = await driver.withXpath('//*[@id="user_firstname"]')
//         ele.sendKeys(user.firstName)

//         // fill last name
//         ele = await driver.withXpath('//*[@id="user_lastname"]')
//         ele.sendKeys(user.lastName)

//         // expan year of birth
//         ele = await driver.withXpath('//*[@id="new_user"]/div[1]/fieldset[2]/div[4]/div[1]/span/span[1]/span')
//         ele.click()

//         // select year of birth
//         ele = await driver.withXpath(`//*[@id="select2-user_birthyear-results"]/li[${2014 - user.yearOfBirth}]`)
//         ele.click()

//         // select gender
//         ele = await driver.withXpath(`//*[@id="new_user"]/div[1]/fieldset[2]/div[5]/span[3]/label`)
//         ele.click()

//          // scroll
//         ele = await driver.wait(until.elementLocated(By.xpath('//*[@id="signin-modal"]'), 1000))
//         await driver.executeScript('arguments[0].scrollTop = arguments[1]', ele, 500)

//         // click sign up
//         ele = await driver.withXpath('//*[@id="signin-modal"]/div/div[2]/div[2]/form/div[2]/p/button')
//         ele.click()

//         const url = await driver.getCurrentUrl()
//         if(url === 'https://www.eventpop.me/users') {
//             throw new Error('register fail')
//         }
//     } finally {
//         await driver.quit()
//     }
//     return user
// }

class ConcurrentWorker { 
    constructor(objs) {
        this.workerFunc = null
        this.outOfAvailableFunc = null
        this.concurrent = null
        this.countFinish = 0
        this.objs = objs.map((obj, i) => {
            obj.status = 'available'
            obj.success = () => {
                const nextObj = this.getAvailableObj()
                this.objs[i].status = 'success'
                if(nextObj !== null) {
                    this.workerFunc(nextObj)
                }
            }
            obj.fail = () => {
                const nextObj = this.getAvailableObj()
                this.objs[i].status = 'available'
                if(nextObj !== null) {
                    this.workerFunc(nextObj)
                }
            }
            return obj  
        })
    }

    getAvailableObj() {
        const availableObjIndex = this.objs.findIndex(obj => obj.status === 'available')
        if(availableObjIndex === -1) {
            this.countFinish++
            if(this.concurrent === this.countFinish) {
                const objs = this.objs.map((obj) => {
                    delete obj.success
                    delete obj.fail
                    return obj
                })
                this.outOfAvailableFunc(objs)
            }
            return null
        }
        this.objs[availableObjIndex].status = 'padding'
        return this.objs[availableObjIndex]
    }

    worker(func) {
        this.workerFunc = func
    }

    outOfAvailable(func) {
        this.outOfAvailableFunc = func
    }

    start(concurrent=10) {
        this.concurrent = concurrent
        if(this.workerFunc === null) {
            throw new Error('worker function not assess')
        }
        for (let i = 0; i < concurrent; i++) {
            const obj = this.getAvailableObj()
            this.workerFunc(obj)
        }
    }
}

const goBuy = async (user) => {
    const getRndInteger = (min=1989, max=1999) => Math.floor(Math.random() * (max - min + 1) ) + min
    await delay(getRndInteger(1000, 3000))
    return true
}

const run = async () => {
    const users = await getUser('./src/eventpop/user-data.json', 0)

    const concurrentWorker = new ConcurrentWorker(users)

    concurrentWorker.worker((user) => {
        console.log(user.email)
        goBuy(user).then(res => user.success())
    })

    concurrentWorker.outOfAvailable((users) => {
        // console.log(users)
        console.log('finish')
    })

    const concurrent = 10
    concurrentWorker.start(concurrent)
    return true
}

run()