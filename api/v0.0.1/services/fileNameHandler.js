const fs = require('fs')
const path = require('path')
 
const nameFile = (filePath, fileName, fileType, model, property) => {
    const currentPathFile = filePath + fileName
    const newPathFile = filePath + model[property].trim().toLowerCase() + '_' + fileType + path.extname(currentPathFile)
    fs.rename(currentPathFile, newPathFile, function(err) {
        if (err) console.error(err)
        else console.log('Country image successfully renamed.')
    })
}

const deleteFile = (filePath, urlPath, model, property) => {
    const pathFile = filePath + model[property].replace(urlPath, '')
    fs.unlink(pathFile, err => {
        if (err) throw err
        console.log('Country image successfully deleted.')
    })
}

module.exports = { nameFile, deleteFile }