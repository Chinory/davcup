const path = require('path')

const webdav = require('webdav-server').v2
const helmet = require('helmet')
const express = require('express')

const server = new webdav.WebDAVServer()
const app = express()

// helmet
app.use(helmet())

// static
app.use(express.static(path.join(__dirname, 'public')))

// webdav
app.use(webdav.extensions.express(path.join(__dirname, 'dav'), server))

// start
app.listen(80)