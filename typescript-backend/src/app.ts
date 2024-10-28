// we create the necessary references to the modules we have installed via `npm` or that are
// present in other folders (`utils`, `controllers`...)
import express from 'express'
import cors from 'cors'
import logger from "./utils/logger.js";
import config from './utils/config.js'

// handles environment variables like passwords, api keys, ports, etc

//  HTTP request logger middleware for node.js
import morgan from 'morgan'

// custom middleware (error handlers, unknown route handler, custom loggers, etc)
import { unknownEndpoint, errorHandler } from './utils/middleware.js'
import apiRouter from './controllers/apiRouter.js'
import nestRouter from './controllers/nestRouter.js'
import { IncomingMessage } from 'http';

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }));

export interface MorganLogWithBody extends IncomingMessage {
  body: string
}

if (process.env.NODE_ENV === 'development') {
  morgan.token('body', (req: MorganLogWithBody ) => {
    return JSON.stringify(req.body)
  })
  app.use(morgan(':method :url :status :body'))
  logger.info('SERVER STARTED 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟')
  logger.info('🎑 Development mode!')
}

app.use('/api', apiRouter)
app.use('/!', nestRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})