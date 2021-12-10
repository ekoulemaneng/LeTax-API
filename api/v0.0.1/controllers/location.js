const axiosGetRequest = require('../services/axiosGetRequest')

const getLocation = async (ip) => await axiosGetRequest(ip)

module.exports = getLocation