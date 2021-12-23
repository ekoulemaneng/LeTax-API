const { clientRedis } = require('../../../config')

const checkCache = async (key) => {
    if (await clientRedis.exists(key)) return true
    return false
}

const setCache = async (key, value) => await clientRedis.set(key, JSON.stringify(value))

const getCache = async (key) => await JSON.parse(await clientRedis.get(key))

module.exports = { checkCache, setCache, getCache }