import { useEffect, useState, useContext } from "react"
import { createNest, isNestInDb, closeWSCustomClientInBackend } from "./services/testApi"
import WSCustomClient from "./components/WSCustomClient"
import { test, copyNestId, setupHistoryCache, saveNestInHistoryCache, saveNestInLocalStorage, isValidNestId } from './utils/helpers'
import { WSContext } from "./utils/contexts/ExternalWSConnection.jsx"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import RequestsList from "./components/RequestList.jsx"
import useFetchNest from "./utils/hooks/useFetchNest.jsx"

function App() {
  const [currentNest, setCurrentNest] = useState()
  const [currentNestId, setCurrentNestId] = useState(localStorage.kingfisherNest)
  const { activeWSConnection, setActiveWSConnection } = useContext(WSContext)

  console.log('APP RENDERED')
  const navigate = useNavigate()
  const location = useLocation()

  setupHistoryCache(currentNestId)
  
  useEffect(() => {
    console.log('🤖 use effect to get new nest in action')
    // removes final forward slash:
    const nestIdInURL = location.pathname.slice(1);

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    (async () => {
      const isURLNestInDB = await isNestInDb(nestIdInURL)
      const validIDFormatInURL = isValidNestId(nestIdInURL)

      if (!validIDFormatInURL && !currentNestId ) {
        console.log('nest id in url invalid, no nest in storage, creating new nest...')

      } else if (validIDFormatInURL && nestIdInURL !== currentNestId && isURLNestInDB) {
        console.log('url nest id valid, not equal to nest id stored, nest exists in db, changing to nest from url...')

        saveNestInHistoryCache(nestIdInURL)
        saveNestInLocalStorage(nestIdInURL)
        setCurrentNestId(nestIdInURL)
        return
      } else if (validIDFormatInURL && nestIdInURL === currentNestId && isURLNestInDB) {
        console.log('nest id in url equal to nest id in storage, and nest exists in DB')
        saveNestInHistoryCache(nestIdInURL)
        saveNestInLocalStorage(nestIdInURL)
        return
      } else if (!validIDFormatInURL && currentNestId && await isNestInDb(currentNestId)) {
        console.log('nest id in url not valid, but found valid nest in localStorage, and nest exists in db:', currentNestId)
        navigate(`/${currentNestId}`, {replace: true})
        return
      } else if (validIDFormatInURL && !isURLNestInDB) {
        console.log('🍕 invalid nest id in url, BUT WITH THE CORRECT FORMAT, creating new nest...')
      }

      try {
        console.log('🐦 request to creat new nest sent')
        const newNest = await createNest(source)
        console.log('🐦 new nest created')
        const nestId = newNest.id
        saveNestInLocalStorage(nestId)
        saveNestInHistoryCache(nestId)
        setCurrentNestId(nestId)
        setCurrentNest(newNest)
        navigate(`/${nestId}`, {replace: true})
      } catch(error) {
        console.error(error)
      }
    })()

    return () => source.cancel()
  }, [navigate, location, currentNestId])

  // const {nest, loading, error} = useFetchNest(currentNestId) 
  // useEffect(() => {
  //   if (!loading && !error && nest) setRequests(nest.requests)
  // }, [loading, error, nest])

  // const [nest, setNest] = useState()
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState()

  // useEffect(() => {
  //   const cancelToken = axios.CancelToken;
  //   const source = cancelToken.source();
  //   let ignore = false;
  //   (async () => {
  //     if (ignore) return
  
  //     setLoading(true)
  //     try {
  //       console.log('🐲 calling api to get nest data')
  //       const response = await getNest(currentNestId, source)
  //       setNest(response)
  //     } catch (e) {
  //       console.error(e)
  //       setError(e)
  //     }
  //     setLoading(false)
  //   })()
  
  //   return () => {
  //     ignore = true
  //     setLoading(false)
  //     source.cancel()
  //   }
  // }, [currentNestId])

  const resetCurrentNest = async () => {
    localStorage.removeItem('kingfisherNest')
    try {
      if (activeWSConnection) {
        console.log(activeWSConnection)
        await closeWSCustomClientInBackend(currentNestId)
        activeWSConnection.close()
        setActiveWSConnection(null)
      }
      console.log('RESET = 🐦 request to create new nest sent')
      const result = await createNest()
      const newNestId = result.nestId
      console.log('RESET = 🐦 new nest created')
      saveNestInLocalStorage(newNestId)
      saveNestInHistoryCache(newNestId)
      console.log('RESET = setter called, will triger a rerender, use effect will be called again')
      setCurrentNestId(newNestId)
      navigate(`/${newNestId}`, {replace: true})
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3 > {currentNestId ? `Current nest id: ${currentNestId}` : 'loading nest'}</h3>
      <button onClick={() => copyNestId(currentNestId)}>Copy nest id</button>
      <button onClick={() => test(currentNestId)}>Make test request</button>
      <button style={{background: 'red'}} onClick={resetCurrentNest}>Reset Current Nest</button>

      {currentNestId ? <RequestsList currentNestId={currentNestId}/>: 'loading nest'}

      {currentNestId ? <WSCustomClient currentNestId = {currentNestId} />: 'loading nest'}
    </>
  )
}

export default App
