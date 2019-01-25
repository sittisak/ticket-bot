const faker = require('faker');
const jsonfile = require('jsonfile')

const obj = []

const getRndInteger = (min=1989, max=1999) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const gender = ['male', 'female']

for(let i=0; i < 1000; i++) {
    const name = faker.name.findName()
    const nameSplit = name.split(' ')
    const data = {
        email: `${name.replace(' ', '.')}@gmail.com`.toLowerCase(),
        password: faker.internet.password(),
        name: name,
        firstName: nameSplit[0],
        lastName: nameSplit[1],
        yearOfBirth: getRndInteger(),
        gender: gender[getRndInteger(0, 1)]
    }
    obj.push(data)
}

// const file = './user-data.json'
// jsonfile.writeFile(file, obj)
//     .then(res => console.log('Write complete'))
//     .catch(error => console.error(error))


