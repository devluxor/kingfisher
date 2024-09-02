import { useEffect, useState, useContext } from "react"
import { createNest, closeWSCustomClientInBackend, getNest } from "./services/testApi"
import { test, copyNestId, setupHistoryCache, saveNestInHistoryCache, saveNestInLocalStorage, isValidNestId, processNest } from './utils/helpers'
import { WSContext } from "./utils/contexts/ExternalWSConnection.jsx"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import RequestsList from './components/RequestsList.jsx'
import { createWSClient } from "./services/wsServices.js"
import WSCustomClient from './components/WSCustomClient.jsx'

const developmentMode = import.meta.env.DEV

function App() {
  const [currentNest, setCurrentNest] = useState((c) => c)
  const [requests, setRequests] = useState([])
  const { activeWSConnection, setActiveWSConnection } = useContext(WSContext)

  developmentMode && console.log('APP RENDERED')
  const navigate = useNavigate()
  const location = useLocation()

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

      const loadNestData = (nestData) => {
        const nest = processNest(nestData)
        saveNestInHistoryCache(nest.id)
        saveNestInLocalStorage(nest.id)
        setCurrentNest(nest)
        setRequests(nest.requests)
        navigate(`/${nest.id}`, {replace: true})
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
  }, [navigate, location, currentNest])

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

  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3 > {currentNest ? `Current nest id: ${currentNest.id}` : 'loading nest'}</h3>
      {currentNest && <button onClick={() => copyNestId((currentNest.id))}>Copy nest id</button>}
      {currentNest && <button onClick={() => test(currentNest.id)}>Make test request</button>}
      {currentNest && <button style={{background: 'red'}} onClick={resetCurrentNest}>Reset Current Nest</button>}

      {currentNest ? <RequestsList requests={requests} setRequests={setRequests} />: 'loading nest'}

      {currentNest ? <WSCustomClient currentNest={currentNest} />: 'loading nest'}
    </>
  )
}

export default App
