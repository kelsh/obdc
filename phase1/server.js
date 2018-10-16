/**
 * server.js
 * Office Blankets Phase 1 Express Server
 */

const path = require('path')
const express = require('express')
const helmet = require('helmet')
const app = express()
const port = 6969

/**
 * Middlewares
 */
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Routes
 */
app.get('/', (req, res) => {
   res.sendFile('./public/index.html')}
)

/**
 * Start Server
 */
app.listen(port, () => console.log(`Server up - port ${port}!`))
