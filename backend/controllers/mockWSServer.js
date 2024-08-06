import config from "../utils/config.js";
import { WebSocketServer } from "ws";

export default () => {
  const mockClients = {}

  const wsServer = new WebSocketServer({port: 9090});
  wsServer.on("connection", (ws) => {
    console.log('🦘 Mock Web Socket Server connected!')
    ws.on('message', (message) => {
      console.log('📩 Message received from mock client!')
      const clientData = JSON.parse(message.toString())
      mockClients[clientData.nestId] = ws;
    });
    
    ws.on("close", (_, reason) => {
      console.log('✖ Connection with client closed!')
      const nestId = reason.toString()
      delete mockClients[nestId]
    });
  })

  // returns a callback that gives access to the runtime
  // websocket mockClients store via this closure:
  return () => mockClients
}