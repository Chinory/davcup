const path = require('path')

const config = require('config-lite')(__dirname)
const webdav = require('webdav-server').v2
const helmet = require('helmet')
const express = require('express')

const app = express()

// helmet
app.use(helmet())

// static
app.use(express.static(path.join(__dirname, 'public')))

// webdav
const userManager = new webdav.SimpleUserManager()
const user = userManager.addUser(config.username, config.password, false)
const privilegeManager = new webdav.SimplePathPrivilegeManager();
privilegeManager.setRights(user, '/', [ 'all' ]);
const server = new webdav.WebDAVServer({
  privilegeManager: privilegeManager
})
app.use(webdav.extensions.express(path.join(__dirname, 'dav'), server))

// log
server.afterRequest((arg, next) => {
  // Display the method, the URI, the returned status code and the returned message
  console.log('>>', arg.request.method, arg.uri, '>', arg.response.statusCode, arg.response.statusMessage);
  // If available, display the body of the response
  console.log(arg.responseBody);
  next();
})

// start
app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`)
})