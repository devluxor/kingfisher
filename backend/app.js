// we create the necessary references to the modules we have installed via `npm` or that are
// present in other folders (`utils`, `controllers`...)
import express from 'express'
import cors from 'cors'
import pkg from 'pg';
const { Pool } = pkg;

// handles environment variables like passwords, api keys, ports, etc
import config from './utils/config.js'

//  HTTP request logger middleware for node.js
import morgan from 'morgan'

// custom middleware (error handlers, unknown route handler, custom loggers, etc)
import { unknownEndpoint, errorHandler } from './utils/middleware.js'
import apiRouter from './controllers/apiRouter.js'
import nestRouter from './controllers/nestRouter.js'

const app = express()
app.use(cors())
app.use(express.json())
let pool

if (process.env.NODE_ENV === 'development') {
  console.log('🎑 Developing!')
  // This adds a custom token to the logger 'morgan',
  // so the body of the request sent to the server is shown on the terminal
  morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  app.use(morgan(':method :url :status :body'))
  console.log('SERVER STARTED 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟')
}

app.use('/api', apiRouter)
app.use('/!', nestRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app