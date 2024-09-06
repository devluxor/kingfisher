import { useEffect, useState, useContext, useCallback } from "react"
import { createNest, closeWSCustomClientInBackend, getNest, createWSCustomClientInBackend, getWSMessages } from "./services/serverAPI"
import { test, setupHistoryCache, saveNestInHistoryCache, saveNestInLocalStorage, isValidNestId, processNest } from './utils/helpers'
import { WSContext } from "./utils/contexts/ExternalWSConnection.jsx"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import { createWSClient } from "./services/wsServices.js"

import UpperSection from "./components/upper/UpperSection.jsx"
import MiddleSection from "./components/middle/MiddleSection.jsx"
import LowerSection from "./components/lower/LowerSection.jsx"
const developmentMode = import.meta.env.DEV

function App() {
  developmentMode && console.log('APP RENDERED')

  // State Management:
  // General Nest:
  const [currentNest, setCurrentNest] = useState((c) => c)
  const navigate = useNavigate()
  const location = useLocation()
  const currentNestId = currentNest?.id

  // Requests:
  const [requests, setRequests] = useState([])
  const [activeRequestId, setActiveRequestId] = useState(null)

  // Custom WS Connection:
  const { activeWSConnection, setActiveWSConnection } = useContext(WSContext) // unnecessary
  const [connectionEstablished, setConnectionEstablished] = useState(connection => connection)
  const [activeWS, setActiveWS] = useState(ws => ws)  
  const [messages, setMessages] = useState([])
  const [errorInConnection, setErrorInConnection] = useState(false)
  const [wsServerURL, setWsServerURL] = useState('')
  const [activeMessageId, setActiveMessageId] = useState(null)


  // Nest Loading Process:
  const loadNestData = useCallback((nestData) => {
    const nest = processNest(nestData)
    saveNestInHistoryCache(nest.id)
    saveNestInLocalStorage(nest.id)
    setCurrentNest(nest)
    setRequests(nest.requests)
    navigate(`/${nest.id}`, {replace: true})
  }, [navigate])

  if (currentNest?.id) {
    setupHistoryCache(currentNest.id)
  }
  
  useEffect(() => {
    developmentMode && console.log('🤖 use effect to get new nest in action')
    // removes final forward slash:
    const nestIdInURL = location.pathname.slice(1);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    (async () => {
      const validIDFormatInURL = isValidNestId(nestIdInURL)
      const storedNestId = localStorage.kingfisherNest
      let needsToCheckExistence = true
      let isURLNestInDB;

      // add order of branches, explanation as comments

      if (!validIDFormatInURL && !storedNestId) {
        developmentMode && console.log('nest id in url invalid OR EMPTY, no currentNest, creating new nest...')
        needsToCheckExistence = false
      } else if (validIDFormatInURL && nestIdInURL === currentNest?.id) {
        developmentMode && console.log('id in url === current nest id, doing nothing, as the nest is already loaded')
        return
      }
      
      let nestInDB
      if (needsToCheckExistence) {
        nestInDB = validIDFormatInURL ? await getNest(nestIdInURL) : []
        isURLNestInDB = validIDFormatInURL && nestInDB.length > 0
      }

      if (needsToCheckExistence && validIDFormatInURL && !isURLNestInDB) {
        developmentMode && console.log('🍕 invalid nest id in url, BUT WITH THE CORRECT FORMAT, creating new nest...')
      } else if (needsToCheckExistence && validIDFormatInURL && isURLNestInDB) {
        developmentMode && console.log('url nest id valid, and nest exists in db, changing to nest from url...')

        try {
          loadNestData(nestInDB)
        } catch(e) {
          console.error(e)
        }

        return
      }

      const storedNest = await getNest(storedNestId)
      const storedNestIsInDB = storedNest.length > 0
      if (needsToCheckExistence && storedNestIsInDB) {
        developmentMode && console.log('url id absent, stored nest is in DB, changing to nest from url...')
    
        try {
          developmentMode && console.log('getting nest...')
          loadNestData(storedNest)
        } catch(e) {
          console.error(e)
        }

        return
      }

      try {
        developmentMode && console.log('🐦 request to create new nest sent')
        const newNest = await createNest(source)
        if (!newNest) {
          developmentMode && console.log('nest returned from createNest invalid', newNest)
          return
        }

        developmentMode && console.log('🐦 new nest created')
        const nestId = newNest.id
        saveNestInLocalStorage(nestId)
        saveNestInHistoryCache(nestId)
        setCurrentNest(newNest)
        setRequests([])
        navigate(`/${nestId}`, {replace: true})
      } catch(error) {
        console.error(error)
      }
    })()

    return () => source.cancel()
  }, [navigate, location, currentNest, loadNestData])

  const resetCurrentNest = async () => {
    localStorage.removeItem('kingfisherNest')
    try {
      if (activeWSConnection) {
        console.log(activeWSConnection)
        await closeWSCustomClientInBackend(currentNest.id)
        activeWSConnection.close()
        setActiveWSConnection(null)
      }
      
      developmentMode && console.log('RESET = 🐦 request to create new nest sent')
      const newNest = await createNest()
      if (!newNest) return

      const newNestId = newNest.id
      developmentMode && console.log('RESET = 🐦 new nest created')
      saveNestInLocalStorage(newNestId)
      saveNestInHistoryCache(newNestId)
      developmentMode && console.log('RESET = setter called, will triger a rerender, use effect will be called again')
      setCurrentNest(newNest)
      setRequests([])

      navigate(`/${newNestId}`, {replace: true})
    } catch (error) {
      console.error(error)
    }
  }

  // ws client to get requests without HTTP req/res cycles
  useEffect(() => {
    if (!currentNest) return

    createWSClient(currentNest.id, null, setRequests)
  }, [currentNest])

  // ws custom connection

  useEffect(() => {
    if (!activeWSConnection) {
      setWsServerURL('')
      setMessages([])
      setActiveWS(false)
      setConnectionEstablished(false)
    }
  }, [activeWSConnection]);

  (async () => {
    if (!errorInConnection) return;

    try {
      developmentMode && console.log('ERROR IN CONNECTION EXTERNAL WS SERVER - BACKEND WS CLIENT 👢👢👢👢👢👢👢👢👢👢👢👢👢👢👢👢')
      await closeWSCustomClientInBackend(currentNestId)
      activeWS.close()
      setWsServerURL('')
      setMessages([])
      setConnectionEstablished(false)
      setActiveWS(false)
      setErrorInConnection(false) 
    } catch (e) {
      console.error(e)
    }
  
  })()

  const createConnection = async () => {
    try {
      developmentMode && console.log('CREATING CLIENT IN THE FRONTEND')
      const wsURL = developmentMode ? 
        `ws://localhost:9090?nestId=${currentNestId}` : 
        `wss://kingfisher.luxor.dev/ws-external?nestId=${currentNestId}`
      const ws = createWSClient(currentNestId, wsURL, setMessages, setErrorInConnection);
      
      setActiveWSConnection(ws)

      window.addEventListener('beforeunload', async function() {
        await closeWSCustomClientInBackend(currentNestId)
        ws.close()
        setConnectionEstablished(false)
        setActiveWS(null)
        window.removeEventListener('beforeunload', this)
      })

      setActiveWS(ws)
      setConnectionEstablished(true)
      const wsMessages = await getWSMessages(currentNestId, wsServerURL)
      setMessages(wsMessages)

      developmentMode && console.log('CREATING CUSTOM CLIENT SUBSCRIBED TO EXTERNAL WS SERVER IN THE BACKEND')
      await createWSCustomClientInBackend(currentNestId, wsServerURL)

      return ws
    } catch (error) {
      console.error(error)
    } 
  }

  const closeConnection = async () => {
    try {
      developmentMode && console.log('CLOSING WS CONNECTION IN THE BACKEND WITH EXTERNAL WS SERVER')
      await closeWSCustomClientInBackend(currentNestId)
      activeWS.close()
      setMessages([])
      setConnectionEstablished(false)
    } catch (error) {
      console.error(error)
    } 
  }

  if (!currentNest) return <h1>Loading Nest</h1>

  return (
    <>
      <UpperSection 
        requests={requests} 
        activeRequestId={activeRequestId} 
        setActiveRequestId={setActiveRequestId}
        messages={messages}
        activeMessageId={activeMessageId} 
        setActiveMessageId={setActiveMessageId}
      />
      
      <MiddleSection currentNest={currentNest}/>

      <LowerSection
        currentNest={currentNest}
        requests={requests} 
        activeRequestId={activeRequestId}
        testRequest={test}
        resetCurrentNest={resetCurrentNest}
        createConnection={createConnection}
        closeConnection={closeConnection}
        setMessages={setMessages}
        wsServerURL={wsServerURL}
        setWsServerURL={setWsServerURL}
        connectionEstablished={connectionEstablished}
        activeMessageId={activeMessageId}
      />
    </>
  )
}



export default App
