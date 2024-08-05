import config from "../utils/config.js";
import { WebSocketServer } from "ws";

export default () => {
  const clients = {}

  const wsServer = new WebSocketServer({port: config.WS_PORT});
  wsServer.on("connection", (ws) => {
    console.log('📯 Web Socket Server connected!')

    ws.on('message', (message) => {
      const clientData = JSON.parse(message.toString())
      clients[clientData.nestId] = ws;
      console.log('📩 Message received from client!', clientData)
    });
    
    ws.on("close", (_, reason) => {
      console.log('✖ Connection with client closed!')
      const nestId = reason.toString()
      delete clients[nestId]
    });
  })

  // returns a callback that gives access to the runtime
  // websocket client store via this closure:
  return () => clients
}