import { useState, useContext, useEffect } from "react"
import { createWSClient } from "../services/wsServices"
import { closeWSCustomClientInBackend, createWSCustomClientInBackend, getNest } from "../services/testApi"
import { WSContext } from "../utils/contexts/ExternalWSConnection"
import WSConnectionForm from "./WSConnectionForm"

const WSCustomClient = ({currentNest}) => {
  const [connectionEstablished, setConnectionEstablished] = useState((connection) => connection)
  const { activeWSConnection, setActiveWSConnection } = useContext(WSContext)
  const [activeWS, setActiveWS] = useState((ws) => ws)  
  const [messages, setMessages] = useState([])
  const [wsServerURL, setWsServerURL] = useState('')
  const currentNestId = currentNest.id

  useEffect(() => {
    if (!activeWSConnection) {
      setWsServerURL('')
      setActiveWS(false)
      setConnectionEstablished(false)
      setMessages([])
    }
  }, [activeWSConnection])

  // api call to get nest data and load requests
  const createConnection = async () => {
    try {
      console.log('CREATING CUSTOM CLIENT SUBSCRIBED TO EXTERNAL WS SERVER IN THE BACKEND')
      await createWSCustomClientInBackend(currentNestId, wsServerURL)
      const nest = await getNest(currentNest.id) 
      const wsURL = import.meta.env.DEV ? 
                      'ws://localhost:9090' : 
                      'wss://kingfisher.luxor.dev/ws-external'

      console.log('CREATING CLIENT IN THE FRONTEND')
      const ws = createWSClient(currentNestId, wsURL, setMessages)
      setActiveWSConnection(ws)
      window.addEventListener('beforeunload', function() {
        closeWSCustomClientInBackend(currentNestId)
        ws.close()
        setConnectionEstablished(false)
        setActiveWS(null)
        window.removeEventListener('beforeunload', this)
      })
      setActiveWS(ws)
      setConnectionEstablished(true)
      setMessages(nest.wsConnections[wsServerURL])
      return ws
    } catch (error) {
      console.error(error)
    } 
  }

  const closeConnection = async () => {
    try {
      console.log('CLOSING WS CONNECTION IN THE BACKEND WITH EXTERNAL WS SERVER')
      await closeWSCustomClientInBackend(currentNestId)
      activeWS.close()
      // activeWSConnection.close()
      setMessages([])
      setConnectionEstablished(false)
    } catch (error) {
      console.error(error)
    } 
  }

  return (
    <div>
      <h4>Custom WS Client</h4>
      <WSConnectionForm
        createConnection={createConnection}
        closeConnection={closeConnection}
        setMessages={setMessages}
        wsServerURL={wsServerURL}
        setWsServerURL={setWsServerURL}
        connectionEstablished={connectionEstablished}
      />
      {connectionEstablished && messages && <MessagesList messages={messages}/>}
    </div>
  )
}

const MessagesList = ({messages}) => {
  return (
    <>
    {messages.length > 0 ? 
      <ul id="received-messages">{
        messages.map(m => <li key={m.kingfisherId}>🦜{JSON.stringify(m.arrivedOn)} {m.data}</li>)
      }</ul> 
      : 'no messages yet '
    }
    </>
  )
}

export default WSCustomClient