import { useEffect, useState, useRef } from "react"
import { createNest } from "./services/testApi"
import WSCustomClient from "./components/WSCustomClient"
import { createWSClient } from "./services/wsServices"
import { deleteMessagesFromList, deleteRequestsFromList, test, copyNestId } from './utils/helpers'

import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"

function App() {
  const [currentNestId, setCurrentNestId] = useState(localStorage.kingfisherNest)
  const connection = useRef(null)
  console.log('APP RENDERED')
  const navigate = useNavigate()
  const location = useLocation()

  // will create a custom hook useCreateNest?
  useEffect(() => {
    console.log('use effect to get new nest in action')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    (async () => {
      try {
        if (localStorage.kingfisherNest && location.pathname !== `/${currentNestId}`) {
          console.log('🔎 Nest id found in localStorage')
          navigate(`/${localStorage.kingfisherNest}`, {replace: true})
          return
        } else if (localStorage.kingfisherNest) return
        
        console.log('🐦 request to creat new nest sent')
        const result = await createNest(source)
        console.log('🐦 new nest created')
        const nestId = result.nestId
        setCurrentNestId(nestId)
        localStorage.setItem('kingfisherNest', result.nestId)
        navigate(`${nestId}`, {replace: true})
      } catch(error) {
        console.error(error)
      }
    })()

    return () => source.cancel()
  }, [navigate, location, currentNestId])

  // creates main WS client connection
  useEffect(() => {
    if (!currentNestId) return

    const cleanUpConnection = createWSClient(currentNestId, null, connection)
    return cleanUpConnection
  }, [currentNestId])

  const resetCurrentNest = async () => {
    localStorage.removeItem('kingfisherNest')
    try {
      const result = await createNest()
      const newNestId = result.nestId
      console.log('🐦 request to creat new nest sent')
      setCurrentNestId(newNestId)
      console.log('🐦 new nest created')
      deleteRequestsFromList()
      deleteMessagesFromList()
      localStorage.setItem('kingfisherNest', newNestId)
      navigate(`/${newNestId}`, {replace: true})
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>🐦Welcome to Kingfisher!🐦</h1>
      <h3 style={{display: 'inline'}}> {currentNestId ? `Current nest id: ${currentNestId}` : 'loading nest'}</h3>
      <button onClick={() => copyNestId(currentNestId)}>Copy nest id</button>

      <button onClick={() => test(currentNestId)}>Make test request</button>
      <button style={{background: 'red'}} onClick={() => resetCurrentNest()}>Reset Current Nest</button>

      <h4>List of received requests:</h4>
      <ul id="received-requests"></ul>

      {currentNestId ? <WSCustomClient currentNestId = {currentNestId}/> : 'loading nest'}
    </>
  )
}

export default App
