const allDataProvided = (data) => {
    for (let prop in data) {
        if (data[prop] == '') return false
    }
    return true
}

const areSameStrings = (stringOne, stringTwo) => {
    return stringOne === stringTwo
}

const isStringMatchRegex = (string, regex) => {
    return regex.test(string)
}

module.exports = {allDataProvided, areSameStrings, isStringMatchRegex}