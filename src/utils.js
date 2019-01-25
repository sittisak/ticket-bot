const jsonfile = require('jsonfile')

const addUser = async (file, obj) => {
    const oldData = await jsonfile.readFile(file)
    const newData = oldData.concat(obj)
    await jsonfile.writeFile(file, newData, { spaces: 2, EOL: '\r\n' })
    return true
}

module.exports = {
    addUser
}