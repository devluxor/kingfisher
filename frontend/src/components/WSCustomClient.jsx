import { useState, useRef, useEffect } from "react"
import { createWSClient } from "../services/wsServices"
import { closeWSCustomClientInBackend, createWSCustomClientInBackend } from "../services/testApi"

const WSCustomClient = ({currentNestId}) => {
  const [messages, setMessages] = useState([])
  const [connectionEstablished, setConnectionEstablished] = useState((connection) => connection)

  const createConnection = async (wsServerURL) => {
    try {
      console.log('CREATING CUSTOM CLIENT SUBSCRIBED TO EXTERNAL WS SERVER IN THE BACKEND')
      await createWSCustomClientInBackend(currentNestId, wsServerURL)
      const wsURL = import.meta.env.DEV ? 
                      'ws://localhost:9090' : 
                      'https://kingfisher.luxor.dev/ws-external'

      console.log('CREATING CLIENT IN THE FRONTEND')
      const ws = createWSClient(currentNestId, wsURL, setMessages)
      setConnectionEstablished(true)
      return ws
    } catch (error) {
      console.error(error)
    } 
  }

  const closeConnection = async () => {
    try {
      console.log('CLOSING WS CONNECTION IN THE BACKEND WITH EXTERNAL WS SERVER')
      await closeWSCustomClientInBackend(currentNestId)
      setMessages([])
      setConnectionEstablished(false)
    } catch (error) {
      console.error(error)
    } 
  }

  return (
    <div>
      <h4>Custom WS Client</h4>
      <WSConnectionControls 
        createConnection={createConnection}
        closeConnection={closeConnection}
        currentNestId={currentNestId}
      />
      {connectionEstablished && <MessagesList messages={messages}/>}
    </div>
  )
}

const WSConnectionControls = ({createConnection, closeConnection, currentNestId}) => {
  console.log('WSConnectionControls rendered')
  const [wsServerURL, setWsServerURL] = useState('')
  const [connected, setConnected] = useState(false)
  const connection = useRef(null)
  
  const validWSURL = (url) => {
    const wsRegexp = /^(ws|wss|http|https):\/\/(?:[a-zA-Z0-9-.]+)+[a-zA-Z]{2,6}(?::\d{1,5})?(?:\/[^\s]*)?$/g
    return url.match(wsRegexp)
  }

  const initializeConnection = async (e) => {
    e.preventDefault()
    if (!validWSURL(wsServerURL)) return

    console.log('trying to connect to:', wsServerURL)
    const ws = await createConnection(wsServerURL)
    // close connection in frontend/backend if page is refreshed
    window.addEventListener('beforeunload', function() {
      closeWSCustomClientInBackend(currentNestId)
      ws.close()
      window.removeEventListener('beforeunload', this)
    })
    connection.current = ws
    setConnected(true)
  }

  const disconnectWS = (e) => {
    e.preventDefault()
    // close ws connection frontend (client) with backend (server) that updates DOM
    console.log('CLOSING WS FRONTEND-BACKEND')
    connection.current.close()
    // close backend WS connection with external (custom) server
    closeConnection()
    setConnected(false)
  }

  return (
    <form>
      <label htmlFor="wsServerURL">Target WS Server URL</label><br/>
      <input 
        type="text" 
        id="wsServerURL" 
        value={wsServerURL} 
        name="wsServerURL" 
        placeholder="Enter url here" 
        required
        onChange={e => setWsServerURL(e.target.value)}
      ></input><br/>
      {!connected && <button onClick={initializeConnection} >Connect to WS server</button>}
      {connected && <button onClick={disconnectWS} >Disconnect from WS Server</button>}
    </form>
  )
}

const MessagesList = ({messages}) => {
  return (
    <>
    {messages.length > 0 ? 
      <ul id="received-messages">{
        messages.map(m => <li key={m.id}>🦜{JSON.stringify(m.timeOfArrival)}</li>)
      }</ul> 
      : 'no messages yet '
    }
    </>
  )
}

export default WSCustomClient