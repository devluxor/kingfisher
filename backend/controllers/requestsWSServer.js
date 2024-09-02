import config from "../utils/config.js";
import { WebSocketServer } from "ws";
import logger from "../utils/logger.js";

export default () => {
  const clients = {}

  const wsServer = new WebSocketServer({port: config.WS_PORT});
  wsServer.on("connection", (ws, request) => {
    logger.info('📯 Backend-Frontend Request WebSocket Channel connected!')
    const nestId = request.url.split('=')[1]
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