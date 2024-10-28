import { Router } from "express";
import { nestIdValidator } from "../utils/middleware.js";
import initializeWSServer from "./requestsWSServer.js";
import { processRequest } from "../utils/others.js";
import { storeRequest } from "../services/db-service.js";
import logger from "../utils/logger.js";
import { WSClientsList } from "../@types/services.js";

const nestRouter = Router()
const getWsClients = initializeWSServer()

nestRouter.all('/:nestId*', nestIdValidator, async (req, res, next) => {
  try {
    const nestId = req.params.nestId
    const processedRequest = processRequest(req)
    await storeRequest(processedRequest)
    const clients:WSClientsList = getWsClients()
    if (clients[nestId]) {
      logger.info('🌈 Request received in nest, sending message to frontend client!')
      clients[nestId].send(JSON.stringify(processedRequest))
    }
  
    res.status(200).send('Request received')
  } catch (e) {
    next(e)
  }
})

export default nestRouter
