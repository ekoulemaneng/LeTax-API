const http = require('http')
const app = require('./app')
const server = http.createServer(app)
const { port } = require('./config')

server.listen(port, () => { console.log('The web server is running.')})