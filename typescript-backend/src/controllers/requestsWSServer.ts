import config from "../utils/config.js";
import { WebSocketServer } from "ws";
import logger from "../utils/logger.js";
import { WSClientsList } from "../@types/services.js";

export default () => {
  const clients:WSClientsList = {}

  const wsServer = new WebSocketServer({port: Number(config.WS_PORT)});
  wsServer.on("connection", (ws, request) => {
    const requestURL = request.url
    try {
      if (typeof requestURL != 'string') {
        throw new TypeError()
      }
    } catch {
      logger.error('Request URL not present in Backend-Frontend Websocket connection message')
      return
    }
    
    logger.info('📯 Backend-Frontend Request WebSocket Channel connected!')
    const nestId = requestURL.split('=')[1]
    clients[nestId] = ws

    ws.on("close", (code, reason) => {
      logger.info('✖ Backend-Frontend Request WebSocket Channel closed!')
      logger.info('✖ Reason: ', code, reason.toString())
      const nestId = reason.toString()
      delete clients[nestId]
    });
  })

  // returns a callback that gives access to the runtime
  // websocket clients store object via this closure:
  return () => clients
}