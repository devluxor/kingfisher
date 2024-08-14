import { useState, useContext, useEffect } from "react"
import { createWSClient } from "../services/wsServices"
import { closeWSCustomClientInBackend, createWSCustomClientInBackend } from "../services/testApi"
import { WSContext } from "../utils/contexts/ExternalWSConnection"
import { getNest } from "../services/testApi"
import axios from "axios"

const WSCustomClient = ({currentNestId}) => {
  const [messages, setMessages] = useState([])
  const [connectionEstablished, setConnectionEstablished] = useState((connection) => connection)
  const { activeWSConnection } = useContext(WSContext)

 // api call to get nest data and load requests


  const createConnection = async (wsServerURL) => {
    try {
      console.log('CREATING CUSTOM CLIENT SUBSCRIBED TO EXTERNAL WS SERVER IN THE BACKEND')
      await createWSCustomClientInBackend(currentNestId, wsServerURL)
      const wsURL = import.meta.env.DEV ? 
                      'ws://localhost:9090' : 
                      'wss://kingfisher.luxor.dev/ws-external'

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
      activeWSConnection.close()
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
        setMessages={setMessages}
      />
      {activeWSConnection && connectionEstablished && <MessagesList messages={messages}/>}
    </div>
  )
}

const WSConnectionControls = ({createConnection, closeConnection, currentNestId, setMessages}) => {
  console.log('WSConnectionControls rendered')
  const [wsServerURL, setWsServerURL] = useState('')
  const [connected, setConnected] = useState(false)
  // const connection = useRef(null)
  const { activeWSConnection, setActiveWSConnection } = useContext(WSContext)

  useEffect(() => {
    if (!activeWSConnection || !validWSURL(wsServerURL)) return
  
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let ignore = false;
    (async () => {
      try {
        if (ignore) return

        console.log('🐲 calling api to get nest WS CONNECTION DATA data')
        const nest = await getNest(currentNestId, source)
        const url = nest.wsConnections[wsServerURL] ?
                      wsServerURL :
                      `${wsServerURL}/`
        setMessages((m) => [...m, ...(nest.wsConnections[url]? nest.wsConnections[url] : [])])
      } catch (e) {
        console.error(e)
      }
    })()
  
    return () => {
      ignore = false
      source.cancel()
    }
  }, [activeWSConnection, currentNestId, setMessages, wsServerURL])

  const validWSURL = (url) => {
    const wsRegexp = /^(ws|wss|http|https):\/\/(?:[a-zA-Z0-9-.]+)+[a-zA-Z]{2,6}(?::\d{1,5})?(?:\/[^\s]*)?$/g
    return url.match(wsRegexp)
  }

  useEffect(() => {
    if (!activeWSConnection) {
      setWsServerURL('')
    }
  }, [activeWSConnection])

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
    setActiveWSConnection(ws)
    setConnected(true)
  }

  const disconnectWS = (e) => {
    e.preventDefault()
    // close ws connection frontend (client) with backend (server) that updates DOM
    console.log('CLOSING WS FRONTEND-BACKEND')
    activeWSConnection.close()
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
      {(!activeWSConnection || !connected) && <button onClick={initializeConnection} >Connect to WS server</button>}
      {activeWSConnection && connected && <button onClick={disconnectWS} >Disconnect from WS Server</button>}
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