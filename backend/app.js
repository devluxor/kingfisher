// we create the necessary references to the modules we have installed via `npm` or that are
// present in other folders (`utils`, `controllers`...)
import express from 'express'
import cors from 'cors'

// handles environment variables like passwords, api keys, ports, etc
import config from './utils/config.js'

//  HTTP request logger middleware for node.js
import morgan from 'morgan'

// custom middleware (error handlers, unknown route handler, custom loggers, etc)
import middleware from './utils/middleware.js'
import logger from './utils/logger.js'

const app = express()

// This adds a custom token to the logger 'morgan',
// so the body of the request sent to the server is shown on the terminal
morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :body'))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

export default app