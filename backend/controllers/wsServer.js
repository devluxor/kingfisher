import config from "../utils/config.js";
import { WebSocketServer } from "ws";

export default () => {
  const clients = {}

  const wsServer = new WebSocketServer({port: config.WS_PORT});
  wsServer.on("connection", (ws) => {
    console.log('📯 Web Socket Backend Server connected!')

    ws.on('message', (message) => {
      const clientData = JSON.parse(message.toString())
      clients[clientData.nestId] = ws;
      console.log('🎨 Connection with frontend app established!', clientData)
    });
    
    ws.on("close", (code, reason) => {
      console.log('✖ Connection with client closed!')
      console.log('✖ Reason: ', code, reason.toString())
      const nestId = reason.toString()
      delete clients[nestId]
    });
  })

  // returns a callback that gives access to the runtime
  // websocket clients store via this closure:
  return () => clients
}