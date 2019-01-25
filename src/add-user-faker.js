const faker = require('faker')
const { addUser } = require('./utils')


const obj = []

const getRndInteger = (min=1989, max=1999) => Math.floor(Math.random() * (max - min + 1) ) + min

const gender = ['male', 'female']
const genAmount = 1
for(let i=0; i < genAmount; i++) {
    const name = faker.name.findName()
    const nameSplit = name.split(' ')
    const data = {
        email: `${nameSplit[0]}.${nameSplit[1]}@gmail.com`.toLowerCase(),
        password: faker.internet.password(),
        name: name,
        firstName: nameSplit[0],
        lastName: nameSplit[1],
        yearOfBirth: getRndInteger(),
        gender: gender[getRndInteger(0, 1)]
    }
    obj.push(data)
}

addUser('./src/user-data.json', obj)
