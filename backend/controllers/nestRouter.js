import { Router } from "express";
import { temporaryNestIdValidator } from "../utils/middleware.js";
import DBSimulator from "../DBSimulator.dev.js";
import initializeWSServer from "./wsServer.js";
import { dateFormatter, generateId } from "../utils/others.js";
import { addRequest } from "../services/db-service.js";

const nestRouter = Router()
const wsClients = initializeWSServer()

// This route represents the main endpoint
nestRouter.all('/:nestId*', temporaryNestIdValidator, async (req, res) => {
  const nestId = req.params.nestId
  const method = req.method
  const path = req.params[0]
  const headers = req.headers
  const body = req.body
  const arrivedOn = new Date()
  const id = generateId()

  const processedRequest = { 
    id, 
    nestId, 
    path, 
    headers, 
    method, 
    body,
    arrivedOn, 
  }

  // DBSimulator('addReq', nestId, null, processedRequest)
  addRequest(processedRequest)
  const clients = wsClients()
  if (clients[nestId]) {
    console.log('🌈message sent from the server!')
    clients[nestId].send(JSON.stringify(processedRequest))
  }

  res.status(200).send('Request received')
})

export default nestRouter
