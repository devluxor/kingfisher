import { useRef, useState, useEffect, useContext } from "react"
import { WSContext } from "../utils/contexts/ExternalWSConnection"
import axios from "axios"
import { getNest, createNest, closeWSCustomClientInBackend } from "../services/testApi"
import { createWSClient } from "../services/wsServices"
import { saveNestInHistoryCache, saveNestInLocalStorage } from "../utils/helpers"
import { useNavigate } from "react-router-dom"

const RequestsList = ({currentNestId, setCurrentNestId}) => {
  console.log('RequestList Rendered')
  const [requests, setRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const { activeWSConnection, setActiveWSConnection } = useContext(WSContext)
  const navigate = useNavigate()

  // api call to get nest data and load requests
  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let ignore = false;
    (async () => {
      if (ignore) return
      
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
      ignore = true
      setLoadingRequests(false)
      source.cancel()
    }
  }, [currentNestId])
  
  // set the ws connection
  useEffect(() => {
    createWSClient(currentNestId, null, setRequests)
  }, [currentNestId])

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

  if (loadingRequests || !currentNestId) return <h3>Loading Requests</h3>

  return (
    <> 
      <h4>List of received requests:</h4>
      <button style={{background: 'red'}} onClick={() => resetCurrentNest()}>Reset Current Nest</button>
      {requests.length === 0 ? 'No requests yet' :
        <div><h4>{requests.length} Received Request{requests.length > 1 ? 's' : ''}</h4><ul id="received-requests">{
          requests.map(r => <RequestListElement r={r} key={r.id}/>)
        }</ul></div>
      }
    </>
  )
}

const RequestListElement = ({r}) => {
  return <li className="request">🎈 {String(r.timeOfArrival)} {r.method} {r.path}</li>
}

export default RequestsList