import { useState, useContext } from "react"
import { createWSClient } from "../services/wsServices"
import { closeWSCustomClientInBackend, createWSCustomClientInBackend } from "../services/testApi"
import { WSContext } from "../utils/contexts/ExternalWSConnection"
import WSConnectionControls from "./WSConnectionControls"

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