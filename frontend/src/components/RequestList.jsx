import { useRef, useState, useEffect } from "react"
import axios from "axios"
import { getNest, createNest } from "../services/testApi"
import { createWSClient } from "../services/wsServices"
import { saveNestInHistory, saveNestInLocalStorage } from "../utils/helpers"


const RequestsList = ({currentNestId, setCurrentNestId}) => {
  console.log('RequestList Rendered')
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const connection = useRef(null)

  // api call to get nest data and load requests
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    (async () => {
      setLoadingRequests(true)
      try {
        console.log('🐲 calling api to get nest data')
        const response = await getNest(currentNestId, source)
        setRequests(response.requests)
      } catch (e) {
        console.error(e)
      }
      setLoadingRequests(false)
    })()

    return () => {
      setLoadingRequests(false)
      source.cancel()
    }
  }, [currentNestId])
  
  // set the ws connection
  useEffect(() => {
    if (!currentNestId) return

    const cleanUpConnection = createWSClient(currentNestId, null, connection, setRequests)
    return cleanUpConnection
  }, [currentNestId])

  const resetCurrentNest = async () => {
    localStorage.removeItem('kingfisherNest')
    try {
      console.log('RESET = 🐦 request to creat new nest sent')
      const result = await createNest()
      const newNestId = result.nestId
      console.log('RESET = 🐦 new nest created')
      saveNestInLocalStorage(newNestId)
      saveNestInHistory(newNestId)
      console.log('RESET = setter called, will triger a rerender, use effect will be called again')
      setCurrentNestId(newNestId)
    } catch (error) {
      console.error(error)
    }
  }

  if (loadingRequests) return <h3>Loading Requests</h3>

  return (
    <> 
      <h4>List of received requests:</h4>
      <button style={{background: 'red'}} onClick={() => resetCurrentNest()}>Reset Current Nest</button>
      {requests.length === 0 ? 'No requests yet' :
        <ul id="received-requests">{
          requests.map(r => <RequestListElement r={r} key={r.id}/>)
        }</ul>
      }
    </>
  )
}

const RequestListElement = ({r}) => {
  return <li className="request">🎈 {r.timeOfArrival} {r.method} {r.path}</li>
}

export default RequestsList