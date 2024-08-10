import { useEffect, useState } from "react"
import { createNest, isNestInDb } from "./services/testApi"
import WSCustomClient from "./components/WSCustomClient"
import { test, copyNestId, setupHistoryCache, saveNestInHistoryCache, saveNestInLocalStorage, isNestInHistoryCache } from './utils/helpers'

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import RequestsList from "./components/RequestList.jsx"

function App() {
  const [currentNestId, setCurrentNestId] = useState(localStorage.kingfisherNest)
  console.log('APP RENDERED')
  const navigate = useNavigate()
  const location = useLocation()

  setupHistoryCache(currentNestId)
  
  // I'd like to move this to a custom hook
  useEffect(() => {
    console.log('🤖 use effect to get new nest in action')
    const nestIdInURL = location.pathname.slice(1);
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    (async () => {
      if (nestIdInURL === currentNestId) {
        console.log('nest id in url === current nest id, so a new nest shouldn\'t be created' )
        return
      } else if (!nestIdInURL && !currentNestId) {
        console.log('nest id in url not equal to current active nest in local store, creating new nest...')
      } else if (nestIdInURL !== currentNestId && (isNestInHistoryCache(nestIdInURL) || await isNestInDb(nestIdInURL))) {
        // the deleted branch condition was:
          // if (!currentNestId && (isNestInHistoryCache(URLNestId) || await isNestInDb(URLNestId))) ...
        console.log('⛵ NAVIGATE = url nest id found in local HistoryCache or in DB')
        saveNestInHistoryCache(nestIdInURL)
        saveNestInLocalStorage(nestIdInURL)
        setCurrentNestId(nestIdInURL)
        return
      } else if (nestIdInURL !== currentNestId) {
        console.log('nest id in url not equal to nest in localStorage:', currentNestId)
        navigate(`/${currentNestId}`, {replace: true})
        return
      } 
      

      try {
        console.log('🐦 request to creat new nest sent')
        const result = await createNest(source)
        console.log('🐦 new nest created')
        const nestId = result.nestId
        saveNestInLocalStorage(nestId)
        saveNestInHistoryCache(nestId)
        setCurrentNestId(nestId)
      } catch(error) {
        console.error(error)
      }
    })()

    return () => source.cancel()
  }, [navigate, location, currentNestId])
  
  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3 > {currentNestId ? `Current nest id: ${currentNestId}` : 'loading nest'}</h3>
      <button onClick={() => copyNestId(currentNestId)}>Copy nest id</button>
      <button onClick={() => test(currentNestId)}>Make test request</button>

      {currentNestId ? <RequestsList currentNestId={currentNestId} setCurrentNestId={setCurrentNestId}/>: 'loading nest'}

      {currentNestId ? <WSCustomClient currentNestId = {currentNestId} />: 'loading nest'}
    </>
  )
}

export default App
