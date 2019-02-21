// simple webserver mit Environment Variablen
const http = require('http')
const port = process.env.PORT || 3000

const requestHandler = (request, response) => {
  if (request.url === "/stop") {
    response.end('Node JS Server stopped')
    process.exit()
  }
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})