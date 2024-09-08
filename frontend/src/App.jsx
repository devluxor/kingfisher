import { useEffect, useState, useCallback } from "react"
import { createNest, testRequest, closeWSCustomClientInBackend, getNest, createWSCustomClientInBackend, getWSMessages } from "./services/serverAPI"
import { setupHistoryCache, saveNestInHistoryCache, saveNestInLocalStorage, isValidNestId, normalizeNest } from './utils/helpers'
import { useLocation, useNavigate } from "react-router-dom"
import { createRequestUpdaterWSConnection, createWSClient } from "./services/wsServices.js"

// import { WSContext } from "./utils/contexts/ExternalWSConnection.jsx"
import UpperSection from "./components/upper/UpperSection.jsx"
import MiddleSection from "./components/middle/MiddleSection.jsx"
import LowerSection from "./components/lower/LowerSection.jsx"

import axios from "axios"
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
  const [ activeWSConnection, setActiveWSConnection ] = useState(c => c) 
  const [connectionEstablished, setConnectionEstablished] = useState(connection => connection)
  const [activeWS, setActiveWS] = useState(ws => ws)  
  const [messages, setMessages] = useState([])
  const [errorInConnection, setErrorInConnection] = useState(false)
  const [wsServerURL, setWsServerURL] = useState('')
  const [activeMessageId, setActiveMessageId] = useState(null)


  // Nest Loading Process:

  // this callback is used within the main useEffect hook below, but it's only
  // defined once thanks to the useCallback hook.
  const loadNestData = useCallback((nestData) => {
    const nest = normalizeNest(nestData)
    saveNestInHistoryCache(nest.id)
    saveNestInLocalStorage(nest.id)
    setCurrentNest(nest)
    setRequests(nest.requests)
    navigate(`/${nest.id}`, {replace: true})
  }, [navigate])

  if (currentNest) {
    setupHistoryCache(currentNest.id)
  }
  
  // The following useEffect hook controls what happens when the user navigates to the website,
  // considering different cases and outcomes:
  // 1.- Nest Id in URL invalid or absent, no nest in state, and no nest id in cache => creates new nest
  // 2.- Nest Id in URL is equal to the nest already in state => does nothing
  // 3.- Nest Id in URL does not exist in DB, BUT WITH THE CORRECT FORMAT =>  creating new nest
  // 4.- Nest Id in URL valid, and corresponding nest exists in db => API call to load that nest from DB
  // 5.- Nest Id in URL invalid or absent, no nest in state, BUT valid nest Id in cache => API call to load nest
  //
  // It has been optimized to a certain degree
  // to avoid unnecessary API calls to the backend server.

  useEffect(() => {
    developmentMode && console.log('🤖 use effect to get new nest in action')
    // removes trailing forward slash:
    const nestIdInURL = location.pathname.slice(1);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    (async () => {
      const validIDFormatInURL = isValidNestId(nestIdInURL)
      const storedNestId = localStorage.kingfisherNest
      let needsToCheckExistence = true
      let isURLNestInDB;

      if (!validIDFormatInURL && !storedNestId) {
        // Outcome #1
        developmentMode && console.log('nest id in url invalid OR EMPTY, no currentNest, creating new nest...')
        needsToCheckExistence = false
      } else if (validIDFormatInURL && nestIdInURL === currentNest?.id) {
        // Outcome #2
        developmentMode && console.log('id in url === current nest id, doing nothing, as the nest is already loaded')
        return
      }
      
      let nestInDB
      if (needsToCheckExistence) {
        nestInDB = validIDFormatInURL ? await getNest(nestIdInURL) : []
        isURLNestInDB = validIDFormatInURL && nestInDB.length > 0
      }

      if (needsToCheckExistence && validIDFormatInURL && !isURLNestInDB) {
        // Outcome #3
        developmentMode && console.log('🍕 invalid nest id in url, BUT WITH THE CORRECT FORMAT, creating new nest...')
      } else if (needsToCheckExistence && validIDFormatInURL && isURLNestInDB) {
        // Outcome #4
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
        // Outcome #5
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
        await closeWSCustomClientInBackend(currentNestId)
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

  // Updates arrived requests live, without the need of polling
  useEffect(() => {
    if (!currentNestId) return

    createRequestUpdaterWSConnection(currentNestId, setRequests)
  }, [currentNestId])

  // end of request processing.

  // Custom WS connection management:

  // Clears WS connection state if none is active
  useEffect(() => {
    if (!activeWSConnection) {
      setWsServerURL('')
      setMessages([])
      setActiveWS(false)
      setConnectionEstablished(false)
    }
  }, [activeWSConnection]);

  // Clears WS connection state and closes it if there was an error
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

  const createCustomWSConnection = async () => {
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

  const closeCustomWSConnection = async () => {
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

  if (!currentNest) return 

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
        testRequest={testRequest}
        resetCurrentNest={resetCurrentNest}

        createConnection={createCustomWSConnection}
        closeConnection={closeCustomWSConnection}
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
