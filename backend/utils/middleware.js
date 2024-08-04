import logger from './logger.js'

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export default {
  unknownEndpoint,
}