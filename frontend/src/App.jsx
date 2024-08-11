import { useEffect, useState } from "react"
import { createNest, isNestInDb } from "./services/testApi"
import WSCustomClient from "./components/WSCustomClient"
import { test, copyNestId, setupHistoryCache, saveNestInHistoryCache, saveNestInLocalStorage, isNestInHistoryCache, isValidNestId } from './utils/helpers'

import axios from "axios"
import { Await, useLocation, useNavigate } from "react-router-dom"

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

      if (!isValidNestId(nestIdInURL) && !currentNestId ) {
        console.log('nest id in url invalid, no nest in storage, creating new nest...')

      } else if (isValidNestId(nestIdInURL) && nestIdInURL !== currentNestId && await isNestInDb(nestIdInURL)) {
        console.log('url nest id valid, not equal to nest id stored, nest exists in db, changing to nest from url...')

        saveNestInHistoryCache(nestIdInURL)
        saveNestInLocalStorage(nestIdInURL)

        setCurrentNestId(nestIdInURL)
        return
      } else if (isValidNestId(nestIdInURL) && nestIdInURL === currentNestId && await isNestInDb(nestIdInURL)) {
        console.log('nest id in url equal to nest id in storage, and nest exists in DB')
        saveNestInHistoryCache(nestIdInURL)
        saveNestInLocalStorage(nestIdInURL)
        return
      } else if (!isValidNestId(nestIdInURL) && currentNestId && await isNestInDb(currentNestId)) {
        console.log('nest id in url not valid, but found valid nest in localStorage, and nest exists in db:', currentNestId)
        navigate(`/${currentNestId}`, {replace: true})
        return
      } else if (isValidNestId(nestIdInURL) && !await isNestInDb(nestIdInURL)) {
        console.log('🍕 invalid nest id in url, BUT WITH THE CORRECT FORMAT, creating new nest...')
      }

      try {
        console.log('🐦 request to creat new nest sent')
        const result = await createNest(source)
        console.log(result)
        console.log('🐦 new nest created')
        const nestId = result.nestId
        saveNestInLocalStorage(nestId)
        saveNestInHistoryCache(nestId)
        setCurrentNestId(nestId)
        navigate(`/${nestId}`, {replace: true})
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
