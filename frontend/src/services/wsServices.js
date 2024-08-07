export const createWSClient = (currentNest, wsServerURL, connection) => {
  const ws = new WebSocket(wsServerURL)

  // message related handlers:
  const onOpenConnection = () => {
    console.log('📯 Mock Client Created!')
    console.log('📯 Connection to Mock Server Enabled!')

    ws.send(JSON.stringify({
      status: 'WS Connection established from Mock Client', 
      connected: true, 
      nestId: currentNest
    }))
  }

  const onMessageReceived = (event) => {
    console.log('📩 Message received from Mock Server!')
    const message = document.createElement('li');
    message.className = 'message';
    message.textContent = event.data;
    document.querySelector('#received-messages').append(message);
    console.log("Message from mock server ", event.data)
  }

  const closeConnection = () => ws.close(1000, currentNest)
  
  // adds the handlers
  ws.addEventListener("open", onOpenConnection)
  ws.addEventListener("message", onMessageReceived)
  document.addEventListener("beforeunload", closeConnection)

  connection.current = ws

  return () => {
    ws.removeEventListener("open", onOpenConnection)
    ws.removeEventListener("message", onMessageReceived)
    document.removeEventListener('beforeunload', closeConnection)
  }
}