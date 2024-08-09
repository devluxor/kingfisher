export const createWSClient = (currentNest, wsServerURL, connection) => {
  const isMockWSClient = wsServerURL !== null

  if (!isMockWSClient) {
    wsServerURL = import.meta.env.DEV ? `ws://localhost:8080` : `wss://kingfisher.luxor.dev/ws`
  }

  const ws = new WebSocket(wsServerURL)

  // message related handlers:
  const onOpenConnection = () => {
    console.log(`📯WS${isMockWSClient? ' Mock' : ''} Client Created!`)
    console.log(`📯Connection to WS${isMockWSClient? ' Mock' : ''} Server Enabled!`)

    ws.send(JSON.stringify({
      status: `WS Connection established from${isMockWSClient? ' Mock' : ''} Client`, 
      connected: true,
      nestId: currentNest
    }))
  }

  const onMessageReceived = (event) => {
    console.log(`📩 Message received from WS${isMockWSClient? ' mock' : ''} Server!`)
    const message = document.createElement('li');
    message.className = isMockWSClient? 'message' : 'request';
    message.textContent = event.data;
    document.querySelector(`#received-${isMockWSClient? 'messages' : 'requests'}`).append(message);
  }

  const closeConnection = () => ws.close(1000, currentNest)
  
  // adds the handlers
  ws.addEventListener("open", onOpenConnection)
  ws.addEventListener("message", onMessageReceived)
  document.addEventListener("beforeunload", closeConnection)

  connection.current = ws

  return () => {
    console.log('CleanUp Function Working!')
    ws.removeEventListener("open", onOpenConnection)
    ws.removeEventListener("message", onMessageReceived)
    document.removeEventListener('beforeunload', closeConnection)
  }
}