// simple webserver mit environment variablen und volumes
const http = require('http')
const port = process.env.PORT || 3000
const fs = require('fs');

const requestHandler = (request, response) => {
  if (request.url === "/stop") {
    response.end('Node JS Server stopped')
    process.exit()
  }
  if (fs.existsSync('/app/www-root/index.html')) {
    var content = fs.readFileSync('/app/www-root/index.html', 'utf8');
    response.end(content)
  } else {
    response.end('Hello Node.js Server!')
  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})