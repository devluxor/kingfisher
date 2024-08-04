import logger from './logger.js'

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
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

export {
  unknownEndpoint,
  errorHandler
}