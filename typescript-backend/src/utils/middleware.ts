import { NextFunction, Request, Response } from 'express'
import logger from './logger.js'

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: `unknown endpoint: ${request.originalUrl}` })
}

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  logger.error(error)

  // Handle specific error types
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message }) //!
  }

  // Handle generic errors
  response.status(500).json({ error: 'Internal Server Error' });

  next(error)
}

const nestIdValidator = (request: Request, response: Response, next: NextFunction) => {
  const UUID_CHARS = 22
  const UUID_REGEX = new RegExp(`^[A-Za-z0-9]{${UUID_CHARS}}$`, 'g')
  if (!request.params.nestId.match(UUID_REGEX)) {
    return response.status(401).json({ error: 'invalid nest id' });
  }

  next()
}

export {
  unknownEndpoint,
  errorHandler,
  nestIdValidator,
}