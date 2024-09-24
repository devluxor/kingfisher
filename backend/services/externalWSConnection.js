import {WebSocket, WebSocketServer} from "ws";
import {isValidWSURL, processWSMessage } from "../utils/others.js";
import { storeWSMessage } from "./db-service.js";
import config from "../utils/config.js";
import logger from "../utils/logger.js";

let frontendWSClients = {}
// 2: this server will send messages to ws client in frontend app
// for it to upload the DOM with the newly arrived messages
const wsLocalServer = new WebSocketServer({port: config.WS_PORT_CUSTOM})

wsLocalServer.on('connection', (ws, request) => {
  logger.info('📯 Backend-Frontend Custom Connection WebSocket Channel Connected!')
  const nestId = request.url.split('=')[1]
  frontendWSClients[nestId] = ws
})

wsLocalServer.on('close', (ws, request) => {
  logger.info('🛑 Backend-Frontend Custom Connection WebSocket Channel Closed!')
})

export const isConnectionWithFrontendReady = async (nestId) => {
  return new Promise((resolve) => {
    const checkConnection = () => {
      const clients = (() => frontendWSClients)();
      if (clients.hasOwnProperty(nestId)) {
        resolve(true);
      } else {
        setTimeout(checkConnection, 500); // Retry after 500ms if not found
      }
    };

    checkConnection();
  });
}

// 1: this client will receive messages from the external WS server
// located using the URL introduced in the frontend input
export const initializeCustomWSConnectionClient = (wsServerURL, nestId) => {
  // await isConnectionWithFrontendReady(nestId)

  if (!isValidWSURL(wsServerURL)) {
    logger.error('WebSocket error: INVALID WS SERVER URL')
    const clients = (() => frontendWSClients)();
    setTimeout(() => clients[nestId]?.send(JSON.stringify({error: 'invalid port number'})), 2000)
    return
  };
  
  let ws
  try {
    ws = new WebSocket(wsServerURL)
  } catch (e) {
    console.error(e)
  }
  
  ws.addEventListener("open", () => {
    logger.info(`🏠 Custom WebSocket Client connected in backend to external server: `, wsServerURL)
  })

  ws.addEventListener("error", (event) => {
    logger.error("WebSocket error: ", event.error);
    const clients = (() => frontendWSClients)();
    logger.info(clients)
    try {
      clients[nestId].send(JSON.stringify({error: event.error}))
    } catch (e) {
      logger.error('client not found when trying to send error message', e)
    }
    ws.close()
  });

  ws.addEventListener("message", async (event) => {
    const processedMessage = processWSMessage(event.data, nestId, wsServerURL)
    logger.info(`🚀 Message from external WebSocket server ${wsServerURL} received by backend client`, event.data)
    await storeWSMessage(processedMessage)
    const clients = (() => frontendWSClients)();
    clients[nestId]?.send(JSON.stringify(processedMessage))
  })

  ws.addEventListener('close', () => {
    logger.info('❌ Connection with external ws server closed')
    const clients = (() => frontendWSClients)();
    clients[nestId]?.terminate()
  })
  
  return ws
}