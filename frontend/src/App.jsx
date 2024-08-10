import { useEffect, useState } from "react"
import { createNest } from "./services/testApi"
import WSCustomClient from "./components/WSCustomClient"
import { test, copyNestId, setupHistory, saveNestInHistory, saveNestInLocalStorage } from './utils/helpers'

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

import RequestsList from "./components/RequestList.jsx"

function App() {
  const [currentNestId, setCurrentNestId] = useState(localStorage.kingfisherNest)
  console.log('APP RENDERED')
  const navigate = useNavigate()
  const location = useLocation()

  setupHistory()

  // now we should:
  // when we enter a url with a nest id THAT EXISTS IN THE DB:
  // if:
      // we are not resetting (we don't want to create a new nest, we just want to visit an existing one)
          // with a flag 'resetting?', via state passed from the app as a prop to the request list element 
      // the nest id in the url path corresponds to an existing id in the db
          // make an api call, if successful, the nest exists, and load the data,
          // if 404 error, that means it does not exist, and we should just create a new one normally
  // we want:
      // get nest data from the backend
      // load nest data

  useEffect(() => {
    console.log('🤖 use effect to get new nest in action')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    (async () => {
      try {
        if (localStorage.kingfisherNest && location.pathname !== `/${currentNestId}`) {
          navigate(`/${localStorage.kingfisherNest}`, {replace: true})
          return
        } else if (localStorage.kingfisherNest) {
          return 
        }
        
        console.log('🐦 request to creat new nest sent')
        const result = await createNest(source)
        console.log('🐦 new nest created')
        const nestId = result.nestId
        saveNestInLocalStorage(nestId)
        saveNestInHistory(nestId)
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

      <RequestsList currentNestId={currentNestId} setCurrentNestId={setCurrentNestId}/>

      {currentNestId && <WSCustomClient currentNestId = {currentNestId} /> }
    </>
  )
}

export default App
