const jsonfile = require('jsonfile')

const run = async (file) => {
    const oldData = await jsonfile.readFile(file)
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


    const newData = oldData.map(user => {
        const aa = regex.test(user.email)
        if(!aa) {
           
            let email = user.email.replace('..', '.')
            email = email.replace(' ', '')
            email = email.replace('.@', '@')
            console.log(aa, user.email)
            const aaa = regex.test(email)
            console.log('-', aaa, email)

            if(!aaa) {
                isfail.push(email)
            }

            user.email = email
        }
        
        return user
    })

    console.log('<----')
    newData.forEach(user => {
        if(!regex.test(user.email)) {
            console.log(user.email)
        }
    })

    await jsonfile.writeFile(file, newData, { spaces: 2, EOL: '\r\n' })


   
}
//     const newData = oldData.concat(obj)
//     await jsonfile.writeFile(file, newData, { spaces: 2, EOL: '\r\n' })
//     return true
// }

run('./src/user-data.json')